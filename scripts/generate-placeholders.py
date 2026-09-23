"""
Genera imágenes PLACEHOLDER con aspecto de render arquitectónico (procedural).
Solo existen para que el mockup se vea completo mientras llegan los renders reales
del cliente. Reemplázalas en public/media/... manteniendo los mismos nombres
(o cambia las rutas en src/content/).

Uso:  python3 scripts/generate-placeholders.py
Requiere: pip install pillow numpy
"""
from __future__ import annotations

import os
import random
from dataclasses import dataclass

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "media")
W, H = 2000, 1250


@dataclass
class Mood:
    sky_top: tuple[int, int, int]
    sky_bottom: tuple[int, int, int]
    sun: tuple[int, int, int]
    ground: tuple[int, int, int]
    lit: float  # probabilidad de ventana iluminada


MOODS = {
    "dusk": Mood((28, 30, 52), (214, 142, 92), (255, 196, 128), (22, 20, 22), 0.55),
    "day": Mood((96, 138, 184), (206, 214, 220), (255, 250, 236), (58, 60, 58), 0.05),
    "night": Mood((6, 8, 16), (30, 34, 52), (120, 130, 170), (8, 8, 10), 0.75),
    "fog": Mood((150, 150, 148), (206, 202, 194), (240, 236, 226), (96, 94, 90), 0.2),
    "golden": Mood((70, 64, 70), (236, 176, 108), (255, 214, 150), (40, 32, 26), 0.3),
}


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def sky(mood: Mood, horizon: int, sun_x: int) -> np.ndarray:
    y = np.linspace(0, 1, horizon)[:, None]
    top = np.array(mood.sky_top, dtype=np.float32)
    bot = np.array(mood.sky_bottom, dtype=np.float32)
    grad = top + (bot - top) * (y ** 1.6)[..., None]
    grad = np.repeat(grad, W, axis=1)
    # halo del sol
    xs = np.arange(W)[None, :]
    ys = np.arange(horizon)[:, None]
    d = np.sqrt((xs - sun_x) ** 2 + ((ys - horizon) * 1.6) ** 2)
    glow = np.exp(-d / (W * 0.18))[..., None]
    grad = grad + (np.array(mood.sun, dtype=np.float32) - grad) * glow * 0.75
    return grad


