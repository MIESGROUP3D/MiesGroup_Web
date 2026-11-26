import { TalksView, talksMeta } from "@/views/TalksView";

export const metadata = talksMeta("es");

export default function Page() {
  return <TalksView lang="es" />;
}
