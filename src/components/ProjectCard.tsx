import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import type { Project } from "@/content/types";

/** Tarjeta mínima: imagen + nombre + lugar y año. Nada más. */
export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <Link href={`/proyectos/${project.slug}`} className="group block">
      <div className="relative aspect-[3/2] overflow-hidden bg-paper-2">
        {/* mismo `name` que la portada de /proyectos/[slug]: la imagen viaja entre páginas */}
        <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
          <div className="absolute inset-0">
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              priority={priority}
              quality={75}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-opacity duration-500 group-hover:opacity-90"
            />
          </div>
        </ViewTransition>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h2 className="font-medium group-hover:underline group-hover:underline-offset-4 group-focus-visible:underline">{project.title}</h2>
        <p className="shrink-0 text-muted">
          {project.location} · {project.year}
        </p>
      </div>
    </Link>
  );
}
