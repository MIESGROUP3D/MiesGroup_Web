"use client";

import { Maximize2, Pause, Play, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import type { ChannelVideo } from "@/content/channel";
import { t } from "@/content/ui";
import { useLang } from "@/lib/useLang";
import { embedUrl } from "./VideoFacade";

const AUTOPLAY_MS = 5000;
const thumb = (id: string, hd: boolean) =>
  `https://i.ytimg.com/vi/${id}/${hd ? "maxresdefault" : "hqdefault"}.jpg`;

/**
 * Channel como "Media Reels" (ref. Framer marketplace "Media Reels"):
 * - Tarjetas verticales redondeadas en un riel; la activa al centro, más grande,
 *   y las vecinas más chicas y giradas en 3D hacia ella (efecto "3D cards").
 * - Avanza sola cada 5 s (botón Pausa/Reproducir arriba a la derecha); se detiene
 *   al pasar el mouse, al arrastrar o al abrir un video.
 * - Se mueve arrastrando, con la rueda horizontal del trackpad, ← → del teclado
 *   o tocando una tarjeta vecina.
 * - Play o ⤢: el video se abre a pantalla completa (lightbox). El reproductor de
 *   YouTube (youtube-nocookie) solo se carga ahí.
 * El riel se centra solo con CSS (left 50% + translateX con el ancho de tarjeta).
 */
export function ChannelReels({ videos }: { videos: ChannelVideo[] }) {
  const lang = useLang();
  const ui = t(lang);
  const en = lang === "en";
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState<ChannelVideo | null>(null);
  const [noHd, setNoHd] = useState<Record<string, boolean>>({});
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const dragged = useRef(false); // el clic que sigue a un arrastre no abre el video
  const wheelLock = useRef(0);
  const n = videos.length;
  const go = (i: number) => setIndex(((i % n) + n) % n);

  // avance automático (en bucle); en pausa mientras el mouse está encima o hay un video abierto
  const running = auto && !hover && !open;
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % n), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [running, n]);

  // lightbox: Escape cierra y la página no se desplaza por detrás
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const fmt = new Intl.DateTimeFormat(en ? "en-US" : "es-CO", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div>
      {/* Riel */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={ui.studio.channel}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(index - 1);
          if (e.key === "ArrowRight") go(index + 1);
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onWheel={(e) => {
          // solo el desplazamiento horizontal (trackpad): la rueda vertical sigue bajando la página
          if (
            Math.abs(e.deltaX) < 30 ||
            Math.abs(e.deltaX) < Math.abs(e.deltaY)
          )
            return;
          const now = Date.now();
          if (now < wheelLock.current) return;
          wheelLock.current = now + 600;
          go(index + (e.deltaX > 0 ? 1 : -1));
        }}
        onPointerDown={(e) => (drag.current = { x: e.clientX, moved: false })}
        onPointerMove={(e) => {
          if (drag.current && Math.abs(e.clientX - drag.current.x) > 8)
            drag.current.moved = true;
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          drag.current = null;
          dragged.current = !!d?.moved;
          if (dragged.current) setTimeout(() => (dragged.current = false));
          if (d && Math.abs(e.clientX - d.x) > 50)
            go(index + (e.clientX < d.x ? 1 : -1));
        }}
        className="relative touch-pan-y select-none overflow-hidden outline-none [--gap:0.75rem] [--w:min(78vw,calc(62svh*0.7))] [perspective:1600px] md:[--gap:1.25rem] md:[--w:min(30vw,calc(64svh*0.7))]"
        style={{ height: "calc(var(--w) / 0.7 + 2rem)" }}
      >
        <ul
          className="absolute left-1/2 top-4 flex items-center gap-[var(--gap)] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] [transform-style:preserve-3d] motion-reduce:transition-none"
          style={
            {
              transform: `translateX(calc(var(--w) / -2 - ${index} * (var(--w) + var(--gap))))`,
            } as CSSProperties
          }
        >
          {videos.map((v, i) => {
            const off = i - index;
            const active = off === 0;
            // vecinas: más chicas, apagadas y giradas en 3D hacia el centro
            const style: CSSProperties = {
              transform: active
                ? "none"
                : `scale(${Math.abs(off) === 1 ? 0.86 : 0.76}) rotateY(${off < 0 ? 10 : -10}deg)`,
              opacity: Math.abs(off) > 2 ? 0.2 : active ? 1 : 0.55,
            };
            return (
              <li
                key={v.id}
                aria-hidden={!active}
                style={style}
                className="relative aspect-[7/10] w-[var(--w)] shrink-0 overflow-hidden rounded-2xl bg-ink-soft shadow-[0_30px_60px_-20px_rgba(0,0,0,.7)] transition-[transform,opacity] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
              >
                {/* toda la tarjeta es el botón: abre el video (y la centra si era una vecina) */}
                <button
                  type="button"
                  tabIndex={active ? 0 : -1}
                  onClick={() => {
                    if (dragged.current) return;
                    go(i);
                    setOpen(v);
                  }}
                  aria-label={`${ui.common.play}: ${v.title}`}
                  className="group absolute inset-0 size-full cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb(v.id, !noHd[v.id])}
                    alt=""
                    draggable={false}
                    loading={Math.abs(off) <= 2 ? "eager" : "lazy"}
                    // YouTube responde 404 con una imagen gris de 120 px (no dispara onError): se detecta por el tamaño
                    onLoad={(e) =>
                      e.currentTarget.naturalWidth <= 120 &&
                      setNoHd((f) => ({ ...f, [v.id]: true }))
                    }
                    onError={() => setNoHd((f) => ({ ...f, [v.id]: true }))}
                    className={cn(
                      "absolute inset-0 size-full object-cover transition-transform duration-[6s] ease-out",
                      active && "scale-110",
                    )}
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent transition-opacity duration-500 group-hover:opacity-80"
                  />
                </button>

                {/* pista visual de "abrir a pantalla completa" (el clic lo recibe la tarjeta) */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-ink/80 text-paper backdrop-blur md:right-4 md:top-4"
                >
                  <Maximize2 className="size-4" />
                </span>

                {/* título y fecha */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-paper md:p-5">
                  <p className="text-xs text-paper/60">
                    {fmt.format(new Date(v.date))}
                  </p>
                  <h3
                    className={cn(
                      "mt-1 font-medium leading-snug",
                      active ? "text-lg md:text-xl" : "text-base",
                    )}
                  >
                    {v.title}
                  </h3>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* progreso del avance automático + pausa (a la derecha) */}
      <div className="shell mt-2 flex items-center gap-6">
        <div className="flex flex-1 gap-1.5">
          {videos.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => go(i)}
              aria-label={v.title}
              aria-current={i === index ? "true" : undefined}
              className="group h-6 flex-1"
            >
              <span className="relative block h-0.5 w-full overflow-hidden bg-paper/20">
                {i < index && <span className="absolute inset-0 bg-paper/60" />}
                {i === index && (
                  <span
                    key={`${index}-${running}`}
                    className={cn(
                      "absolute inset-y-0 left-0 bg-paper",
                      running
                        ? "animate-[reel-progress_linear_forwards]"
                        : "w-full",
                    )}
                    style={
                      running
                        ? { animationDuration: `${AUTOPLAY_MS}ms` }
                        : undefined
                    }
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setAuto((a) => !a)}
          aria-pressed={!auto}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-paper px-4 py-2 text-sm font-medium text-ink ring-4 ring-paper/15 transition-transform hover:scale-105"
        >
          {auto ? (
            <Pause className="size-3.5" fill="currentColor" />
          ) : (
            <Play className="size-3.5" fill="currentColor" />
          )}
          {auto ? (en ? "Pause" : "Pausa") : en ? "Play" : "Reproducir"}
        </button>
      </div>

      {/* Lightbox a pantalla completa */}
      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
            className="fixed inset-0 z-[90] grid place-items-center bg-ink/95 p-4 backdrop-blur-sm md:p-10"
            onClick={() => setOpen(null)}
          >
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(null)}
              className="fixed right-[clamp(1rem,3vw,2.5rem)] top-3 flex h-10 items-center gap-2 rounded-full bg-paper px-4 text-sm font-medium text-ink"
            >
              {ui.common.close} <X className="size-4" />
            </button>
            <div
              className="aspect-video w-full max-w-[min(100%,calc(85svh*16/9))] bg-ink"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={embedUrl(open)}
                title={open.title}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                className="size-full"
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
