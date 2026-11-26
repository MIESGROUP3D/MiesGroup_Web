import { VrGamesView, vrGamesMeta } from "@/views/VrGamesView";

export const metadata = vrGamesMeta("es");

export default function Page() {
  return <VrGamesView lang="es" />;
}
