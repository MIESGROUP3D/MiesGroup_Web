import { ProjectsView, projectsMeta } from "@/views/ProjectsView";

export const metadata = projectsMeta("es");

export default function Page() {
  return <ProjectsView lang="es" />;
}
