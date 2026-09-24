import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ViewTransition } from "react";
import { VideoFacade } from "@/components/VideoFacade";
import { getProject, projects, sortedProjects } from "@/content/projects";
import { serviceName } from "@/content/services";
import { site } from "@/content/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/proyectos/[slug]">): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return {
    title: p.seo?.title ?? p.title,
    description: p.seo?.description ?? p.summary,
    openGraph: { images: [{ url: p.cover.src, width: p.cover.width, height: p.cover.height, alt: p.cover.alt }] },
  };
}

/**
 * Proyecto (referencia mir.no): nombre, datos en una línea, un párrafo y las
 * imágenes a ancho completo, una tras otra. Sin fichas ni botones de venta.
 */
export default async function ProjectPage({ params }: PageProps<"/proyectos/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const i = sortedProjects.findIndex((p) => p.slug === project.slug);
  const next = sortedProjects[(i + 1) % sortedProjects.length];
  // la portada va primero; el resto sin repetirla
  const rest = project.images.filter((im) => im.src !== project.cover.src);
  const meta = [project.client, project.location, String(project.year), project.services.map(serviceName).join(", ")].filter(Boolean);

  // JSON-LD CreativeWork por proyecto
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    dateCreated: String(project.year),
    image: project.images.map((im) => `${site.url}${im.src}`),
    creator: { "@type": "Organization", name: site.legalName },
  };

  return (
    <article className="shell pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="grid gap-4 pb-8 md:grid-cols-2 md:gap-6">
        <div>
          <h1 className="display text-3xl md:text-4xl">{project.title}</h1>
          <p className="mt-2 text-muted">{meta.join(" · ")}</p>
        </div>
        <p className="max-w-xl text-ink-soft md:pt-1">{project.summary}</p>
      </header>

      <div className="space-y-6">
        <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
          <div className="relative aspect-[3/2] bg-paper-2">
            <Image src={project.cover.src} alt={project.cover.alt} fill priority quality={80} sizes="(min-width: 1680px) 1600px, 100vw" className="object-cover" />
          </div>
        </ViewTransition>

        {rest.map((im) => (
          <div key={im.src} className="relative bg-paper-2" style={{ aspectRatio: `${im.width}/${im.height}` }}>
            <Image src={im.src} alt={im.alt} fill quality={80} sizes="(min-width: 1680px) 1600px, 100vw" className="object-cover" />
          </div>
        ))}

        {project.videos?.map((v) => (
          <VideoFacade key={"id" in v ? v.id : v.src} video={v} fallbackPoster={project.images[1] ?? project.cover} sizes="100vw" />
        ))}
      </div>

      {project.specs && (
        <dl className="mt-8 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-[10rem_1fr]">
          {Object.entries(project.specs).map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )}

      <nav aria-label="Más proyectos" className="mt-16 flex justify-between gap-6 border-t border-line pt-6">
        <Link href="/" className="text-muted hover:text-ink">← Todos los proyectos</Link>
        <Link href={`/proyectos/${next.slug}`} className="text-right hover:underline hover:underline-offset-4">
          <span className="text-muted">Siguiente: </span>
          {next.title} →
        </Link>
      </nav>
    </article>
  );
}
