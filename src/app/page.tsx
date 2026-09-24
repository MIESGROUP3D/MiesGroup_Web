import { ProjectGrid } from "@/components/ProjectGrid";
import { sortedProjects } from "@/content/projects";
import { site } from "@/content/site";

/**
 * Home = portafolio (referencia mir.no). Sin hero ni textos de venta:
 * se entra y se ven los proyectos. Un clic abre el proyecto.
 */
export default function HomePage() {
  return (
    <section className="shell pt-6">
      <h1 className="sr-only">{site.name} — estudio 3D de visualización arquitectónica. Proyectos</h1>
      <ProjectGrid projects={sortedProjects} />
    </section>
  );
}
