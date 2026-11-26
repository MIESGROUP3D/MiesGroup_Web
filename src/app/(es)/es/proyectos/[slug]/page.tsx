import { ProjectView, projectMeta, projectParams } from "@/views/ProjectView";

export const generateStaticParams = projectParams;
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/es/proyectos/[slug]">) {
  return projectMeta((await params).slug, "es");
}

export default async function Page({ params }: PageProps<"/es/proyectos/[slug]">) {
  return <ProjectView slug={(await params).slug} lang="es" />;
}
