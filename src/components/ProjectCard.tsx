import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { categoryLabels } from "@/content/projects";
import { serviceName } from "@/content/services";
import type { Project } from "@/content/types";

export function ProjectCard({ project, index, size = "md", priority = false }: { project: Project; index: number; size?: "lg" | "md"; priority?: boolean }) {
  return (
    <Link href={`/proyectos/${project.slug}`} className="group block" aria-label={`${project.title} — ${project.location}, ${project.year}`}>
      <div className={cn("crosshair relative overflow-hidden bg-ink-3", size === "lg" ? "aspect-[16/10]" : "aspect-[4/3]")}>
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          priority={priority}
          quality={75}
          sizes={size === "lg" ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 42vw, 100vw"}
          className="object-cover transition duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute right-4 top-4 grid size-11 translate-y-2 place-items-center bg-bronze text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-5" />
        </span>
        <span className="absolute bottom-4 left-4 flex flex-wrap gap-1.5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {project.services.map((s) => (
            <span key={s} className="bg-ink/70 px-2 py-1 font-mono text-[0.62rem] uppercase tracking-wider backdrop-blur">{serviceName(s)}</span>
          ))}
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs text-bronze">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="display text-3xl transition-colors group-hover:text-bronze md:text-4xl">{project.title}</h3>
        </div>
        <p className="font-mono sm:shrink-0 sm:text-right text-[0.7rem] uppercase tracking-wider text-muted">
          {categoryLabels[project.category]} · {project.location} · {project.year}
        </p>
      </div>
    </Link>
  );
}
