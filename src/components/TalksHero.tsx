"use client";

import Image from "next/image";
import { Play, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { MediaImage, VideoRef } from "@/content/types";
import { t } from "@/content/ui";
import { useLang } from "@/lib/useLang";
import { embedUrl } from "./VideoFacade";

/**
 * Portada "escenario" de Talks: la conferencia de fondo a todo el ancho, en bucle
 * y sin sonido (como en la página anterior), con el titular encima.
 * - Fondo: Vimeo en modo background (sin controles ni sonido, "no rastrear").
 *   Debajo siempre está el póster: se ve mientras carga (el video aparece con un
 *   fundido poco después de cargar) y si el visitante pidió
 *   menos movimiento (ahí el video no se muestra).
 * - "Ver conferencia": la abre con sonido a pantalla completa (lightbox).
 */
export function TalksHero({
  video,
  poster,
  label,
  headline,
  cta,
}: {
  video: Extract<VideoRef, { provider: "vimeo" }>;
  poster: MediaImage;
  label: string;
  headline: string;
  cta: string;
}) {
  const ui = t(useLang());
  const [open, setOpen] = useState(false);
  // el iframe de Vimeo muestra negro y un indicador de carga hasta que arranca: queda invisible hasta entonces
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section className="relative isolate flex min-h-[80svh] flex-col justify-end overflow-hidden bg-ink text-paper">
      {/* fondo: póster + video en bucle a modo "cover" */}
      <Image src={poster.src} alt="" fill priority quality={75} sizes="100vw" className="-z-20 object-cover" />
      <iframe
        src={`https://player.vimeo.com/video/${video.id}?background=1&dnt=1`}
        title=""
        aria-hidden
        tabIndex={-1}
        allow="autoplay; fullscreen"
        onLoad={() => setTimeout(() => setReady(true), 1200)}
        style={{ opacity: ready ? 1 : 0 }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 transition-opacity duration-1000 h-[max(80svh,56.25vw)] w-[max(100vw,calc(80svh*16/9))] -translate-x-1/2 -translate-y-1/2 border-0 motion-reduce:hidden"
      />
      <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/45 to-ink/30" />

      <div className="shell pb-12 pt-8 md:pb-16">
        <p className="text-sm uppercase tracking-[0.16em] text-paper/70">{label}</p>
        <h1 className="display mt-3 max-w-5xl text-4xl leading-[1.02] md:text-7xl">{headline}</h1>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-paper py-2.5 pl-2.5 pr-6 font-medium text-ink transition-transform hover:scale-[1.03]"
        >
          <span className="grid size-9 place-items-center rounded-full bg-ink text-paper">
            <Play className="ml-0.5 size-4" fill="currentColor" />
          </span>
          {cta}
        </button>
      </div>

      {open &&
        createPortal(
          <div role="dialog" aria-modal="true" aria-label={video.title} className="fixed inset-0 z-[90] grid place-items-center bg-ink/95 p-4 backdrop-blur-sm md:p-10" onClick={() => setOpen(false)}>
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(false)}
              className="fixed right-[clamp(1rem,3vw,2.5rem)] top-3 flex h-10 items-center gap-2 rounded-full bg-paper px-4 text-sm font-medium text-ink"
            >
              {ui.common.close} <X className="size-4" />
            </button>
            <div className="aspect-video w-full max-w-[min(100%,calc(85svh*16/9))] bg-ink" onClick={(e) => e.stopPropagation()}>
              <iframe src={embedUrl(video)} title={video.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="size-full" />
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
