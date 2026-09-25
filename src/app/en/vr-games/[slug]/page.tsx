import { GameView, gameMeta, gameParams } from "@/views/VrGamesView";

export const generateStaticParams = gameParams;
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/en/vr-games/[slug]">) {
  return gameMeta((await params).slug, "en");
}

export default async function Page({ params }: PageProps<"/en/vr-games/[slug]">) {
  return <GameView slug={(await params).slug} lang="en" />;
}
