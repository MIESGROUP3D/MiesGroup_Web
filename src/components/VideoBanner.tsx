"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { withBase } from "@/lib/basePath";
import { useLang } from "@/lib/useLang";

/** Versión AV1 de un banner: banner-x-1080.mp4 → banner-x-1080-av1.mp4 */
const av1 = (src: string) => src.replace(/\.mp4$/, "-av1.mp4");
// perfil Main, 8 bits; nivel 5.0 para 1080p ultra ancho (2736×1080) y 4.0 para 720p
const AV1_1080 = 'video/mp4; codecs="av01.0.12M.08"';
const AV1_720 = 'video/mp4; codecs="av01.0.08M.08"';

/**
 * Banner grande con video en bucle (sin sonido) y texto encima, como la portada
 * de la página anterior de 360° (miesgroup3d.com/360-virtual-tour).
 * - MP4 alojado en el sitio (copia del video de Bunny Stream): 1080p en pantallas
 *   grandes y 720p en móvil, cada uno en AV1 con respaldo H.264.
 * - Mientras carga se ve el póster: un next/image detrás del video (WebP del tamaño
 *   de la pantalla y con prioridad, porque es lo primero que se ve), en vez del
 *   atributo poster, que siempre baja el JPG completo.
 * - El video trae franjas negras arriba y abajo: se amplía un poco para ocultarlas.
 * - Botón de pausa (accesibilidad: todo movimiento de más de 5 s debe poder detenerse).
 * - Con "reducir movimiento" activado no se reproduce solo.
 */
export function VideoBanner({ src1080, src720, poster, title, text, logo }: { src1080: string; src720: string; poster: string; title: string; text: string; logo?: { src: string; width: number; height: number } }) {
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
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        aria-hidden
        className="absolute inset-0 -z-10 size-full scale-[1.08] object-cover motion-reduce:hidden"
      >
        {/* AV1 primero (~45 % más liviano); el navegador que no lo soporta usa H.264.
            Las versiones -av1.mp4 las genera scripts/compress-videos.mjs (npm run videos). */}
        <source src={withBase(av1(src720))} type={AV1_720} media="(max-width: 767px)" />
        <source src={withBase(src720)} type="video/mp4" media="(max-width: 767px)" />
        <source src={withBase(av1(src1080))} type={AV1_1080} />
        <source src={withBase(src1080)} type="video/mp4" />
      </video>
      {/* póster: se ve mientras carga el video y, con "reducir movimiento", en su lugar.
          Misma ampliación que el video para que no salte al empezar a reproducirse. */}
      <Image src={withBase(poster)} alt="" fill priority sizes="100vw" className="-z-20 scale-[1.08] object-cover motion-reduce:scale-100" />
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
        {logo ? (
          // logo en lugar del título (p. ej. ORBITAL); el título queda como texto alternativo
          <h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBase(logo.src)} alt={title} width={logo.width} height={logo.height} className="h-auto w-64 md:w-[26rem]" />
          </h2>
        ) : (
          <h2 className="display text-4xl leading-[1.02] md:text-7xl">{title}</h2>
        )}
        <p className="mt-3 max-w-xl text-paper/80 md:text-lg">{text}</p>
      </div>
    </section>
  );
}
