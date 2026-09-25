import { ProjectGrid } from "@/components/ProjectGrid";
import { getSortedProjects } from "@/content/projects";
import { t } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { pageMeta } from "./meta";

export const projectsMeta = (lang: Locale) => pageMeta(lang, "projects", { title: t(lang).projects.title, description: t(lang).projects.description });

/**
 * Proyectos: la sección negra con la barra de categorías.
 * Desde el inicio se llega ya filtrada (?servicio=3d-rendering…).
 */
export function ProjectsView({ lang }: { lang: Locale }) {
  const ui = t(lang).projects;
  const projects = getSortedProjects(lang);
  return (
    <div lang={lang}>
      <section className="bg-ink pb-20 text-paper md:pb-28" aria-labelledby="h-proyectos">
        <div className="shell">
          <div className="flex flex-col gap-3 pb-8 pt-6 md:flex-row md:items-end md:justify-between">
            <h1 id="h-proyectos" className="display text-4xl md:text-6xl">
              {ui.title}
            </h1>
            <p className="max-w-sm text-paper/75 md:text-right">{ui.intro(projects.length)}</p>
          </div>
        </div>
        {/* las fotos van de borde a borde (margen mínimo): en laptops ocupan la mayor parte de la pantalla */}
        <div className="px-[clamp(0.5rem,1.5vw,1.5rem)]">
          <ProjectGrid projects={projects} />
        </div>
      </section>
      <div aria-hidden className="fade-to-paper h-64 md:h-96" />
    </div>
  );
}
