import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProjectDetail } from "@/components/ProjectDetail";
import { getProject, projects } from "@/content/projects";
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
 * Proyecto a pantalla completa: entrada directa por URL, recarga o buscadores.
 * Desde la grilla se abre en modal (app/@modal/(.)proyectos/[slug]).
 */
export default async function ProjectPage({ params }: PageProps<"/proyectos/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

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
    <article className="shell max-w-6xl pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProjectDetail project={project} />
    </article>
  );
}
