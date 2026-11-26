"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CgiVideo } from "@/content/cgi";
import { t } from "@/content/ui";
import { useLang } from "@/lib/useLang";
import { useVimeoPlaying } from "@/lib/useVimeoPlaying";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/**
 * Una pieza destacada a la vez + tira de miniaturas quietas (solo imagen).
 * - Solo UN video corre en la página (el destacado, en bucle y sin sonido, y solo
 *   mientras se ve); las miniaturas son pósters, así la página pesa poco.
 * - Clic en el destacado → el video completo con sonido; clic en una miniatura → lo destaca.
 */
export function ReelShowcase({ videos }: { videos: CgiVideo[] }) {
  const ui = t(useLang());
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState<CgiVideo | null>(null);
  const current = videos[index];

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

  if (!current) return null;

  return (
    <>
      <div className="relative aspect-video w-full overflow-hidden bg-ink text-paper">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.button
            key={current.id}
            type="button"
            onClick={() => setOpen(current)}
            aria-label={`${ui.common.play}: ${current.title}`}
            className="group absolute inset-0 block size-full text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Stage video={current} />
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-8">
              <span>
                <span className="block text-xs tabular-nums text-paper/70">
                  {String(index + 1).padStart(2, "0")} / {String(videos.length).padStart(2, "0")} · {fmt(current.seconds)}
                </span>
                <span className="display mt-1 block text-2xl leading-tight md:text-4xl">{current.title}</span>
              </span>
              <span className="grid size-12 shrink-0 place-items-center rounded-full border border-paper/50 transition-colors group-hover:bg-paper group-hover:text-ink md:size-14">
                <Play className="ml-0.5 size-5" fill="currentColor" />
              </span>
            </span>
          </motion.button>
        </AnimatePresence>
      </div>

      {videos.length > 1 && (
        <ul className="mt-3 flex gap-3 overflow-x-auto pb-2 md:mt-4 md:gap-4">
          {videos.map((v, i) => (
            <li key={v.id} className="w-[44%] shrink-0 sm:w-[30%] md:w-0 md:min-w-0 md:flex-1">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={v.title}
                aria-current={i === index ? "true" : undefined}
                className="group block w-full text-left"
              >
                <span className={`relative block aspect-video overflow-hidden bg-ink-soft outline outline-2 outline-offset-2 transition-[outline-color] ${i === index ? "outline-ink" : "outline-transparent"}`}>
                  <Image
                    src={v.poster.src}
                    alt=""
                    fill
                    quality={60}
                    sizes="(min-width: 768px) 20vw, 44vw"
                    className={`object-cover transition-all duration-500 group-hover:scale-105 ${i === index ? "" : "opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0"}`}
                  />
                </span>
                <span className="mt-2 block text-xs leading-snug text-ink-soft">{v.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

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
              className={open.vertical ? "aspect-[9/16] h-[min(85svh,100%)] max-w-full bg-ink" : "aspect-video w-full max-w-[min(100%,calc(85svh*16/9))] bg-ink"}
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

/** Póster + video en bucle sin sonido (solo mientras el escenario está a la vista). */
function Stage({ video }: { video: CgiVideo }) {
  const wrap = useRef<HTMLSpanElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [visible, setVisible] = useState(false);
  const ready = useVimeoPlaying(frame, visible);

  useEffect(() => {
    const el = wrap.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // vertical: caja 9:16 centrada sobre el póster difuminado; horizontal: llena el escenario
  const box = video.vertical ? "absolute inset-y-0 left-1/2 aspect-[9/16] -translate-x-1/2" : "absolute inset-0";

  return (
    <span ref={wrap} className="absolute inset-0 block overflow-hidden">
      {video.vertical && <Image src={video.poster.src} alt="" fill sizes="100vw" className="scale-110 object-cover opacity-50 blur-2xl" />}
      <span className={`${box} overflow-hidden`}>
        <Image src={video.poster.src} alt={video.poster.alt} fill priority sizes="(min-width: 1024px) 80vw, 100vw" className="object-cover" />
        {visible && (
          <iframe
            ref={frame}
            src={`https://player.vimeo.com/video/${video.id}?background=1&dnt=1`}
            title=""
            aria-hidden
            tabIndex={-1}
            allow="autoplay"
            style={{ opacity: ready ? 1 : 0 }}
            className="pointer-events-none absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 scale-[1.02] border-0 transition-opacity duration-700 motion-reduce:hidden"
          />
        )}
      </span>
    </span>
  );
}
