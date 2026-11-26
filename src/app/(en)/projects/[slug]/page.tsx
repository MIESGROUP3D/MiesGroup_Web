import { ProjectView, projectMeta, projectParams } from "@/views/ProjectView";

export const generateStaticParams = projectParams;
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">) {
  return projectMeta((await params).slug, "en");
}

export default async function Page({ params }: PageProps<"/projects/[slug]">) {
  return <ProjectView slug={(await params).slug} lang="en" />;
}
