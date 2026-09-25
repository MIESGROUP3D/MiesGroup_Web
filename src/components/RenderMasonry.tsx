"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { MediaImage, Project } from "@/content/types";
import { ProjectLink } from "./ProjectLink";

/*
 * ⚠ MOCKUP: los placeholders tienen todos la misma proporción (2000×1250), así
 * que se recortan con este patrón para que el mosaico tenga alturas variadas
 * como la galería del sitio actual. Con los renders reales, poner
 * USE_REAL_RATIO = true: cada imagen usa su proporción verdadera (width/height de img()).
 */
const USE_REAL_RATIO = false;
const MOCK_RATIOS = ["4/5", "3/2", "1/1", "16/10", "3/4", "3/2", "4/3", "5/4"];

/**
 * Galería de renders en mosaico (categoría "3D Rendering"): todas las imágenes
 * de los proyectos, 4 columnas de alturas variadas, separación mínima y sin
 * marcos. Al pasar el mouse: leve oscurecido, cruz fina al centro y nombre del
 * proyecto. Clic → abre el proyecto en el modal.
 *
 * Columnas CSS (columns-*): cada imagen conserva su alto; el orden va de arriba
 * abajo por columna.
 */
export function RenderMasonry({ projects }: { projects: Project[] }) {
  const items: { project: Project; image: MediaImage }[] = projects.flatMap((p) => p.images.map((image) => ({ project: p, image })));

  return (
    <ul className="columns-1 gap-2 sm:columns-2 lg:columns-3 xl:columns-4">
      {items.map(({ project, image }, i) => (
        <motion.li
          key={image.src}
          className="mb-2 break-inside-avoid"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -5% 0px" }}
          transition={{ duration: 0.5, ease: [0.39, 0.14, 0.26, 1], delay: (i % 4) * 0.04 }}
        >
          <ProjectLink slug={project.slug} morph={false} aria-label={`${image.alt} — ver proyecto ${project.title}`} className="group relative block overflow-hidden bg-ink-soft">
            <div className="relative" style={{ aspectRatio: USE_REAL_RATIO ? `${image.width}/${image.height}` : MOCK_RATIOS[i % MOCK_RATIOS.length] }}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                quality={70}
                sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(.39,.14,.26,1)] group-hover:scale-[1.03] motion-reduce:transform-none"
              />
            </div>
            {/* hover: oscurecido + cruz fina + nombre */}
            <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/35 group-focus-visible:bg-ink/35" />
            <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 scale-75 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-paper" />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-paper" />
            </span>
            <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 text-sm font-medium text-paper opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
              {project.title}
            </span>
          </ProjectLink>
        </motion.li>
      ))}
    </ul>
  );
}
