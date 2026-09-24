"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import type { MediaImage } from "@/content/types";

/**
 * Dos filas de imágenes que se deslizan en sentidos opuestos mientras se hace
 * scroll vertical (ref. Framer "Sync Scroll Slider" / "Dual Flow Carousel").
 *
 * - El desplazamiento depende de la posición de la sección en pantalla (no de
 *   un temporizador): si no haces scroll, no se mueve.
 * - Un resorte suaviza el movimiento para que no copie los saltos de la rueda.
 * - Decorativo: las imágenes son aria-hidden (el portafolio real está abajo).
 * - Con prefers-reduced-motion las filas quedan quietas.
 */
export function ScrollRows({ rows }: { rows: [MediaImage[], MediaImage[]] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const range = reduce ? ["-15%", "-15%"] : ["0%", "-30%"];
  const x1 = useTransform(progress, [0, 1], range);
  const x2 = useTransform(progress, [0, 1], [...range].reverse());

  return (
    <section ref={ref} aria-hidden className="space-y-3 overflow-hidden py-4 md:space-y-4">
      {[x1, x2].map((x, r) => (
        <motion.div key={r} style={{ x }} className="flex w-max gap-3 md:gap-4">
          {rows[r].map((im) => (
            <div key={im.src} className="relative aspect-[3/2] w-[58vw] shrink-0 overflow-hidden bg-paper-2 sm:w-[40vw] md:w-[26vw]">
              <Image src={im.src} alt="" fill quality={60} sizes="(min-width: 768px) 26vw, 58vw" className="object-cover" />
            </div>
          ))}
        </motion.div>
      ))}
    </section>
  );
}
