import { ProjectsView, projectsMeta } from "@/views/ProjectsView";

export const metadata = projectsMeta("en");

export default function Page() {
  return <ProjectsView lang="en" />;
}
