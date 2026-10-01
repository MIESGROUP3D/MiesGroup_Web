"use client";

import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { ChannelVideo } from "@/content/channel";
import { t } from "@/content/ui";
import { useLang } from "@/lib/useLang";
import { embedUrl } from "./VideoFacade";

const thumb = (id: string, hd: boolean) => `https://i.ytimg.com/vi/${id}/${hd ? "maxresdefault" : "hqdefault"}.jpg`;

/**
 * Channel como carrusel de cine (tipo Apple TV), sobre fondo negro:
 * - Un video ocupa el centro; los vecinos asoman a los lados, más chicos y apagados.
 * - Se pasa con las flechas, tocando un vecino, arrastrando (mouse o dedo) o con ← → del teclado.
 * - Póster liviano; el reproductor de YouTube (youtube-nocookie) solo carga al pulsar play
 *   y se detiene al cambiar de video.
 * El riel se centra solo con CSS (left 50% + translateX con el ancho de diapositiva),
 * sin medir el contenedor.
 */
export function ChannelCarousel({ videos }: { videos: ChannelVideo[] }) {
  const lang = useLang();
  const ui = t(lang);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [noHd, setNoHd] = useState<Record<string, boolean>>({});
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const fmt = new Intl.DateTimeFormat(lang === "en" ? "en-US" : "es-CO", { month: "long", year: "numeric", timeZone: "UTC" });
  const v = videos[index];
  const last = videos.length - 1;

  const go = (i: number) => {
    const next = Math.max(0, Math.min(last, i));
    if (next === index) return;
    setIndex(next);
    setPlaying(false);
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ui.studio.channel}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(index - 1);
        if (e.key === "ArrowRight") go(index + 1);
      }}
      className="outline-none"
    >
      {/* Riel a todo el ancho de la pantalla */}
      <div
        className="relative overflow-hidden py-2 [--gap:1rem] [--w:min(86vw,calc(68svh*16/9))] md:[--gap:2rem] md:[--w:min(74vw,calc(70svh*16/9))]"
        style={{ height: "calc(var(--w) * 9 / 16 + 1rem)" }}
        onPointerDown={(e) => (drag.current = { x: e.clientX, moved: false })}
        onPointerMove={(e) => {
          if (drag.current && Math.abs(e.clientX - drag.current.x) > 8) drag.current.moved = true;
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          drag.current = null;
          if (!d) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 60) go(index + (dx < 0 ? 1 : -1));
        }}
      >
        <ul
          className="absolute left-1/2 top-2 flex gap-[var(--gap)] transition-transform duration-700 ease-[cubic-bezier(.39,.14,.26,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(calc(var(--w) / -2 - ${index} * (var(--w) + var(--gap))))` } as CSSProperties}
        >
          {videos.map((item, i) => {
            const active = i === index;
            return (
              <li
                key={item.id}
                aria-hidden={!active}
                className={cn(
                  "relative aspect-video w-[var(--w)] shrink-0 overflow-hidden bg-ink-soft transition-[opacity,transform] duration-700 ease-[cubic-bezier(.39,.14,.26,1)]",
                  active ? "opacity-100" : "scale-[0.86] opacity-35 hover:opacity-60",
                )}
              >
                {active && playing ? (
                  <iframe
                    src={embedUrl(item)}
                    title={item.title}
                    allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                    allowFullScreen
                    className="absolute inset-0 size-full"
                  />
                ) : (
                  <button
                    type="button"
                    tabIndex={active ? 0 : -1}
                    onClick={() => {
                      if (drag.current?.moved) return;
                      if (active) setPlaying(true);
                      else go(i);
                    }}
                    aria-label={active ? `${ui.common.play}: ${item.title}` : item.title}
                    className="group absolute inset-0 size-full"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumb(item.id, !noHd[item.id])}
                      alt=""
                      draggable={false}
                      loading={Math.abs(i - index) <= 2 ? "eager" : "lazy"}
                      onLoad={(e) => e.currentTarget.naturalWidth <= 120 && setNoHd((f) => ({ ...f, [item.id]: true }))}
                      onError={() => setNoHd((f) => ({ ...f, [item.id]: true }))}
                      className="absolute inset-0 size-full select-none object-cover"
                    />
                    {active && (
                      <>
                        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                        <span className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-paper/60 bg-ink/30 text-paper backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:bg-paper group-hover:text-ink md:size-24">
                          <Play className="ml-1 size-7 md:size-8" fill="currentColor" />
                        </span>
                      </>
                    )}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Título, fecha y controles */}
      <div className="shell mt-6 grid gap-6 md:mt-8 md:grid-cols-[1fr_auto] md:items-end">
        <div aria-live="polite">
          <p className="text-sm text-paper/50">
            {playing && <span className="mr-3 text-paper">● {ui.studio.nowPlaying}</span>}
            {fmt.format(new Date(v.date))}
          </p>
          <h2 className="mt-1 max-w-3xl text-2xl font-medium leading-tight md:text-4xl">{v.title}</h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label={lang === "en" ? "Previous video" : "Video anterior"}
            className="grid size-12 place-items-center rounded-full border border-paper/30 transition-colors hover:bg-paper hover:text-ink disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowLeft className="size-5" />
          </button>
          <span className="min-w-16 text-center text-sm tabular-nums text-paper/70">
            {String(index + 1).padStart(2, "0")} / {String(videos.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={index === last}
            aria-label={lang === "en" ? "Next video" : "Video siguiente"}
            className="grid size-12 place-items-center rounded-full border border-paper/30 transition-colors hover:bg-paper hover:text-ink disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>

      {/* Barra de progreso: un segmento por video, clic para saltar */}
      <div className="shell mt-8 flex gap-1.5">
        {videos.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => go(i)}
            aria-label={item.title}
            aria-current={i === index ? "true" : undefined}
            className="group h-6 flex-1"
          >
            <span className={cn("block h-0.5 w-full transition-colors", i === index ? "bg-paper" : "bg-paper/20 group-hover:bg-paper/50")} />
          </button>
        ))}
      </div>
    </div>
  );
}
