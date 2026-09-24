"use client";

import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Ticker vertical infinito (referencia: motion.dev ticker-y-axis, replicado con
 * `motion` gratuito en vez del Ticker de Motion+).
 *
 * - El contenido se pinta dos veces; al subir una copia entera se reinicia sin salto.
 * - Se pausa con el mouse encima, con foco de teclado dentro y con el botón
 *   Pausar (WCAG 2.2.2: todo lo que se mueve solo debe poder detenerse).
 * - Con prefers-reduced-motion no se mueve.
 * - La copia duplicada es `inert`: ni lectores de pantalla ni Tab la recorren.
 */
export function TickerY({ children, speed = 28, className }: { children: React.ReactNode; speed?: number; className?: string }) {
  const reduce = useReducedMotion();
  const copyRef = useRef<HTMLDivElement>(null);
  const loop = useRef(0);
  const y = useMotionValue(0);
  const [hover, setHover] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = copyRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => (loop.current = el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (reduce || hover || paused || !loop.current) return;
    let next = y.get() - (speed * delta) / 1000;
    if (next <= -loop.current) next += loop.current;
    y.set(next);
  });

  return (
    <div className={cn("flex flex-col", className)}>
      <div
        className="relative min-h-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_10%,#000_90%,transparent)]"
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
      >
        <motion.div style={{ y }}>
          <div ref={copyRef}>{children}</div>
          <div aria-hidden inert>
            {children}
          </div>
        </motion.div>
      </div>
      {!reduce && (
        <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} className="mt-3 self-end text-sm text-muted hover:text-ink">
          {paused ? "Reanudar" : "Pausar"}
        </button>
      )}
    </div>
  );
}
