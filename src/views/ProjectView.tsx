import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProjectDetail } from "@/components/ProjectDetail";
import { getProjectIn, projects } from "@/content/projects";
import { site } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { pageMeta } from "./meta";

export const projectParams = () => projects.map((p) => ({ slug: p.slug }));

export function projectMeta(slug: string, lang: Locale): Metadata {
  const p = getProjectIn(slug, lang);
  if (!p) return {};
  return pageMeta(lang, "projects", {
    rest: `/${p.slug}`,
    title: p.seo?.title ?? p.title,
    description: p.seo?.description ?? p.summary,
    images: [{ url: p.cover.src, width: p.cover.width, height: p.cover.height, alt: p.cover.alt }],
  });
}

/**
 * Proyecto a pantalla completa: entrada directa por URL, recarga o buscadores.
 * Desde el sitio se abre en el modal (ProjectModal).
 */
export function ProjectView({ slug, lang }: { slug: string; lang: Locale }) {
  const project = getProjectIn(slug, lang);
  if (!project) notFound();

  // JSON-LD CreativeWork por proyecto
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    inLanguage: lang,
    dateCreated: String(project.year),
    image: project.images.map((im) => `${site.url}${im.src}`),
    creator: { "@type": "Organization", name: site.legalName },
  };

  return (
    <article lang={lang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProjectDetail project={project} lang={lang} />
    </article>
  );
}
