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
        {/* título centrado encima de la barra de categorías; en escritorio sube a la fila del logo */}
        <div className="shell">
          <h1 id="h-proyectos" className="display relative pb-3 text-center text-xl md:-mt-[2.85rem] md:pb-4 md:text-2xl">
            {ui.title}
          </h1>
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
