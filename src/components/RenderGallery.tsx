"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import type { MediaImage, Project } from "@/content/types";
import { ProjectLink } from "./ProjectLink";
import { t } from "@/content/ui";
import { useLang } from "@/lib/useLang";

/*
 * Filas alternadas (ref. mir.no): una de 3 imágenes verticales y otra de 4
 * un poco más bajas. Cada imagen se recorta a la proporción de su fila
 * (object-cover), así todas las de una fila tienen el mismo alto.
 */
type Layout = { grid: string; aspect: string; sizes: string };

/** Diseño de fila según cuántas imágenes lleva (la última puede quedar incompleta). */
const LAYOUTS: Record<number, Layout> = {
  1: { grid: "grid-cols-1", aspect: "aspect-[16/9]", sizes: "100vw" },
  2: { grid: "grid-cols-1 md:grid-cols-2", aspect: "aspect-[4/3]", sizes: "(min-width: 768px) 50vw, 100vw" },
  3: { grid: "grid-cols-1 md:grid-cols-3", aspect: "aspect-[3/4]", sizes: "(min-width: 768px) 33vw, 100vw" },
  4: { grid: "grid-cols-2 md:grid-cols-4", aspect: "aspect-[4/5]", sizes: "(min-width: 768px) 25vw, 50vw" },
};
const PATTERN = [3, 4];

type Item = { project: Project; image: MediaImage };

/** Reparte las imágenes en filas de 3 y 4, alternando; la última usa el diseño de las que le queden. */
function toRows(items: Item[]) {
  const rows: { items: Item[]; layout: Layout }[] = [];
  let i = 0;
  for (let r = 0; i < items.length; r++) {
    const chunk = items.slice(i, i + PATTERN[r % PATTERN.length]);
    rows.push({ items: chunk, layout: LAYOUTS[chunk.length] });
    i += chunk.length;
  }
  return rows;
}

/**
 * Galería de renders (categoría "3D Rendering"): todas las imágenes de los
 * proyectos en filas alternadas de 3 y 4, con el nombre centrado abajo.
 * Clic → abre el proyecto en el modal.
 */
export function RenderGallery({ projects }: { projects: Project[] }) {
  const viewProject = t(useLang()).projects.viewProject;
  const items: Item[] = projects.flatMap((p) => p.images.map((image) => ({ project: p, image })));

  return (
    <div className="space-y-3 md:space-y-4">
      {toRows(items).map((row, r) => (
        <ul key={r} className={cn("grid gap-3 md:gap-4", row.layout.grid)}>
          {row.items.map(({ project, image }, i) => (
            <motion.li
              key={image.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -5% 0px" }}
              transition={{ duration: 0.6, ease: [0.39, 0.14, 0.26, 1], delay: i * 0.05 }}
            >
              <ProjectLink
                slug={project.slug}
                morph={false}
                aria-label={`${image.alt} — ${viewProject} ${project.title}`}
                className={cn("group relative block overflow-hidden bg-ink-soft", row.layout.aspect)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  quality={75}
                  sizes={row.layout.sizes}
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(.39,.14,.26,1)] group-hover:scale-[1.03] motion-reduce:transform-none"
                />
                {/* nombre centrado abajo, siempre visible */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center bg-gradient-to-t from-ink/65 via-ink/15 to-transparent px-4 pb-5 pt-20 text-center text-paper">
                  <span className="text-xs text-paper/85">
                    {project.location} · {project.year}
                  </span>
                  <span className="mt-0.5 text-lg font-semibold leading-tight tracking-[-0.02em] [text-shadow:0_1px_10px_rgb(0_0_0/0.35)] md:text-xl">
                    {project.title}
                  </span>
                </span>
              </ProjectLink>
            </motion.li>
          ))}
        </ul>
      ))}
    </div>
  );
}
