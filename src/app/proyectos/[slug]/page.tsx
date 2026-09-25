import { ProjectView, projectMeta, projectParams } from "@/views/ProjectView";

export const generateStaticParams = projectParams;
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/proyectos/[slug]">) {
  return projectMeta((await params).slug, "es");
}

export default async function Page({ params }: PageProps<"/proyectos/[slug]">) {
  return <ProjectView slug={(await params).slug} lang="es" />;
}
