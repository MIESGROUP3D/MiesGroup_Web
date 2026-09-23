import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ProjectGrid } from "@/components/ProjectGrid";
import { sortedProjects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Portafolio de visualización arquitectónica: renders, animaciones, tours 360° y experiencias VR.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Proyectos" }]}
        title="Proyectos"
        intro="Todo el trabajo del estudio en un solo lugar. Filtra por servicio o por tipología."
      />
      <section className="shell">
        <ProjectGrid projects={sortedProjects} />
      </section>
    </>
  );
}
