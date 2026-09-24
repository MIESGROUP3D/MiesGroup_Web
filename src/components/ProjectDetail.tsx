import Image from "next/image";
import Link from "next/link";
import { sortedProjects } from "@/content/projects";
import { serviceName } from "@/content/services";
import type { Project } from "@/content/types";
import { ProjectCover } from "./ProjectCover";
import { ProjectLink } from "./ProjectLink";
import { VideoFacade } from "./VideoFacade";

/**
 * Contenido de un proyecto (referencia mir.no): nombre, datos en una línea,
 * un párrafo y las imágenes una tras otra. Lo usan la página /proyectos/[slug]
 * (entrada directa) y el modal que se abre desde la grilla.
 */
export function ProjectDetail({ project, inModal = false }: { project: Project; inModal?: boolean }) {
  const i = sortedProjects.findIndex((p) => p.slug === project.slug);
  const next = sortedProjects[(i + 1) % sortedProjects.length];
  // la portada va primero; el resto sin repetirla
  const rest = project.images.filter((im) => im.src !== project.cover.src);
  const meta = [project.client, project.location, String(project.year), project.services.map(serviceName).join(", ")].filter(Boolean);
  const Title = inModal ? "h2" : "h1";

  return (
    <>
      <header data-fade className="grid gap-4 pb-8 md:grid-cols-2 md:gap-6">
        <div>
          <Title id={`titulo-${project.slug}`} className="display text-3xl md:text-4xl">{project.title}</Title>
          <p className="mt-2 text-muted">{meta.join(" · ")}</p>
        </div>
        <p className="max-w-xl text-ink-soft md:pt-1">{project.summary}</p>
      </header>

      <ProjectCover project={project} />

      {/* data-fade: dentro del modal aparece después de que la portada "aterriza" */}
      <div data-fade className="mt-6 space-y-6">
        {rest.map((im) => (
          <div key={im.src} className="relative bg-paper-2" style={{ aspectRatio: `${im.width}/${im.height}` }}>
            <Image src={im.src} alt={im.alt} fill quality={80} sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
          </div>
        ))}

        {project.videos?.map((v) => (
          <VideoFacade key={"id" in v ? v.id : v.src} video={v} fallbackPoster={project.images[1] ?? project.cover} sizes="100vw" />
        ))}
      </div>

      {project.specs && (
        <dl data-fade className="mt-8 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-[10rem_1fr]">
          {Object.entries(project.specs).map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )}

      <nav data-fade aria-label="Más proyectos" className="mt-16 flex justify-between gap-6 border-t border-line pt-6">
        {inModal ? <span /> : <Link href="/" className="text-muted hover:text-ink">← Todos los proyectos</Link>}
        <ProjectLink slug={next.slug} className="text-right hover:underline hover:underline-offset-4">
          <span className="text-muted">Siguiente: </span>
          {next.title} →
        </ProjectLink>
      </nav>
    </>
  );
}
