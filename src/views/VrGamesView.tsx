import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GameEmbed } from "@/components/GameEmbed";
import { PageHeader } from "@/components/PageHeader";
import { games, getGameIn } from "@/content/games";
import { getGameVideos as getGameVideoReels } from "@/content/game-videos";
import { getVrVideos } from "@/content/vr-videos";
import { CgiGallery, H, P } from "@/components/CgiGallery";
import { VideoBanner } from "@/components/VideoBanner";
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
  const parts = [
    { id: "vr", label: ui.vrGames.vr },
    { id: "juegos", label: ui.vrGames.games },
  ];

  return (
    <div lang={lang}>
      <PageHeader
        title={ui.nav.vrGames}
        intro={service?.tagline}
        meta={
          <nav aria-label={ui.common.inPage} className="flex gap-2">
            {parts.map((p) => (
              <a key={p.id} href={`#${p.id}`} className="rounded-full border border-line-strong px-4 py-1.5 text-sm transition-colors hover:border-ink">
                {p.label}
              </a>
            ))}
          </nav>
        }
      />

      {/* 1. Realidad virtual */}
      <section id="vr" aria-labelledby="h-vr" className="shell scroll-mt-20">
        <div className="grid gap-4 border-t border-line pt-6 md:grid-cols-2">
          <h2 id="h-vr" className="display text-2xl md:text-3xl">{ui.vrGames.vr}</h2>
          <p className="max-w-xl text-ink-soft">{service?.body[0]}</p>
        </div>
        <div className="mt-8">
          <VideoBanner
            src1080="/media/vr/banner-vr-1080.mp4"
            src720="/media/vr/banner-vr-720.mp4"
            poster="/media/vr/banner-vr.jpg"
            title={ui.vrGames.vr}
            text={service?.tagline ?? ""}
          />
          <CgiGallery
            videos={getVrVideos(lang)}
            bento={false}
            rows={[
              [H, H],
              [P, H, P],
            ]}
          />
        </div>
      </section>

      {/* 2. Juegos */}
      <section id="juegos" aria-labelledby="h-juegos" className="shell mt-24 scroll-mt-20">
        <div className="grid gap-4 border-t border-line pt-6 md:grid-cols-2">
          <h2 id="h-juegos" className="display text-2xl md:text-3xl">{ui.vrGames.games}</h2>
          <p className="max-w-xl text-ink-soft">{service?.body[1]}</p>
        </div>
        <div className="mt-8">
          <CgiGallery videos={getGameVideoReels(lang)} />
        </div>
        {/* juego jugable en el navegador: espacio reservado hasta tener el juego real */}
        <div className="mt-12 grid place-items-center border border-dashed border-line-strong bg-paper-2 px-6 py-20 text-center md:py-28">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">{ui.vrGames.playableTitle}</p>
          <p className="display mt-3 text-3xl md:text-5xl">{ui.vrGames.soon}</p>
          <p className="mt-3 max-w-md text-ink-soft">{ui.vrGames.soonText}</p>
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
