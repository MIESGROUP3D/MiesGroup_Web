import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { sortedProjects } from "@/content/projects";
import { getService, services } from "@/content/services";
import { whatsappHref } from "@/content/site";

/** Una sola plantilla genera las 6 páginas de servicio en build (SSG). */
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/servicios/[slug]">): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return {
    title: s.seo?.title ?? s.name,
    description: s.seo?.description ?? s.tagline,
    openGraph: { images: [{ url: s.cover.src, alt: s.cover.alt }] },
  };
}

export default async function ServicePage({ params }: PageProps<"/servicios/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = sortedProjects.filter((p) => p.services.includes(service.slug));
  const idx = services.findIndex((s) => s.slug === service.slug);
  const next = services[(idx + 1) % services.length];

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Servicios" }, { label: service.name }]}
        title={service.name}
        intro={service.tagline}
        image={service.cover}
        meta={<p className="font-mono text-xs uppercase tracking-widest text-muted">Servicio {String(idx + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}</p>}
      />

      <section className="shell grid gap-14 md:grid-cols-12">
        <div className="space-y-6 text-lg leading-relaxed text-bone-dim md:col-span-6">
          {service.body.map((p) => (
            <Reveal key={p}><p>{p}</p></Reveal>
          ))}
          <a href={whatsappHref(`Hola MIES Group, me interesa el servicio de ${service.name}.`)} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-3 bg-bronze px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink hover:bg-bone">
            Cotizar {service.name} <ArrowUpRight className="size-4" />
          </a>
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <p className="eyebrow mb-6">Qué incluye</p>
          <ul className="divide-y divide-line border-y border-line">
            {service.deliverables.map((d, i) => (
              <Reveal as="li" key={d} delay={i * 0.06} className="flex items-center gap-4 py-5">
                <Check className="size-5 shrink-0 text-bronze" /> <span>{d}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="shell mt-32" aria-labelledby="h-rel">
          <p className="eyebrow border-t border-line pt-6">Proyectos con este servicio</p>
          <h2 id="h-rel" className="display mt-6 text-6xl md:text-8xl">Casos</h2>
          <ul className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2">
            {related.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={(i % 2) * 0.1}>
                <ProjectCard project={p} index={sortedProjects.indexOf(p)} />
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      <Link href={`/servicios/${next.slug}`} className="shell group mt-32 flex items-end justify-between gap-6 border-t border-line pt-8">
        <span>
          <span className="eyebrow block">Siguiente servicio</span>
          <span className="display mt-4 block text-6xl transition-colors group-hover:text-bronze md:text-9xl">{next.name}</span>
        </span>
        <ArrowUpRight className="mb-4 size-12 shrink-0 transition-transform group-hover:-translate-y-2 group-hover:translate-x-2 md:size-20" strokeWidth={1} />
      </Link>
    </>
  );
}
