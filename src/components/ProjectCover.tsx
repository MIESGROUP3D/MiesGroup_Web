"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import { expandTransition, shouldSkipMorph } from "@/lib/motion";
import type { Project } from "@/content/types";

/**
 * Portada del proyecto. Mismo `layoutId` que la tarjeta de la grilla (ProjectCard),
 * salvo que se haya abierto desde fuera de la grilla (hero): ahí solo aparece.
 */
export function ProjectCover({ project }: { project: Project }) {
  const [skip] = useState(shouldSkipMorph);
  return (
    <motion.div
      layoutId={skip ? undefined : `cover-${project.slug}`}
      initial={skip ? { opacity: 0, scale: 0.98 } : undefined}
      animate={skip ? { opacity: 1, scale: 1 } : undefined}
      transition={expandTransition}
      className="relative aspect-[3/2] overflow-hidden bg-paper-2"
    >
      {/* `layout` en el hijo: corrige la deformación mientras la celda bento pasa a 3:2 */}
      <motion.div layout transition={expandTransition} className="absolute inset-0">
        <Image src={project.cover.src} alt={project.cover.alt} fill priority quality={80} sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
      </motion.div>
    </motion.div>
  );
}
