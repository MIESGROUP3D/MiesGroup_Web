"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Intro de entrada: partículas que vuelan desde toda la pantalla y forman el
 * logo (ref. Framer "Particle Reveal Pro"), luego el logo queda nítido y la
 * capa se desvanece hacia el sitio.
 *
 * - Una vez por sesión (sessionStorage). Un script inline en el <head>
 *   (layout.tsx) marca `html.intro-seen` ANTES de pintar, así en visitas
 *   siguientes no hay ni un frame de pantalla blanca.
 * - NO se puede saltar (pedido del cliente): sin clic/tecla/scroll para
 *   cerrarla y con el scroll de la página bloqueado mientras dura (~3–4 s).
 * - Con prefers-reduced-motion no se muestra (CSS): es una protección para
 *   personas sensibles al movimiento. Si el JS fallara, la capa se oculta sola (animación CSS
 *   de respaldo en globals.css).
 * - Canvas 2D: ~1.5–2.5k partículas, un solo requestAnimationFrame.
 */
const STORAGE_KEY = "mies-intro";
const FORM_MS = 1500; // vuelo hasta el logo
const SPREAD_MS = 450; // desfase máximo entre partículas
const HOLD_MS = 700; // logo nítido en pantalla
const FADE_MS = 700; // desvanecido de la capa

type Particle = { x0: number; y0: number; tx: number; ty: number; delay: number; size: number };

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const noopSubscribe = () => () => {};
const shouldSkip = () =>
  document.documentElement.classList.contains("intro-seen") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function IntroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"play" | "fade" | "done">("play");
  // ya vista en esta sesión o movimiento reducido: no se muestra (en el servidor sí se pinta)
  const skip = useSyncExternalStore(noopSubscribe, shouldSkip, () => false);

  useEffect(() => {
    if (skip) return;
    const root = document.documentElement;
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      const id = setTimeout(() => setPhase("done"));
      return () => clearTimeout(id);
    }

    // sin scroll mientras dura la intro (la página se movería por detrás sin verse)
    root.style.overflow = "hidden";

    let raf = 0;
    let finished = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      root.style.overflow = "";
      setPhase("fade");
      timers.push(setTimeout(() => setPhase("done"), FADE_MS));
    };

    const start = async () => {
      // esperar la tipografía (máx. 600 ms) para muestrear el logo con la fuente real
      await Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 600))]);
      if (finished) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 1) dibujar el logo en un canvas oculto y leer sus píxeles
      const size = Math.min(w * 0.16, 190);
      const bold = `600 ${size}px "Instrument Sans Variable", "Helvetica Neue", Arial, sans-serif`;
      const regular = `400 ${size}px "Instrument Sans Variable", "Helvetica Neue", Arial, sans-serif`;
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return finish();
      o.textBaseline = "middle";
      o.font = bold;
      const wA = o.measureText("mies").width;
      o.font = regular;
      const wB = o.measureText("group").width;
      const x = (w - wA - wB) / 2;
      const draw = (c: CanvasRenderingContext2D) => {
        c.textBaseline = "middle";
        c.font = bold;
        c.fillText("mies", x, h / 2);
        c.font = regular;
        c.fillText("group", x + wA, h / 2);
      };
      draw(o);

      const data = o.getImageData(0, 0, w, h).data;
      const gap = Math.max(3, Math.round(size / 38));
      const dot = Math.max(2, gap * 0.7);
      // "sólido" = píxel claramente dentro de la letra (no el borde suavizado)
      const solid = (x: number, y: number) => {
        const xi = Math.round(x);
        const yi = Math.round(y);
        return xi >= 0 && yi >= 0 && xi < w && yi < h && data[(yi * w + xi) * 4 + 3] > 220;
      };
      const reach = dot / 2 + 1;
      const particles: Particle[] = [];
      for (let py = gap / 2; py < h; py += gap) {
        for (let px = gap / 2; px < w; px += gap) {
          // el punto entero (centro y sus 4 bordes) debe caer dentro de la letra:
          // así ninguno asoma por fuera del contorno
          if (!solid(px, py) || !solid(px - reach, py) || !solid(px + reach, py) || !solid(px, py - reach) || !solid(px, py + reach)) continue;
          const a = Math.random() * Math.PI * 2;
          const r = Math.max(w, h) * (0.35 + Math.random() * 0.5);
          particles.push({
            x0: w / 2 + Math.cos(a) * r,
            y0: h / 2 + Math.sin(a) * r,
            tx: px,
            ty: py,
            delay: Math.random() * SPREAD_MS,
            size: dot,
          });
        }
      }

      // 2) animar: vuelo → logo nítido → desvanecido
      const t0 = performance.now();
      const ink = getComputedStyle(root).getPropertyValue("--color-ink").trim() || "#0a0a0a";
      const frame = (now: number) => {
        const t = now - t0;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = ink;
        // al terminar el vuelo, fundido cruzado: las partículas se van y el logo
        // real (bordes nítidos) queda solo; el último cuadro no tiene ningún punto
        const crisp = Math.min(1, Math.max(0, (t - FORM_MS - SPREAD_MS) / 400));
        let settled = true;
        if (crisp < 1) {
          for (const p of particles) {
            const k = Math.min(1, Math.max(0, (t - p.delay) / FORM_MS));
            if (k < 1) settled = false;
            const e = easeOutCubic(k);
            ctx.globalAlpha = Math.min(1, k * 3) * (1 - crisp);
            // centrado en su muestra (antes se dibujaba desde la esquina y se corría)
            ctx.fillRect(p.x0 + (p.tx - p.x0) * e - p.size / 2, p.y0 + (p.ty - p.y0) * e - p.size / 2, p.size, p.size);
          }
        }
        if (crisp > 0) {
          ctx.globalAlpha = crisp;
          draw(ctx);
        }
        ctx.globalAlpha = 1;
        if (settled && t > FORM_MS + SPREAD_MS + HOLD_MS) return finish();
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };
    start();

    return () => {
      finished = true;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      root.style.overflow = "";
    };
  }, [skip]);

  if (skip || phase === "done") return null;
  return (
    <div
      aria-hidden
      className="intro fixed inset-0 z-[100] bg-paper transition-opacity ease-out"
      style={{ opacity: phase === "fade" ? 0 : 1, transitionDuration: `${FADE_MS}ms`, pointerEvents: phase === "fade" ? "none" : "auto" }}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}
