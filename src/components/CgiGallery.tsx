"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CgiVideo } from "@/content/cgi";
import { t } from "@/content/ui";
import { useLang } from "@/lib/useLang";
import { useVimeoPlaying } from "@/lib/useVimeoPlaying";

/*
 * Disposición (como la galería de renders, con formas variadas):
 * - Fila 1 (bento): dos videos horizontales apilados a la izquierda y, a la derecha,
 *   uno vertical grande que ocupa el alto de los dos.
 * - Resto en filas "justificadas": cada tarjeta con su forma y un ancho proporcional,
 *   así todas las de una fila quedan del mismo alto. Un video suelto al final va a lo ancho.
 */
export const H = 16 / 9; // horizontal
export const V = 9 / 16; // vertical
export const P = 4 / 5; // retrato suave
// ancho relativo de la columna vertical para que mida lo mismo que dos horizontales apiladas
const BENTO_SIDE = 2 * (9 / 16) * V; // ≈ 0.633
// filas siguientes: una de 3 (el tercero horizontal) y una de 2 horizontales lado a lado
const ROWS: number[][] = [
  [P, P, H],
  [H, H],
];
type Row<T> = { items: { item: T; ratio: number }[] };
function toRows<T>(items: T[], pattern: number[][] = ROWS): Row<T>[] {
  const rows: Row<T>[] = [];
  for (let i = 0, r = 0; i < items.length; r++) {
    const shapes = pattern[r % pattern.length];
    const chunk = items.slice(i, i + shapes.length);
    rows.push({
      items: chunk.map((item, k) => ({
        item,
        ratio: chunk.length < shapes.length ? H : shapes[k],
      })),
    });
    i += chunk.length;
  }
  return rows;
}

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/**
 * Galería de animaciones CGI (bento + filas de formas variadas, ver arriba). Como en la página
 * anterior, cada tarjeta reproduce su video en bucle y sin sonido mientras se ve en
 * pantalla (Vimeo en modo fondo, "no rastrear"); el reproductor solo se monta
 * cuando la tarjeta está a la vista y se quita al salir, así la página no se pone pesada.
 * Clic → el video completo, con sonido, a pantalla completa.
 */
