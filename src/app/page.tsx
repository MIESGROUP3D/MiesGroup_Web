import { HomeView, homeMeta } from "@/views/HomeView";

export const metadata = homeMeta("es");

export default function Page() {
  return <HomeView lang="es" />;
}
