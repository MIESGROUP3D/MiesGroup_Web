import Link from "next/link";
import type { Metadata } from "next";
import { VideoFacade } from "@/components/VideoFacade";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Estudio",
  description: "MIES Group: estudio 3D fundado en 2015 en Córdoba (AR), con sede en Manizales (CO) y presencia en Los Ángeles (US).",
};

const more = [
  { label: "Videojuegos", href: "/videojuegos", text: "Experiencias jugables en el navegador" },
  { label: "Channel", href: "/channel", text: "Reels, animaciones y making-of" },
  { label: "Conferencias", href: "/conferencias", text: "Charlas del estudio" },
];

export default function StudioPage() {
  return (
    <div className="shell pt-6">
      <h1 className="display text-3xl md:text-4xl">Estudio</h1>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="space-y-4 text-lg leading-relaxed md:max-w-xl md:text-xl">
          {site.about.story.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <dl className="grid content-start gap-x-6 gap-y-1 sm:grid-cols-[8rem_1fr]">
          <dt className="text-muted">Fundado</dt>
          <dd>{site.foundedYear}, Córdoba (AR)</dd>
          <dt className="text-muted">Sedes</dt>
          <dd>{site.locations.map((l) => `${l.city} (${l.code})`).join(", ")}</dd>
          <dt className="text-muted">Contacto</dt>
          <dd>
            <a href={`mailto:${site.email}`} className="underline underline-offset-4 hover:no-underline">{site.email}</a>
          </dd>
        </dl>
      </section>

      <section className="mt-16" aria-label="Reel">
        <VideoFacade video={site.hero.reel} fallbackPoster={site.hero.poster} sizes="100vw" />
      </section>

      <section className="mt-16 grid gap-6 border-t border-line pt-6 md:grid-cols-2" aria-labelledby="h-mas">
        <h2 id="h-mas" className="text-muted">También</h2>
        <ul>
          {more.map((m) => (
            <li key={m.href}>
              <Link href={m.href} className="group flex justify-between gap-6 border-b border-line py-3">
                <span className="font-medium group-hover:underline group-hover:underline-offset-4">{m.label}</span>
                <span className="text-right text-muted">{m.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="trabaja" className="mt-16 grid scroll-mt-20 gap-6 border-t border-line pt-6 md:grid-cols-2">
        <h2 className="text-muted">Trabaja con nosotros</h2>
        <p className="md:max-w-xl">
          Buscamos artistas 3D, desarrolladores en tiempo real y perfiles de arquitectura.{" "}
          <a href={`mailto:${site.email}?subject=${encodeURIComponent("Portafolio — Trabaja con nosotros")}`} className="underline underline-offset-4 hover:no-underline">
            Envíanos tu portafolio
          </a>
          .
        </p>
      </section>
    </div>
  );
}
