import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/ProjectDetail";
import { ProjectModal } from "@/components/ProjectModal";
import { getProject, projects } from "@/content/projects";

/**
 * Ruta interceptada: al hacer clic en un proyecto desde el sitio, se abre en
 * modal sobre la página actual. Entrando directo por URL (o recargando) se
 * muestra app/proyectos/[slug]/page.tsx a pantalla completa.
 */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export default async function ProjectModalPage({ params }: PageProps<"/proyectos/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return (
    <ProjectModal slug={project.slug}>
      <ProjectDetail project={project} inModal />
    </ProjectModal>
  );
}
