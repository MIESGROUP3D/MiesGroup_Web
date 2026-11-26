import { StudioView, studioMeta } from "@/views/StudioView";

export const metadata = studioMeta("en");

export default function Page() {
  return <StudioView lang="en" />;
}
