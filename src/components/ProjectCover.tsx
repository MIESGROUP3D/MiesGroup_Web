"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import { expandTransition, shouldSkipMorph } from "@/lib/motion";
import type { Project } from "@/content/types";

/**
 * Portada del proyecto. Mismo `layoutId` que la tarjeta de la grilla (ProjectCard),
 * salvo que se haya abierto desde fuera de la grilla (hero): ahí solo aparece.
 * Llena su contenedor (por defecto absolute inset-0): en el detalle, la pantalla completa.
 */
export function ProjectCover({ project, className = "absolute inset-0" }: { project: Project; className?: string }) {
  const [skip] = useState(shouldSkipMorph);
  return (
    <motion.div
      layoutId={skip ? undefined : `cover-${project.slug}`}
      initial={skip ? { opacity: 0, scale: 0.98 } : undefined}
      animate={skip ? { opacity: 1, scale: 1 } : undefined}
      // al cerrar sin tarjeta a la que volver (galería de renders, VR/Juegos, "Siguiente"),
      // se desvanece con el fondo en vez de quedarse pegada hasta desmontarse
      exit={{ opacity: 0, transition: { duration: 0.25, ease: "easeOut" } }}
      transition={expandTransition}
      className={`${className} overflow-hidden bg-ink`}
    >
      {/* `layout` en el hijo: corrige la deformación mientras la tarjeta (4:3) pasa a pantalla completa */}
      <motion.div layout transition={expandTransition} className="absolute inset-0">
        <Image src={project.cover.src} alt={project.cover.alt} fill priority quality={80} sizes="100vw" className="object-cover" />
      </motion.div>
    </motion.div>
  );
}
