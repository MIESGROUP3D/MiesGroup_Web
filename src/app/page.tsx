import Link from "next/link";
import { HomeHero } from "@/components/HomeHero";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ScrollRows } from "@/components/ScrollRows";
import { featuredProjects, sortedProjects } from "@/content/projects";
import { site } from "@/content/site";

/**
 * Home: hero con los proyectos destacados, una sola frase de marca y el
 * portafolio completo. Un clic abre cualquier proyecto.
 */
export default function HomePage() {
  const [first, second] = site.tagline.split(",").map((s) => s.trim());
  // todas las imágenes del portafolio, repartidas en las dos filas de la franja
  const all = sortedProjects.flatMap((p) => p.images);
  const half = Math.ceil(all.length / 2);
  return (
    <>
      {/* Hero a pantalla completa, de borde a borde (el logo va encima, en blanco) */}
      <HomeHero projects={featuredProjects} />

      <section className="shell grid gap-6 py-14 md:grid-cols-2 md:py-20">
        <h1 className="display text-3xl md:text-5xl">
          <span className="sr-only">{site.name} — estudio 3D de visualización arquitectónica. </span>
          {first},
          <br />
          {second}.
        </h1>
        <div className="space-y-4 md:max-w-md md:pt-2">
          <p className="text-ink-soft">
            Estudio 3D de visualización arquitectónica desde {site.foundedYear}: renders, animación, 360°, VR, Web3D e IA.
          </p>
          <p className="flex gap-6">
            <Link href="/servicios" className="underline underline-offset-4 hover:no-underline">Servicios →</Link>
            <Link href="/estudio" className="underline underline-offset-4 hover:no-underline">Estudio →</Link>
          </p>
        </div>
      </section>

      <ScrollRows rows={[all.slice(0, half), all.slice(half)]} />

      <section className="shell mt-20 md:mt-28" aria-labelledby="h-proyectos">
        <h2 id="h-proyectos" className="border-t border-line pb-4 pt-6 text-muted">Proyectos</h2>
        <ProjectGrid projects={sortedProjects} />
      </section>
    </>
  );
}
