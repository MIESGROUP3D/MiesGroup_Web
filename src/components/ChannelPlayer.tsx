"use client";

import { Play } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { ChannelVideo } from "@/content/channel";
import { t } from "@/content/ui";
import { useLang } from "@/lib/useLang";
import { embedUrl } from "./VideoFacade";

const thumb = (id: string, size: "maxresdefault" | "hqdefault" | "mqdefault") => `https://i.ytimg.com/vi/${id}/${size}.jpg`;

/**
 * Channel en modo "sala de cine" (fondo negro):
 * - Arriba, el video destacado a lo ancho. Póster liviano; el reproductor de
 *   YouTube (youtube-nocookie) solo se carga al pulsar play.
 * - Debajo, la lista de videos en filas. Al elegir uno pasa al destacado y
 *   empieza a reproducirse, sin salir de la página.
 */
export function ChannelPlayer({ videos }: { videos: ChannelVideo[] }) {
  const lang = useLang();
  const ui = t(lang);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  // miniatura HD del destacado; si el video no la tiene, se usa la estándar
  const [hdFailed, setHdFailed] = useState<Record<string, boolean>>({});
  const stageRef = useRef<HTMLDivElement>(null);
  const fmt = new Intl.DateTimeFormat(lang === "en" ? "en-US" : "es-CO", { month: "short", year: "numeric", timeZone: "UTC" });
  const date = (d: string) => fmt.format(new Date(d));
  const v = videos[current];

  const choose = (i: number) => {
    setCurrent(i);
    setPlaying(true);
    stageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div>
      {/* Destacado */}
      <div ref={stageRef} className="scroll-mt-24">
        <div className="relative aspect-video overflow-hidden bg-ink-soft">
          {playing ? (
            <iframe
              key={v.id}
              src={embedUrl(v)}
              title={v.title}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`${ui.common.play}: ${v.title}`}
              className="group absolute inset-0 size-full text-left"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumb(v.id, hdFailed[v.id] ? "hqdefault" : "maxresdefault")}
                alt=""
                onLoad={(e) => e.currentTarget.naturalWidth <= 120 && setHdFailed((f) => ({ ...f, [v.id]: true }))}
                onError={() => setHdFailed((f) => ({ ...f, [v.id]: true }))}
                className="absolute inset-0 size-full object-cover opacity-75 transition duration-700 group-hover:scale-[1.02] group-hover:opacity-90"
              />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <span className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-paper/60 bg-ink/30 text-paper backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:bg-paper group-hover:text-ink md:size-24">
                <Play className="ml-1 size-7 md:size-8" fill="currentColor" />
              </span>
            </button>
          )}
        </div>
        <div className="mt-5 flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-8">
          <h2 className="text-xl font-medium md:text-3xl">{v.title}</h2>
          <p className="shrink-0 text-sm text-paper/60">
            {playing && <span className="mr-3 text-paper">● {ui.studio.nowPlaying}</span>}
            {date(v.date)}
          </p>
        </div>
      </div>

      {/* Lista de videos */}
      <h3 className="mt-16 text-sm uppercase tracking-[0.14em] text-paper/50 md:mt-20">{ui.studio.moreVideos}</h3>
      <ol className="mt-4 border-t border-paper/15">
        {videos.map((item, i) => {
          const active = i === current;
          return (
            <li key={item.id} className="border-b border-paper/15">
              <button
                type="button"
                onClick={() => choose(i)}
                aria-current={active ? "true" : undefined}
                className={cn("group grid w-full grid-cols-[7.5rem_1fr] items-center gap-4 py-4 text-left transition-colors md:grid-cols-[3rem_11rem_1fr_auto] md:gap-6", active ? "text-paper" : "text-paper/70 hover:text-paper")}
              >
                <span className="hidden text-sm tabular-nums text-paper/40 md:block">{String(i + 1).padStart(2, "0")}</span>
                <span className="relative aspect-video overflow-hidden bg-ink-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb(item.id, "mqdefault")} alt="" loading="lazy" className={cn("absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105", active ? "opacity-100" : "opacity-70 group-hover:opacity-100")} />
                  {active && <span aria-hidden className="absolute inset-0 ring-2 ring-inset ring-paper" />}
                </span>
                <span className="min-w-0">
                  <span className="block font-medium leading-snug md:text-lg">{item.title}</span>
                  <span className="mt-1 block text-sm text-paper/50 md:hidden">{date(item.date)}</span>
                </span>
                <span className="hidden text-sm text-paper/50 md:block">{active && playing ? ui.studio.nowPlaying : date(item.date)}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
