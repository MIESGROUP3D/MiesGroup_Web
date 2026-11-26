import { ProjectsView, projectsMeta } from "@/views/ProjectsView";
import { darkViewport } from "@/views/meta";

export const metadata = projectsMeta("en");
export const viewport = darkViewport;

export default function Page() {
  return <ProjectsView lang="en" />;
}
