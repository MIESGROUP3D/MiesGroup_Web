import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { GameEmbed } from "@/components/GameEmbed";
import { PageHeader } from "@/components/PageHeader";
import { ProjectLink } from "@/components/ProjectLink";
import { Reveal } from "@/components/Reveal";
import { VideoFacade } from "@/components/VideoFacade";
import { games, getGameIn, getGameVideos, getGames } from "@/content/games";
import { img } from "@/content/media";
import { getSortedProjects } from "@/content/projects";
import { getServiceIn } from "@/content/services";
import { t } from "@/content/ui";
import { route, type Locale } from "@/lib/i18n";
import { pageMeta } from "./meta";

// pósteres placeholder para los videos de Vimeo (Vimeo no expone miniatura sin API)
const posters = [
  img("/media/projects/torre-aurora/02.jpg", ""),
  img("/media/projects/edificio-cumbre/03.jpg", ""),
  img("/media/projects/terrazas-del-valle/04.jpg", ""),
  img("/media/projects/casa-mirador/01.jpg", ""),
];

export const vrGamesMeta = (lang: Locale) => pageMeta(lang, "vrGames", { title: t(lang).nav.vrGames, description: t(lang).vrGames.description });

/**
 * VR/Games = "Metaverse / VR" + "Video Juegos" del sitio actual:
 * 1) realidad virtual (proyectos con este servicio), 2) juegos jugables y gameplay.
 */
export function VrGamesView({ lang }: { lang: Locale }) {
  const ui = t(lang);
  const service = getServiceIn("vr-games", lang);
  const vrProjects = getSortedProjects(lang).filter((p) => p.services.includes("vr-games"));
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
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {vrProjects.map((p) => (
            <li key={p.slug}>
              <ProjectLink slug={p.slug} morph={false} className="group block">
                <div className="relative aspect-[3/2] overflow-hidden bg-paper-2">
                  <Image src={p.cover.src} alt={p.cover.alt} fill quality={75} sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
                <p className="mt-3 flex items-baseline justify-between gap-4">
                  <span className="font-medium group-hover:underline group-hover:underline-offset-4">{p.title}</span>
                  <span className="text-sm text-muted">{p.location} · {p.year}</span>
                </p>
              </ProjectLink>
            </li>
          ))}
        </ul>
      </section>

      {/* 2. Juegos */}
      <section id="juegos" aria-labelledby="h-juegos" className="shell mt-24 scroll-mt-20">
        <div className="grid gap-4 border-t border-line pt-6 md:grid-cols-2">
          <h2 id="h-juegos" className="display text-2xl md:text-3xl">{ui.vrGames.games}</h2>
          <p className="max-w-xl text-ink-soft">{service?.body[1]}</p>
        </div>
        <ul className="mt-8 grid gap-8">
          {getGames(lang).map((g) => (
            <li key={g.slug}>
              <Link href={route(lang, "vrGames", `/${g.slug}`)} className="group grid overflow-hidden border border-line bg-paper-2 md:grid-cols-12">
                <div className="relative aspect-video md:col-span-8">
                  <Image src={g.cover.src} alt={g.cover.alt} fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover transition duration-[1.2s] group-hover:scale-[1.03]" />
                </div>
                <div className="flex flex-col justify-between gap-8 p-6 md:col-span-4 md:p-10">
                  <div>
                    <p className="eyebrow text-ink">{g.status === "jugable" ? ui.vrGames.playable : ui.vrGames.soon} · {g.engine.toUpperCase()}</p>
                    <h3 className="display mt-2 text-2xl">{g.title}</h3>
                    <p className="mt-4 text-ink-soft">{g.summary}</p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-3 bg-ink px-6 py-4 text-sm text-paper">
                    {ui.vrGames.play} <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <h3 className="mt-16 text-lg font-medium">{ui.vrGames.gameplay}</h3>
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {getGameVideos(lang).map((v, i) => (
            <Reveal as="li" key={i} delay={(i % 2) * 0.1}>
              <VideoFacade video={v} fallbackPoster={posters[i % posters.length]} />
            </Reveal>
          ))}
        </ul>
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
