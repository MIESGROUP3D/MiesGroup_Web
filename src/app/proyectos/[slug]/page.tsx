import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Gallery } from "@/components/Gallery";
import { Reveal } from "@/components/Reveal";
import { VideoFacade } from "@/components/VideoFacade";
import { categoryLabels, getProject, projects, sortedProjects } from "@/content/projects";
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

export default async function ProjectPage({ params }: PageProps<"/proyectos/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const i = sortedProjects.findIndex((p) => p.slug === project.slug);
  const next = sortedProjects[(i + 1) % sortedProjects.length];

  const facts: [string, string][] = [
    ["Ubicación", project.location],
    ["Año", String(project.year)],
    ["Tipología", categoryLabels[project.category]],
    ["Servicios", project.services.map(serviceName).join(" · ")],
    ...(project.client ? [["Cliente", project.client] as [string, string]] : []),
    ...Object.entries(project.specs ?? {}),
  ];

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
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Portada a pantalla completa */}
      <header className="relative h-[92svh] min-h-[560px] overflow-hidden">
        <Image src={project.cover.src} alt={project.cover.alt} fill priority quality={75} sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/50" />
        <div className="shell relative flex h-full flex-col justify-end pb-12">
          <nav aria-label="Migas de pan" className="eyebrow">
            <Link href="/" className="hover:text-bone">Inicio</Link> / <Link href="/proyectos" className="hover:text-bone">Proyectos</Link> / <span className="text-bone">{project.title}</span>
          </nav>
          <Reveal>
            <h1 className="display mt-6 text-[clamp(3.6rem,13vw,13rem)]">{project.title}</h1>
          </Reveal>
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-bone-dim">
            {project.location} · {project.year} · {categoryLabels[project.category]}
          </p>
        </div>
      </header>

      <section className="shell mt-20 grid gap-14 md:grid-cols-12">
        <Reveal className="md:col-span-6">
          <p className="text-2xl leading-snug md:text-3xl">{project.summary}</p>
        </Reveal>
        <dl className="divide-y divide-line border-y border-line md:col-span-5 md:col-start-8">
          {facts.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 py-4 text-sm">
              <dt className="eyebrow pt-0.5">{k}</dt>
              <dd className="text-bone-dim">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="shell mt-24" aria-label="Galería">
        <Gallery images={project.images} />
      </section>

      {project.videos && project.videos.length > 0 && (
        <section className="shell mt-24" aria-labelledby="h-vid">
          <h2 id="h-vid" className="eyebrow mb-6 border-t border-line pt-6">Video</h2>
          <div className="grid gap-6">
            {project.videos.map((v) => (
              <VideoFacade key={"id" in v ? v.id : v.src} video={v} fallbackPoster={project.images[1] ?? project.cover} sizes="100vw" />
            ))}
          </div>
        </section>
      )}

      <Link href={`/proyectos/${next.slug}`} className="group relative mt-32 block overflow-hidden">
        <div className="relative h-[60svh] min-h-[380px]">
          <Image src={next.cover.src} alt="" fill sizes="100vw" quality={60} className="object-cover opacity-50 transition duration-[1.4s] group-hover:scale-105 group-hover:opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink" />
        </div>
        <div className="shell absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 pb-12">
          <span>
            <span className="eyebrow block">Siguiente proyecto</span>
            <span className="display mt-4 block text-6xl transition-colors group-hover:text-bronze md:text-9xl">{next.title}</span>
          </span>
          <ArrowUpRight className="mb-4 size-12 shrink-0 transition-transform group-hover:-translate-y-2 group-hover:translate-x-2 md:size-20" strokeWidth={1} />
        </div>
      </Link>
    </article>
  );
}
