import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Gamepad2 } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ServicesList } from "@/components/ServicesList";
import { featuredProjects } from "@/content/projects";
import { games } from "@/content/games";
import { services } from "@/content/services";
import { site } from "@/content/site";

export default function HomePage() {
  const game = games[0];
  return (
    <>
      <Hero />

      <Marquee items={services.map((s) => s.name)} />

      {/* 01 — Servicios */}
      <section className="shell mt-28 md:mt-40" aria-labelledby="h-servicios">
        <SectionHeading
          index="01"
          label="Servicios"
          title={<span id="h-servicios">Visualizamos lo<br />que aún no existe</span>}
          intro="Seis líneas de servicio para acompañar un proyecto desde el primer render hasta la sala de ventas inmersiva."
        />
        <div className="mt-16">
          <ServicesList services={services} />
        </div>
      </section>

      {/* 02 — Proyectos destacados */}
      <section className="shell mt-32 md:mt-48" aria-labelledby="h-proyectos">
        <SectionHeading
          index="02"
          label="Proyectos"
          title={<span id="h-proyectos">Trabajo<br />seleccionado</span>}
          intro="Una muestra del portafolio. Cada proyecto incluye galería completa, videos y ficha técnica."
          action={
            <Link href="/proyectos" className="group inline-flex shrink-0 items-center gap-2 border-b border-bronze pb-1 text-sm font-medium uppercase tracking-[0.14em] text-bronze">
              Ver todos los proyectos <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          }
        />
        <ul className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-12">
          {featuredProjects.slice(0, 4).map((p, i) => {
            const wide = i === 0 || i === 3;
            return (
              <Reveal as="li" key={p.slug} delay={(i % 2) * 0.1} className={wide ? "md:col-span-7" : "md:col-span-5 md:mt-28"}>
                <ProjectCard project={p} index={i} size={wide ? "lg" : "md"} />
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* 03 — Videojuegos */}
      <section className="mt-32 md:mt-48" aria-labelledby="h-juegos">
        <div className="shell">
          <SectionHeading index="03" label="Videojuegos" title={<span id="h-juegos">Juega<br />en la web</span>} />
        </div>
        <div className="shell mt-16">
          <Link href={`/videojuegos/${game.slug}`} className="group relative block overflow-hidden">
            <div className="relative aspect-[16/9] md:aspect-[21/9]">
              <Image src={game.cover.src} alt={game.cover.alt} fill sizes="100vw" quality={75} className="object-cover transition duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:justify-center md:p-14">
              <p className="eyebrow flex items-center gap-2 text-bronze"><Gamepad2 className="size-4" /> {game.status === "jugable" ? "Jugable en el navegador" : "Próximamente"}</p>
              <p className="display mt-4 max-w-2xl text-5xl md:text-8xl">{game.title}</p>
              <p className="mt-4 hidden max-w-md text-bone-dim md:block">{game.summary}</p>
              <span className="mt-8 inline-flex w-fit items-center gap-3 bg-bronze px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors group-hover:bg-bone">
                Jugar ahora <ArrowUpRight className="size-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 04 — Estudio */}
      <section className="shell mt-32 md:mt-48" aria-labelledby="h-estudio">
        <SectionHeading
          index="04"
          label="Estudio"
          title={<span id="h-estudio">Desde {site.foundedYear},<br />en tres países</span>}
          intro={site.about.story[0]}
          action={
            <Link href="/nosotros" className="group inline-flex shrink-0 items-center gap-2 border-b border-bronze pb-1 text-sm font-medium uppercase tracking-[0.14em] text-bronze">
              Conoce el estudio <ArrowUpRight className="size-4" />
            </Link>
          }
        />
        <dl className="mt-16 grid grid-cols-2 border-t border-line md:grid-cols-4">
          {site.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="border-b border-line py-10 pr-6 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="display block text-7xl text-bronze md:text-8xl">{s.value}</span>
                <span className="mt-3 block text-sm text-bone-dim">{s.label}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>
    </>
  );
}
