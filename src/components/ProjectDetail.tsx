import Image from "next/image";
import Link from "next/link";
import { route, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { getSortedProjects } from "@/content/projects";
import { serviceName } from "@/content/services";
import { t } from "@/content/ui";
import type { Project } from "@/content/types";
import { ProjectCover } from "./ProjectCover";
import { ProjectLink } from "./ProjectLink";
import { VideoFacade } from "./VideoFacade";

/**
 * Contenido de un proyecto (ref. mir.no/work/nodeul-island):
 * - Portada grande casi a pantalla completa, con márgenes laterales mínimos.
 * - Encima de la portada, abajo a la izquierda: dos fichas blancas (nombre + cliente +
 *   resumen; crédito en cursiva + servicios), sans para el nombre y serif para el texto.
 * - Cada render al 90 % del alto de la pantalla, ENTERO (sin recortes) y
 *   centrado: horizontales anchas, verticales angostas; mucho aire entre ellas
 *   para ver una foto por pantalla. Sin textos bajo las fotos (el alt las describe).
 * - En móvil: a todo el ancho y a su altura natural.
 * Lo usan la página /proyectos/[slug] (entrada directa) y el modal de la grilla.
 * `data-fade`: dentro del modal aparece después de que la portada "aterriza".
 */
export function ProjectDetail({ project, lang = "es", inModal = false }: { project: Project; lang?: Locale; inModal?: boolean }) {
  const ui = t(lang);
  const sorted = getSortedProjects(lang);
  const i = sorted.findIndex((p) => p.slug === project.slug);
  const next = sorted[(i + 1) % sorted.length];
  // la portada va primero; el resto sin repetirla
  const rest = project.images.filter((im) => im.src !== project.cover.src);
  const services = project.services.map((s) => serviceName(s, lang)).join(" · ");
  const place = [project.location, project.year].filter(Boolean).join(", ");
  const Title = inModal ? "h2" : "h1";

  return (
    <div className={cn("px-[max(0.75rem,1.5svw)]", inModal ? "pt-16" : "pt-2")}>
      {/*
        Portada casi a pantalla completa con las fichas de texto encima (ref. mir.no):
        dos tarjetas blancas abajo a la izquierda, separadas por una ranura por la que
        se ve la foto. En móvil van debajo de la portada.
      */}
      <div className="relative">
        <div className={cn("relative w-full", inModal ? "h-[calc(100svh-5rem)]" : "h-[calc(100svh-5.5rem)]", "min-h-[420px]")}>
          <ProjectCover project={project} />
        </div>

        <header data-fade className="mt-3 flex flex-col gap-1 md:absolute md:bottom-4 md:left-4 md:mt-0 md:w-[min(30rem,calc(100%-2rem))]">
          <div className="bg-paper px-6 py-7 md:px-10 md:py-8">
            <Title id={`titulo-${project.slug}`} className="text-base font-semibold leading-tight">
              {project.title}
            </Title>
            {project.client && <p className="mt-1 font-serif text-lg leading-snug text-ink-soft">{project.client}</p>}
            <p className="mt-3 font-serif text-[1.0625rem] leading-[1.45]">{project.summary}</p>
          </div>
          <div className="bg-paper px-6 py-7 md:px-10 md:py-8">
            <p className="font-serif text-[1.0625rem] italic leading-[1.45]">
              {ui.projects.credit} {project.client ?? "—"}. {place}.
            </p>
            <p className="mt-4 text-sm">{services}</p>
          </div>
        </header>
      </div>

      {/* Renders: una por pantalla, enteros, al 90 % del alto */}
      <div data-fade className="mt-3 space-y-3 md:mt-[15svh] md:space-y-[15svh]">
        {rest.map((im) => (
          <figure key={im.src} className="flex justify-center">
            <Image
              src={im.src}
              alt={im.alt}
              width={im.width}
              height={im.height}
              quality={80}
              sizes="100vw"
              className="h-auto w-full bg-paper-2 md:h-[90svh] md:w-auto md:max-w-full md:object-contain"
            />
          </figure>
        ))}
        {project.videos?.map((v) => (
          <div key={"id" in v ? v.id : v.src} className="mx-auto max-w-[min(100%,calc(90svh*16/9))]">
            <VideoFacade video={v} fallbackPoster={project.images[1] ?? project.cover} sizes="100vw" />
          </div>
        ))}
      </div>

      {/* Anterior / siguiente, sobrio */}
      <nav data-fade aria-label={ui.projects.more} className="mt-[12svh] flex items-baseline justify-between gap-6 border-t border-line py-6 text-sm">
        {inModal ? (
          <span />
        ) : (
          <Link href={route(lang, "projects")} className="text-muted hover:text-ink">
            {ui.projects.back}
          </Link>
        )}
        <ProjectLink slug={next.slug} morph={false} className="group text-right">
          <span className="text-muted">{ui.projects.nextProject}</span>
          <span className="ml-2 font-semibold group-hover:underline group-hover:underline-offset-4">{next.title} →</span>
        </ProjectLink>
      </nav>
    </div>
  );
}
