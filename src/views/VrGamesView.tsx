import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Gamepad2 } from "lucide-react";
import { GameEmbed } from "@/components/GameEmbed";
import { SectionPills } from "@/components/SectionPills";
import { PageHeader } from "@/components/PageHeader";
import { games, getGameIn } from "@/content/games";
import { getGameVideos as getGameVideoReels } from "@/content/game-videos";
import { getVrVideos } from "@/content/vr-videos";
import { ReelShowcase } from "@/components/ReelShowcase";
import { getServiceIn } from "@/content/services";
import { t } from "@/content/ui";
import { route, type Locale } from "@/lib/i18n";
import { pageMeta } from "./meta";

export const vrGamesMeta = (lang: Locale) => pageMeta(lang, "vrGames", { title: t(lang).nav.vrGames, description: t(lang).vrGames.description });

/**
 * VR/Games = "Metaverse / VR" + "Video Juegos" de la página anterior:
 * 1) realidad virtual: banner + experiencias VR (Vimeo), 2) juegos: videos + juego jugable.
 */
export function VrGamesView({ lang }: { lang: Locale }) {
  const ui = t(lang);
  const service = getServiceIn("vr-games", lang);
  const vrVideos = getVrVideos(lang);
  const gameVideos = getGameVideoReels(lang);
  const parts = [
    { id: "vr", label: ui.vrGames.vr, count: vrVideos.length },
    { id: "juegos", label: ui.vrGames.games, count: gameVideos.length },
  ];

  return (
    <div lang={lang}>
      <PageHeader title={ui.nav.vrGames} intro={service?.tagline} meta={<SectionPills items={parts} label={ui.common.inPage} />} />

      {/* Juego en el navegador, al principio: espacio reservado hasta tener el juego real */}
      <section aria-labelledby="h-browser-game" className="shell mb-24">
        <div className="relative isolate grid place-items-center overflow-hidden bg-ink px-6 py-20 text-center text-paper md:py-28">
          <span
            aria-hidden
            className="absolute inset-0 -z-10 opacity-60 motion-safe:animate-pulse [background:radial-gradient(60%_80%_at_50%_0%,color-mix(in_srgb,var(--color-paper)_22%,transparent),transparent)]"
          />
          <span className="grid size-16 place-items-center rounded-full border border-paper/30">
            <Gamepad2 className="size-7" aria-hidden />
          </span>
          <h2 id="h-browser-game" className="mt-6 text-xs font-normal uppercase tracking-[0.16em] text-paper/60">{ui.vrGames.playableTitle}</h2>
          <p className="display mt-3 text-3xl md:text-5xl">{ui.vrGames.soon}</p>
          <p className="mt-3 max-w-md text-paper/70">{ui.vrGames.soonText}</p>
        </div>
      </section>

      {/* 1. Realidad virtual */}
      <section id="vr" aria-labelledby="h-vr" className="shell scroll-mt-20">
        <div className="grid gap-4 border-t border-line pt-6 md:grid-cols-2">
          <div className="flex items-baseline gap-4">
            <span aria-hidden className="eyebrow tabular-nums">01</span>
            <h2 id="h-vr" className="display text-2xl md:text-3xl">{ui.vrGames.vr}</h2>
          </div>
          <p className="max-w-xl text-ink-soft">{service?.body[0]}</p>
        </div>
        <div className="mt-8">
          <ReelShowcase videos={vrVideos} />
        </div>
      </section>

      {/* 2. Juegos */}
      <section id="juegos" aria-labelledby="h-juegos" className="shell mt-24 scroll-mt-20">
        <div className="grid gap-4 border-t border-line pt-6 md:grid-cols-2">
          <div className="flex items-baseline gap-4">
            <span aria-hidden className="eyebrow tabular-nums">02</span>
            <h2 id="h-juegos" className="display text-2xl md:text-3xl">{ui.vrGames.games}</h2>
          </div>
          <p className="max-w-xl text-ink-soft">{service?.body[1]}</p>
        </div>
        <div className="mt-8">
          <ReelShowcase videos={gameVideos} />
        </div>
      </section>
    </div>
  );
}

export const gameParams = () => games.map((g) => ({ slug: g.slug }));

export function gameMeta(slug: string, lang: Locale): Metadata {
  const g = getGameIn(slug, lang);
  if (!g) return {};
  return pageMeta(lang, "vrGames", { rest: `/${g.slug}`, title: g.title, description: g.summary, images: [{ url: g.cover.src, alt: g.cover.alt }] });
}

/** Página del juego: el juego embebido (se carga al pulsar "Jugar"). */
export function GameView({ slug, lang }: { slug: string; lang: Locale }) {
  const ui = t(lang);
  const game = getGameIn(slug, lang);
  if (!game) notFound();

  return (
    <div lang={lang} className="shell pt-6">
      <nav aria-label={ui.common.breadcrumb} className="eyebrow">
        <Link href={route(lang, "home")} className="hover:text-ink">{ui.nav.home}</Link> /{" "}
        <Link href={`${route(lang, "vrGames")}/#juegos`} className="hover:text-ink">{ui.nav.vrGames}</Link> / <span className="text-ink">{game.title}</span>
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
