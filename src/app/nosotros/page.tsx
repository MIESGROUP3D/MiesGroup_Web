import Image from "next/image";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { img } from "@/content/media";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Nosotros", description: "MIES Group: estudio 3D fundado en 2015 en Córdoba (AR), con sede en Manizales (CO) y presencia en Los Ángeles (US)." };

const timeline = [
  { year: "2015", text: "Nace en Córdoba, Argentina, como estudio de renders arquitectónicos." },
  { year: "2018", text: "Primeros proyectos en realidad virtual y recorridos interactivos." },
  { year: "2021", text: "Sede en Manizales, Colombia. Tours 360° y metaverso." },
  { year: "2024", text: "Presencia en Los Ángeles, EE. UU. Web3D e inteligencia artificial." },
  { year: "2026", text: "Videojuegos y experiencias interactivas en la web." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Nosotros" }]} title={<>Hacemos que<br />exista</>} intro={site.about.story[0]} image={img("/media/projects/pabellon-lago/03.jpg", "")} />

      <section className="shell grid gap-10 md:grid-cols-2">
        {[
          ["Misión", site.about.mission],
          ["Visión", site.about.vision],
        ].map(([t, d], i) => (
          <Reveal key={t} delay={i * 0.1} className="crosshair border border-line bg-ink-2 p-8 md:p-12">
            <p className="eyebrow text-bronze">0{i + 1}</p>
            <h2 className="display mt-4 text-5xl">{t}</h2>
            <p className="mt-6 text-lg leading-relaxed text-bone-dim">{d}</p>
          </Reveal>
        ))}
      </section>

      <section className="shell mt-32 grid gap-14 md:grid-cols-12" aria-labelledby="h-hist">
        <div className="md:col-span-5">
          <p className="eyebrow border-t border-line pt-6">Trayectoria</p>
          <h2 id="h-hist" className="display mt-6 text-6xl md:text-8xl">Diez años<br />en 3D</h2>
          <p className="mt-6 text-bone-dim">{site.about.story[1]}</p>
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted">⚠ Hitos de ejemplo: confirmar fechas con el cliente</p>
        </div>
        <ol className="relative border-l border-line md:col-span-6 md:col-start-7">
          {timeline.map((t, i) => (
            <Reveal as="li" key={t.year} delay={i * 0.06} className="relative pb-12 pl-10 last:pb-0">
              <span className="absolute -left-[5px] top-3 size-2.5 rotate-45 bg-bronze" />
              <p className="display text-5xl text-bronze">{t.year}</p>
              <p className="mt-2 text-bone-dim">{t.text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="shell mt-32" aria-labelledby="h-sedes">
        <p className="eyebrow border-t border-line pt-6">Sedes</p>
        <h2 id="h-sedes" className="sr-only">Sedes</h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {site.locations.map((l, i) => (
            <Reveal as="li" key={l.code} delay={i * 0.08} className="border-t border-bone/60 pt-6">
              <p className="font-mono text-xs text-muted">{l.code}{"hq" in l && l.hq ? " · Sede principal" : ""}</p>
              <p className="display mt-3 text-6xl">{l.city}</p>
              <p className="text-bone-dim">{l.country}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section id="trabaja" className="shell mt-32 scroll-mt-28">
        <div className="relative overflow-hidden border border-line">
          <Image src="/media/projects/edificio-cumbre/02.jpg" alt="" fill sizes="100vw" quality={60} className="object-cover opacity-25" />
          <div className="relative grid gap-8 p-8 md:grid-cols-12 md:p-16">
            <div className="md:col-span-7">
              <p className="eyebrow text-bronze">Trabaja con nosotros</p>
              <h2 className="display mt-4 text-6xl md:text-8xl">Únete al equipo</h2>
              <p className="mt-6 max-w-lg text-bone-dim">Buscamos artistas 3D, desarrolladores en tiempo real y perfiles de arquitectura con pasión por la imagen. Envíanos tu portafolio.</p>
            </div>
            <div className="flex items-end md:col-span-5 md:justify-end">
              <a href={`mailto:${site.email}?subject=${encodeURIComponent("Portafolio — Trabaja con nosotros")}`} className="inline-flex items-center gap-3 bg-bone px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink hover:bg-bronze">
                Enviar portafolio <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
