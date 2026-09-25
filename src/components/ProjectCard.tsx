"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useRef } from "react";
import { expandTransition, getOpenProject, useOpenProject } from "@/lib/motion";
import type { Project } from "@/content/types";
import { ProjectLink } from "./ProjectLink";

/**
 * Tarjeta del portafolio (ref. tienda con sidebar): imagen arriba, barra con
 * nombre y lugar · año abajo, bordes redondeados y una etiqueta opcional
 * ("Nuevo" = del año más reciente del portafolio, "Destacado" = featured).
 *
 * - La imagen comparte `layoutId` con la portada del modal: crece desde aquí.
 *   La tarjeta NO usa overflow-hidden: recortaría la imagen mientras vuela;
 *   cada parte redondea sus propias esquinas. El hijo con `layout` corrige la
 *   deformación mientras la imagen pasa de 4:3 a 3:2.
 */
export function ProjectCard({ project, latestYear, priority = false }: { project: Project; latestYear: number; priority?: boolean }) {
  const open = useOpenProject() === project.slug;
  const ref = useRef<HTMLDivElement>(null);
  const badge = project.year >= latestYear ? "Nuevo" : project.featured ? "Destacado" : null;

  return (
    <ProjectLink
      slug={project.slug}
      className="group block rounded-xl border border-paper/10 bg-paper/[0.04] transition-colors hover:border-paper/25"
      aria-label={`${project.title} — ${project.location}, ${project.year}`}
    >
      <motion.div
        ref={ref}
        layoutId={`cover-${project.slug}`}
        transition={expandTransition}
        // al cerrar el modal vuelve por ENCIMA de él (z-70) mientras se desvanece; si solo se
        // pasó a otro proyecto ("Siguiente") vuelve por debajo, tapada por el modal
        onLayoutAnimationStart={() => ref.current && getOpenProject() === null && (ref.current.style.zIndex = "80")}
        onLayoutAnimationComplete={() => ref.current && (ref.current.style.zIndex = "")}
        className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-ink-soft"
        style={{ visibility: open ? "hidden" : "visible" }}
      >
        <motion.div layout transition={expandTransition} className="absolute inset-0">
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            priority={priority}
            quality={75}
            sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(.39,.14,.26,1)] group-hover:scale-[1.04] motion-reduce:transform-none"
          />
        </motion.div>
        {badge && <span className="absolute left-3 top-3 rounded-full bg-paper px-2.5 py-1 text-xs font-medium text-ink">{badge}</span>}
      </motion.div>

      <div className="px-4 py-3.5">
        <h3 className="font-medium leading-snug text-paper">{project.title}</h3>
        <p className="mt-0.5 text-sm text-paper/60">
          {project.location} · {project.year}
        </p>
      </div>
    </ProjectLink>
  );
}
