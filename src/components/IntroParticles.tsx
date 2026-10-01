"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { withBase } from "@/lib/basePath";
import { INTRO_LOGO } from "@/lib/brand";

/**
 * Intro de entrada: partículas que vuelan desde toda la pantalla y forman el
 * logo (ref. Framer "Particle Reveal Pro"), luego el logo queda nítido y la
 * capa se desvanece hacia el sitio.
 *
 * - SIEMPRE en cada pestaña nueva (pedido del cliente); al recargar o volver
 *   atrás/adelante en la misma pestaña no se repite (marca en window.name). Un script inline en el <head> (layout.tsx) marca
 *   `html.intro-seen` ANTES de pintar, así no hay ni un frame de pantalla blanca.
 * - NO se puede saltar (pedido del cliente): sin clic/tecla/scroll para
 *   cerrarla y con el scroll de la página bloqueado mientras dura (~3–4 s).
 * - Con prefers-reduced-motion no se muestra (CSS): es una protección para
 *   personas sensibles al movimiento. Si el JS fallara, la capa se oculta sola (animación CSS
 *   de respaldo en globals.css).
 * - Canvas 2D: ~1.5–2.5k partículas, un solo requestAnimationFrame.
 */
/** Marca en window.name: dura mientras viva la pestaña (sobrevive a recargas) y NO pasa a pestañas nuevas. */
const TAB_MARK = "mies-intro";
const FORM_MS = 1500; // vuelo hasta el logo
const SPREAD_MS = 450; // desfase máximo entre partículas
const HOLD_MS = 700; // logo nítido en pantalla
const FADE_MS = 700; // desvanecido de la capa
const MAX_MS = 8000; // tope de seguridad: pase lo que pase, la capa blanca se retira

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

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      const id = setTimeout(() => setPhase("done"));
      return () => clearTimeout(id);
    }

    // el JS tomó el control: se desactiva el respaldo CSS (globals.css), que solo existe
    // por si el JS no carga; desde aquí los tiempos los manejan whenVisible + MAX_MS
    canvas.parentElement?.setAttribute("data-live", "");

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
      // cargar el logo oficial completo (con "3D Studio"), precargado desde el <head>.
      // Si tarda más de 4 s o falla, la intro se arma igual con el nombre en texto.
      const logo = new Image();
      logo.src = withBase(INTRO_LOGO);
      const loaded = await Promise.race([logo.decode().then(() => true, () => false), new Promise<boolean>((r) => setTimeout(() => r(false), 4000))]);
      if (finished) return;
      // se marca como vista recién cuando de verdad arranca (no antes de cargar)
      window.name = TAB_MARK;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (!w || !h) return finish(); // sin tamaño no hay nada que dibujar: mostrar el sitio
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 1) dibujar el logo en un canvas oculto y leer sus píxeles
      const lw = Math.min(w * 0.8, 900);
      const lh = loaded ? (lw * logo.naturalHeight) / logo.naturalWidth : lw * 0.15;
      const x = (w - lw) / 2;
      const y = (h - lh) / 2;
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return finish();
      const fontPx = lh * 0.75;
      const draw = (c: CanvasRenderingContext2D) => {
        if (loaded) return c.drawImage(logo, x, y, lw, lh);
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.font = `600 ${fontPx}px "Instrument Sans Variable", "Helvetica Neue", Arial, sans-serif`;
        c.fillText("MIESGROUP", w / 2, h / 2, lw);
      };
      draw(o);

      const data = o.getImageData(0, 0, w, h).data;
      const gap = Math.max(3, Math.round(lw / 180));
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
    // la pestaña puede abrirse en segundo plano o pre-renderizada (ancho 0, sin cuadros de
    // animación): esperar a que sea visible para medir y animar
    const whenVisible = () =>
      document.visibilityState === "visible"
        ? Promise.resolve()
        : new Promise<void>((r) => {
            const on = () => {
              if (document.visibilityState !== "visible") return;
              document.removeEventListener("visibilitychange", on);
              r();
            };
            document.addEventListener("visibilitychange", on);
          });
    // NUNCA dejar la pantalla en blanco: tope fijo desde que monta (aunque la pestaña siga
    // oculta o algo se trabe) y cualquier error → mostrar el sitio
    timers.push(setTimeout(finish, MAX_MS));
    whenVisible()
      .then(() => (finished ? undefined : start()))
      .catch(finish);

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
