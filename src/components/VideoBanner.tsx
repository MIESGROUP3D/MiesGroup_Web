"use client";

import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { withBase } from "@/lib/basePath";
import { useLang } from "@/lib/useLang";

/**
 * Banner grande con video en bucle (sin sonido) y texto encima, como la portada
 * de la página anterior de 360° (miesgroup3d.com/360-virtual-tour).
 * - MP4 alojado en el sitio (copia del video de Bunny Stream): 1080p en pantallas
 *   grandes y 720p en móvil. El póster se ve mientras carga.
 * - El video trae franjas negras arriba y abajo: se amplía un poco para ocultarlas.
 * - Botón de pausa (accesibilidad: todo movimiento de más de 5 s debe poder detenerse).
 * - Con "reducir movimiento" activado no se reproduce solo.
 */
export function VideoBanner({ src1080, src720, poster, title, text }: { src1080: string; src720: string; poster: string; title: string; text: string }) {
  const en = useLang() === "en";
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  return (
    <section className="relative isolate mb-3 flex min-h-[72svh] items-end overflow-hidden bg-ink text-paper md:mb-4 md:h-[max(calc(100svh-8.5rem),min(85svh,56.25vw))]">
      <video
        ref={ref}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={withBase(poster)}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        aria-hidden
        className="absolute inset-0 -z-10 size-full scale-[1.08] object-cover motion-reduce:hidden"
      >
        <source src={withBase(src720)} type="video/mp4" media="(max-width: 767px)" />
        <source src={withBase(src1080)} type="video/mp4" />
      </video>
      {/* con "reducir movimiento" solo se ve el póster */}
      <span aria-hidden className="absolute inset-0 -z-20 hidden bg-cover bg-center motion-reduce:block" style={{ backgroundImage: `url(${withBase(poster)})` }} />
      <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />

      <div className="w-full max-w-3xl p-5 md:p-10">
        {/* pausa justo encima del título */}
        <button
          type="button"
          onClick={toggle}
          className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-paper/40 px-4 py-2 text-sm backdrop-blur transition-colors hover:bg-paper hover:text-ink motion-reduce:hidden"
        >
          {paused ? <Play className="size-3.5" fill="currentColor" /> : <Pause className="size-3.5" fill="currentColor" />}
          {paused ? (en ? "Play" : "Reproducir") : en ? "Pause" : "Pausa"}
        </button>
        <h2 className="display text-4xl leading-[1.02] md:text-7xl">{title}</h2>
        <p className="mt-3 max-w-xl text-paper/80 md:text-lg">{text}</p>
      </div>
    </section>
  );
}
