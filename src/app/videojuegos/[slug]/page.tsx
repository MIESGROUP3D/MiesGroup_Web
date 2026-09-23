import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GameEmbed } from "@/components/GameEmbed";
import { getGame, games } from "@/content/games";

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/videojuegos/[slug]">): Promise<Metadata> {
  const g = getGame((await params).slug);
  if (!g) return {};
  return { title: g.title, description: g.summary, openGraph: { images: [{ url: g.cover.src, alt: g.cover.alt }] } };
}

export default async function GamePage({ params }: PageProps<"/videojuegos/[slug]">) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();

  return (
    <div className="shell pt-32 md:pt-36">
      <nav aria-label="Migas de pan" className="eyebrow">
        <Link href="/" className="hover:text-bone">Inicio</Link> / <Link href="/videojuegos" className="hover:text-bone">Videojuegos</Link> / <span className="text-bone">{game.title}</span>
      </nav>
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h1 className="display text-[clamp(3rem,8vw,7rem)]">{game.title}</h1>
        <p className="max-w-md text-bone-dim md:pb-3">{game.summary}</p>
      </div>
      <div className="mt-10">
        <GameEmbed game={game} />
      </div>
    </div>
  );
}
