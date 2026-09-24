"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { expandTransition, useOpenProject } from "@/lib/motion";
import type { Project } from "@/content/types";

/**
 * Tarjeta de la grilla bento: la imagen llena su celda (grande, alta o ancha)
 * y el nombre va encima, abajo a la izquierda.
 *
 * - Parallax con el mouse (ref. Framer "Asymmetric Grid"): la imagen se
 *   desplaza unos px siguiendo el puntero. Se hace con variables CSS, sin
 *   re-renderizar React.
 * - La celda comparte `layoutId` con la portada del modal: crece desde aquí.
 *   El hijo con `layout` corrige la deformación mientras la celda cambia de
 *   proporción (de bento a 3:2).
 */
export function ProjectCard({ project, priority = false, sizes }: { project: Project; priority?: boolean; sizes: string }) {
  const open = useOpenProject() === project.slug;
  const ref = useRef<HTMLDivElement>(null);
  const parallax = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = parallax.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    el.style.setProperty("--mx", String((e.clientX - r.left) / r.width - 0.5));
    el.style.setProperty("--my", String((e.clientY - r.top) / r.height - 0.5));
  };
  const onLeave = () => {
    parallax.current?.style.setProperty("--mx", "0");
    parallax.current?.style.setProperty("--my", "0");
  };

  return (
    <Link
      href={`/proyectos/${project.slug}`}
      scroll={false}
      className="group relative block h-full"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label={`${project.title} — ${project.location}, ${project.year}`}
    >
      <motion.div
        ref={ref}
        layoutId={`cover-${project.slug}`}
        transition={expandTransition}
        // al volver del modal debe pasar por encima del modal (z-70) que se desvanece
        onLayoutAnimationStart={() => ref.current && (ref.current.style.zIndex = "80")}
        onLayoutAnimationComplete={() => ref.current && (ref.current.style.zIndex = "")}
        className="relative aspect-[4/3] overflow-hidden bg-paper-2 md:aspect-auto md:h-full"
        style={{ visibility: open ? "hidden" : "visible" }}
      >
        <motion.div layout transition={expandTransition} className="absolute inset-0">
          <div
            ref={parallax}
            className={cn(
              "absolute -inset-4 transition-transform duration-700 ease-[cubic-bezier(.39,.14,.26,1)] motion-reduce:transform-none",
              "[transform:translate3d(calc(var(--mx,0)*-16px),calc(var(--my,0)*-16px),0)_scale(1)] group-hover:[transform:translate3d(calc(var(--mx,0)*-16px),calc(var(--my,0)*-16px),0)_scale(1.04)]",
            )}
          >
            <Image src={project.cover.src} alt={project.cover.alt} fill priority={priority} quality={75} sizes={sizes} className="object-cover" />
          </div>
        </motion.div>

        {/* nombre sobre la imagen */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-4 pt-16 text-paper md:p-5 md:pt-20">
          <div className="flex items-end justify-between gap-4">
            <h3 className="text-lg font-medium leading-tight tracking-[-0.02em] md:text-xl">{project.title}</h3>
            <p className="shrink-0 text-sm text-paper/80 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
              {project.location} · {project.year}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