export function CgiGallery({
  videos,
  bento: withBento = true,
  rows,
}: {
  videos: CgiVideo[];
  /** primera fila tipo bento (2 horizontales + 1 vertical grande); útil si el 3.º video es vertical */
  bento?: boolean;
  /** formas por fila para el resto (por defecto [P, P, H] y [H, H]) */
  rows?: number[][];
}) {
  const lang = useLang();
  const ui = t(lang);
  const [open, setOpen] = useState<CgiVideo | null>(null);
  const bento = withBento ? videos.slice(0, 3) : [];
  const rest = bento.length === 3 ? videos.slice(3) : videos;

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

  return (
    <>
      <div className="space-y-3 md:space-y-4">
        {/* Fila 1: bento */}
        {bento.length === 3 && (
          <div
            className="grid gap-3 md:grid-cols-[1fr_var(--side)] md:gap-4"
            style={{ "--side": `${BENTO_SIDE}fr` } as React.CSSProperties}
          >
            <div className="flex flex-col gap-3 md:gap-4">
              <Card
                video={bento[0]}
                ratio={H}
                onOpen={setOpen}
                play={ui.common.play}
              />
              <Card
                video={bento[1]}
                ratio={H}
                onOpen={setOpen}
                play={ui.common.play}
                delay={0.05}
              />
            </div>
            <Card
              video={bento[2]}
              ratio={V}
              onOpen={setOpen}
              play={ui.common.play}
              delay={0.1}
              fill
            />
          </div>
        )}
        {/* Resto: filas justificadas */}
        {toRows(rest, rows).map((row, r) => (
          <ul key={r} className="flex flex-col gap-3 md:flex-row md:gap-4">
            {row.items.map(({ item: video, ratio }, i) => (
              <li key={video.id} style={{ flex: `${ratio} 1 0%` }}>
                <Card
                  video={video}
                  ratio={ratio}
                  onOpen={setOpen}
                  play={ui.common.play}
                  delay={i * 0.05}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>

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
              className={
                open.vertical
                  ? "aspect-[9/16] h-[min(85svh,100%)] max-w-full bg-ink"
                  : "aspect-video w-full max-w-[min(100%,calc(85svh*16/9))] bg-ink"
              }
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://player.vimeo.com/video/${open.id}?autoplay=1&dnt=1&title=0&byline=0&portrait=0&color=ffffff`}
                title={open.title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="size-full"
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

/** Video de fondo de la tarjeta: se monta al verse en pantalla y se quita al salir. */
function VimeoPreview({
  id,
  vertical,
  cardRatio,
}: {
  id: string;
  vertical?: boolean;
  cardRatio: number;
}) {
  // "cover": el iframe (con la proporción del video) se agranda hasta llenar la tarjeta
  const videoRatio = vertical ? 9 / 16 : 16 / 9;
  const size =
    videoRatio > cardRatio
      ? { width: `${(videoRatio / cardRatio) * 100}%`, height: "100%" }
      : { width: "100%", height: `${(cardRatio / videoRatio) * 100}%` };
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [visible, setVisible] = useState(false);
  // una vez visto, el reproductor se queda montado: al salir de pantalla se PAUSA y al
  // volver SIGUE donde iba (antes se quitaba y el video volvía a empezar)
  const [mounted, setMounted] = useState(false);
  if (visible && !mounted) setMounted(true);
  // invisible hasta que Vimeo de verdad reproduce (mientras carga muestra negro + indicador)
  const ready = useVimeoPlaying(frame, mounted);

  // pausar/seguir con la API de postMessage del reproductor de Vimeo
  useEffect(() => {
    if (!mounted || !ready) return;
    frame.current?.contentWindow?.postMessage(JSON.stringify({ method: visible ? "play" : "pause" }), "https://player.vimeo.com");
  }, [visible, mounted, ready]);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
    >
      {mounted && (
        <iframe
          ref={frame}
          src={`https://player.vimeo.com/video/${id}?background=1&dnt=1`}
          title=""
          tabIndex={-1}
          allow="autoplay"
          style={{ opacity: ready ? 1 : 0, ...size }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.02] border-0 transition-opacity duration-700"
        />
      )}
    </span>
  );
}

/**
 * Tarjeta de video. `fill`: en escritorio ocupa todo el alto de su celda (la vertical
 * del bento); en móvil usa su propia proporción.
 */
function Card({
  video,
  ratio,
  onOpen,
  play,
  delay = 0,
  fill = false,
}: {
  video: CgiVideo;
  ratio: number;
  onOpen: (v: CgiVideo) => void;
  play: string;
  delay?: number;
  fill?: boolean;
}) {
  return (
    <motion.div
      className={fill ? "md:h-full" : undefined}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -5% 0px" }}
      transition={{ duration: 0.6, ease: [0.39, 0.14, 0.26, 1], delay }}
    >
      <button
        type="button"
        onClick={() => onOpen(video)}
        aria-label={`${play}: ${video.title}`}
        className={`group relative block w-full overflow-hidden bg-ink-soft text-left ${fill ? "md:!aspect-auto md:h-full" : ""}`}
        style={{ aspectRatio: ratio }}
      >
        <Image
          src={video.poster.src}
          alt={video.poster.alt}
          fill
          quality={75}
          sizes="(min-width: 768px) 60vw, 100vw"
          className="object-cover"
        />
        <VimeoPreview
          id={video.id}
          vertical={video.vertical}
          cardRatio={ratio}
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent"
        />
        <span className="absolute right-4 top-4 rounded-full bg-ink/70 px-2.5 py-1 text-xs tabular-nums text-paper backdrop-blur">
          {fmt(video.seconds)}
        </span>
        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-paper md:p-5">
          <span className="text-lg font-semibold leading-tight tracking-[-0.02em] md:text-xl">
            {video.title}
          </span>
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-paper/50 transition-colors group-hover:bg-paper group-hover:text-ink">
            <Play className="ml-0.5 size-4" fill="currentColor" />
          </span>
        </span>
      </button>
    </motion.div>
  );
}
