import { VrGamesView, vrGamesMeta } from "@/views/VrGamesView";

export const metadata = vrGamesMeta("en");

export default function Page() {
  return <VrGamesView lang="en" />;
}
