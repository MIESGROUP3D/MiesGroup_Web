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
    <div className="shell pt-6">
      <nav aria-label="Migas de pan" className="eyebrow">
        <Link href="/" className="hover:text-ink">Inicio</Link> / <Link href="/videojuegos" className="hover:text-ink">Videojuegos</Link> / <span className="text-ink">{game.title}</span>
      </nav>
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h1 className="display text-3xl md:text-4xl">{game.title}</h1>
        <p className="max-w-md text-ink-soft md:pb-3">{game.summary}</p>
      </div>
      <div className="mt-10">
        <GameEmbed game={game} />
      </div>
    </div>
  );
}
