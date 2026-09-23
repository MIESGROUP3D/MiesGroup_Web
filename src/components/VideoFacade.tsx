"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { MediaImage, VideoRef } from "@/content/types";

/**
 * Patrón "facade": muestra un póster liviano y SOLO al hacer clic carga el
 * iframe de Vimeo/YouTube (≈1 MB de JS de terceros que ya no se descarga en la
 * carga inicial). Vimeo entrega HLS adaptativo: la calidad se ajusta sola al
 * ancho de banda del usuario.
 */
export function embedUrl(v: VideoRef) {
  if (v.provider === "vimeo") return `https://player.vimeo.com/video/${v.id}?autoplay=1&dnt=1&title=0&byline=0&portrait=0&color=c39462`;
  if (v.provider === "youtube") return `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1`;
  return v.src;
}

export function VideoFacade({
  video,
  fallbackPoster,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  autoLoad = false,
}: {
  video: VideoRef;
  fallbackPoster?: MediaImage;
  className?: string;
  sizes?: string;
  /** true = carga el reproductor de inmediato (p. ej. dentro de un modal ya abierto) */
  autoLoad?: boolean;
}) {
  const [active, setActive] = useState(autoLoad);
  const poster = video.poster ?? fallbackPoster;
  const ytThumb = video.provider === "youtube" ? `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg` : null;

  return (
    <div className={cn("group relative aspect-video overflow-hidden bg-ink-3", className)}>
      {active ? (
        video.provider === "file" ? (
          <video src={video.src} controls autoPlay playsInline className="absolute inset-0 size-full bg-black object-contain" />
        ) : (
          <iframe
            src={embedUrl(video)}
            title={video.title}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        )
      ) : (
        <button type="button" onClick={() => setActive(true)} className="absolute inset-0 size-full text-left" aria-label={`Reproducir: ${video.title}`}>
          {poster ? (
            <Image src={poster.src} alt="" fill sizes={sizes} quality={60} className="object-cover opacity-80 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100" />
          ) : ytThumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ytThumb} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-80" />
          ) : (
            <div className="absolute inset-0 blueprint bg-gradient-to-br from-ink-3 to-ink" />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
          <span className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-bone/50 bg-ink/40 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-bronze group-hover:bg-bronze group-hover:text-ink">
            <Play className="ml-1 size-7" fill="currentColor" />
          </span>
          <span className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <span className="text-sm font-medium">{video.title}</span>
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-bone-dim">{video.provider === "file" ? "MP4" : video.provider}</span>
          </span>
        </button>
      )}
    </div>
  );
}