def building(draw: ImageDraw.ImageDraw, rng: random.Random, mood: Mood, kind: str, horizon: int):
    """Dibuja un edificio de losas horizontales con muro cortina."""
    cx = rng.randint(int(W * 0.35), int(W * 0.65))
    if kind == "tower":
        floors, fh, width = rng.randint(14, 22), rng.randint(34, 42), rng.randint(360, 520)
        widths = [width] * floors
    elif kind == "stepped":
        floors, fh = rng.randint(6, 9), rng.randint(56, 70)
        base = rng.randint(1100, 1400)
        widths = [int(base * (1 - i * 0.09)) for i in range(floors)]
    else:  # pavilion
        floors, fh = rng.randint(2, 3), rng.randint(110, 140)
        widths = [rng.randint(1300, 1600)] * floors

    slab = lerp(mood.ground, (230, 226, 218), 0.55)
    frame = lerp(mood.ground, (0, 0, 0), 0.4)
    y = horizon
    for f in range(floors):
        w = widths[f]
        x0, x1 = cx - w // 2, cx + w // 2
        top = y - fh
        # vidrio: reflejo del cielo, degradado vertical
        glass_a = lerp(mood.sky_top, mood.sky_bottom, 0.35)
        glass_b = lerp(mood.sky_top, (10, 12, 16), 0.5)
        for yy in range(top + 6, y):
            t = (yy - top) / fh
            draw.line([(x0, yy), (x1, yy)], fill=lerp(glass_a, glass_b, t))
        # montantes
        step = rng.choice([28, 36, 44]) if kind != "pavilion" else 90
        for xx in range(x0, x1, step):
            if rng.random() < mood.lit:
                warm = lerp((255, 190, 120), (255, 226, 170), rng.random())
                draw.rectangle([xx + 3, top + 10, xx + step - 3, y - 4], fill=warm)
            draw.line([(xx, top + 6), (xx, y)], fill=frame, width=2)
        # losa
        draw.rectangle([x0 - 10, top, x1 + 10, top + 7], fill=slab)
        y = top
    # cubierta
    draw.rectangle([cx - widths[-1] // 2 - 16, y - 10, cx + widths[-1] // 2 + 16, y], fill=slab)
    return cx


def hills(draw, rng, mood, horizon):
    col = lerp(mood.sky_bottom, mood.ground, 0.55)
    pts = [(0, horizon)]
    x = 0
    while x <= W:
        pts.append((x, horizon - rng.randint(20, 120)))
        x += rng.randint(80, 200)
    pts += [(W, horizon), (0, horizon)]
    draw.polygon(pts, fill=col)


def grain_and_vignette(img: Image.Image, rng: random.Random) -> Image.Image:
    arr = np.asarray(img).astype(np.float32)
    noise = np.random.default_rng(rng.randint(0, 10_000)).normal(0, 5, arr.shape[:2])[..., None]
    arr += noise
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
    arr *= (1 - np.clip(d - 0.55, 0, 1) * 0.55)[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def label(img: Image.Image, text: str):
    d = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("DejaVuSansMono.ttf", 22)
    except OSError:
        font = ImageFont.load_default()
    d.text((36, H - 56), f"PLACEHOLDER · {text}", fill=(236, 231, 223), font=font)


def render(path: str, seed: int, mood_name: str, kind: str, text: str):
    rng = random.Random(seed)
    mood = MOODS[mood_name]
    horizon = int(H * rng.uniform(0.6, 0.7))
    sun_x = rng.randint(int(W * 0.15), int(W * 0.85))

    canvas = np.zeros((H, W, 3), dtype=np.float32)
    canvas[:horizon] = sky(mood, horizon, sun_x)
    img = Image.fromarray(canvas.astype(np.uint8))
    draw = ImageDraw.Draw(img)
    hills(draw, rng, mood, horizon)
    building(draw, rng, mood, kind, horizon)

    # suelo + espejo de agua con reflejo difuminado
    upper = img.crop((0, 0, W, horizon))
    refl = upper.transpose(Image.FLIP_TOP_BOTTOM).filter(ImageFilter.GaussianBlur(6))
    refl = refl.resize((W, H - horizon))
    ground = Image.new("RGB", (W, H - horizon), mood.ground)
    water = Image.blend(ground, refl, 0.62)
    img.paste(water, (0, horizon))
    draw = ImageDraw.Draw(img)
    draw.line([(0, horizon), (W, horizon)], fill=lerp(mood.sky_bottom, (255, 255, 255), 0.3), width=2)

    img = grain_and_vignette(img, rng)
    label(img, text)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "JPEG", quality=84, optimize=True, progressive=True)


PROJECTS = {
    "torre-aurora": ("tower", ["dusk", "night", "fog", "golden"]),
    "pabellon-lago": ("pavilion", ["day", "golden", "dusk", "fog"]),
    "terrazas-del-valle": ("stepped", ["golden", "day", "dusk", "night"]),
    "edificio-cumbre": ("tower", ["day", "fog", "night", "golden"]),
    "casa-mirador": ("pavilion", ["night", "dusk", "day", "golden"]),
    "centro-empresarial-norte": ("stepped", ["fog", "dusk", "day", "night"]),
}

if __name__ == "__main__":
    seed = 7
    for slug, (kind, moods) in PROJECTS.items():
        for i, mood in enumerate(moods, start=1):
            seed += 1
            render(os.path.join(ROOT, "projects", slug, f"{i:02d}.jpg"), seed, mood, kind, f"{slug} {i:02d}")
            print("ok", slug, i)
    render(os.path.join(ROOT, "hero", "hero.jpg"), 404, "dusk", "tower", "hero")
    render(os.path.join(ROOT, "games", "torre-demo.jpg"), 505, "night", "stepped", "portada juego")
    print("listo")
