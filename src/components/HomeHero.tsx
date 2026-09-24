"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { MediaImage, Project } from "@/content/types";
import { ProjectLink } from "./ProjectLink";

const ease = [0.39, 0.14, 0.26, 1] as const;
const SLIDE_SECONDS = 6;

/**
 * Hero de la home: presentación de proyectos destacados.
 *
 * - Cada imagen nueva entra en franjas verticales (SliceReveal) sobre la
 *   anterior, con un acercamiento lento (Ken Burns).
 * - Barras de progreso abajo a la derecha: la barra activa se llena con una
 *   animación CSS y al terminar (`animationend`) pasa a la siguiente. Así el
 *   tiempo y lo que se ve nunca se desincronizan.
 * - Pausa con foco de teclado dentro o con el botón Pausar
 *   (WCAG 2.2.2). No pausa al pasar el mouse: el hero ocupa casi toda la
 *   pantalla y nunca avanzaría. Con prefers-reduced-motion no avanza solo.
 * - Cada barra es un botón para saltar a ese proyecto.
 */
export function HomeHero({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  // [actual, anterior]: la anterior queda debajo mientras la nueva entra en franjas
  const [[index, prev], setSlide] = useState<[number, number | null]>([0, null]);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const current = projects[index];
  const running = !reduce && !focused && !paused;
  const goTo = (i: number) => setSlide(([cur, p]) => (i === cur ? [cur, p] : [i, cur]));
  const next = () => setSlide(([cur]) => [(cur + 1) % projects.length, cur]);

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Proyectos destacados"
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink"
      // solo foco de teclado: un clic en una barra también enfoca y no debe pausar
      onFocus={(e) => setFocused(e.target.matches(":focus-visible"))}
      onBlur={() => setFocused(false)}
    >
      {/* precarga: las portadas que no se ven quedan montadas e invisibles */}
      {projects.map(
        (p, i) =>
          i !== index &&
          i !== prev && (
            <div key={p.slug} aria-hidden className="absolute inset-0 opacity-0">
              <Image src={p.cover.src} alt="" fill quality={80} sizes="100vw" className="object-cover" />
            </div>
          ),
      )}
      {/* la anterior, quieta debajo */}
      {prev !== null && (
        <div key={`prev-${prev}`} aria-hidden className="absolute inset-0">
          <Image src={projects[prev].cover.src} alt="" fill quality={80} sizes="100vw" className="object-cover" />
        </div>
      )}
      {/* la actual: entra en franjas (salvo la primera, que ya está) */}
      <SliceReveal key={index} image={current.cover} reveal={prev !== null} priority={index === 0} />

      {/* legibilidad: logo arriba, texto y controles abajo */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent" />

      <div className="shell absolute inset-x-0 bottom-0 flex flex-col gap-6 pb-8 pr-14 text-paper md:flex-row md:items-end md:justify-between md:pb-10 md:pr-16">
        <div aria-live={running ? "off" : "polite"} className="min-h-[4.5rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.slug}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease }}
            >
              <p className="text-sm text-paper/75">
                {current.location} · {current.year}
              </p>
              <ProjectLink
                slug={current.slug}
                // desde el hero la portada solo aparece (la tarjeta de la grilla está lejos)
                morph={false}
                className="group mt-1 inline-flex items-baseline gap-3 text-4xl font-medium tracking-[-0.035em] md:text-7xl"
              >
                {current.title}
                <span aria-hidden className="text-xl transition-transform duration-500 group-hover:translate-x-1.5 md:text-2xl">
                  →
                </span>
              </ProjectLink>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4">
          <ol className="flex gap-2">
            {projects.map((p, i) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Ver ${p.title} (${i + 1} de ${projects.length})`}
                  aria-current={i === index ? "true" : undefined}
                  className="group block py-3"
                >
                  <span className="relative block h-0.5 w-10 overflow-hidden bg-paper/35 md:w-14">
                    {i < index && <span className="absolute inset-0 bg-paper" />}
                    {i === index && (
                      <span
                        key={index}
                        className={cn("absolute inset-0 origin-left bg-paper", reduce ? "" : "animate-[hero-progress_linear_forwards]")}
                        style={reduce ? undefined : { animationDuration: `${SLIDE_SECONDS}s`, animationPlayState: running ? "running" : "paused" }}
                        onAnimationEnd={next}
                      />
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <span className="w-10 text-sm tabular-nums text-paper/75">
            {String(index + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")}
          </span>
          {!reduce && (
            <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} className="text-sm text-paper/75 hover:text-paper">
              {paused ? "Reanudar" : "Pausar"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

const SLICES = 5;

/**
 * Imagen que entra en franjas verticales escalonadas, de abajo hacia arriba
 * (ref. Framer "Slice Slider"). Toda la diapositiva hace además un acercamiento
 * lento (Ken Burns) que termina en escala 1, así el relevo con la siguiente no salta.
 */
function SliceReveal({ image, reveal, priority }: { image: MediaImage; reveal: boolean; priority: boolean }) {
  const sizes = "100vw";
  return (
    <motion.div className="absolute inset-0" initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: SLIDE_SECONDS + 1.2, ease: "linear" }}>
      {!reveal ? (
        <Image src={image.src} alt={image.alt} fill priority={priority} quality={80} sizes={sizes} className="object-cover" />
      ) : (
        Array.from({ length: SLICES }, (_, k) => (
          <div key={k} className="absolute inset-y-0 overflow-hidden" style={{ left: `${(k * 100) / SLICES}%`, width: `${100 / SLICES}%` }}>
            <motion.div className="absolute inset-0" initial={{ y: "100%" }} animate={{ y: "0%" }} transition={{ duration: 1.1, ease, delay: k * 0.08 }}>
              {/* la imagen completa, desplazada para que cada franja muestre su parte */}
              <div className="absolute inset-y-0" style={{ left: `${-k * 100}%`, width: `${SLICES * 100}%` }}>
                <Image src={image.src} alt={k === 0 ? image.alt : ""} fill quality={80} sizes={sizes} className="object-cover" />
              </div>
            </motion.div>
          </div>
        ))
      )}
    </motion.div>
  );
}
