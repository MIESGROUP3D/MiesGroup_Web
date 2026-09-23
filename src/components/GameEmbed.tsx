"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Gamepad2, Maximize, Minimize, Play, RotateCcw, Smartphone } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Game } from "@/content/types";
import { VideoFacade } from "./VideoFacade";

type State = "idle" | "loading" | "ready";

/**
 * Contenedor del juego web.
 *
 * - El build NO se descarga hasta que el usuario pulsa "Jugar" (protege la
 *   carga de la página: un build de Unity puede pesar 50-200 MB).
 * - iframe same-origin apuntando a /public/games/<slug>/index.html: el juego
 *   queda aislado del CSS/JS del sitio.
 * - Protocolo opcional por postMessage que el juego puede emitir:
 *     { type: "game:progress", value: 0..1 }  → barra de progreso real
 *     { type: "game:ready" }                  → oculta la pantalla de carga
 *   Si el juego no los emite, se usa el evento `load` del iframe.
 * - Pantalla completa (Fullscreen API) y aviso en móvil si el juego no lo soporta.
 */
export function GameEmbed({ game }: { game: Game }) {
  const wrap = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState<State>("idle");
  const [progress, setProgress] = useState<number | null>(null);
  const [fs, setFs] = useState(false);
  const [nonce, setNonce] = useState(0);
  const coarse = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(pointer: coarse)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(pointer: coarse)").matches,
    () => false,
  );

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow) return;
      if (e.data?.type === "game:progress") setProgress(Number(e.data.value));
      if (e.data?.type === "game:ready") setState("ready");
    };
    const onFs = () => setFs(document.fullscreenElement === wrap.current);
    window.addEventListener("message", onMsg);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      window.removeEventListener("message", onMsg);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, []);

  const unsupported = coarse && !game.mobileSupported;

  const toggleFs = async () => {
    if (!wrap.current) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await wrap.current.requestFullscreen?.();
  };

  if (unsupported) {
    return (
      <div className="border border-line bg-ink-2 p-6">
        <p className="flex items-center gap-3 text-sm text-bone-dim">
          <Smartphone className="size-5 text-bronze" /> Este juego está pensado para computador. Mira el gameplay mientras tanto:
        </p>
        {game.trailer ? <VideoFacade video={game.trailer} fallbackPoster={game.cover} className="mt-5" /> : null}
      </div>
    );
  }

  return (
    <div>
      <div ref={wrap} className="crosshair relative aspect-[4/5] w-full overflow-hidden bg-black sm:aspect-video [&:fullscreen]:aspect-auto">
        {state !== "idle" && (
          <iframe
            key={nonce}
            ref={frame}
            src={game.buildPath}
            title={game.title}
            allow="fullscreen; autoplay; gamepad"
            onLoad={() => setState((s) => (s === "loading" ? "ready" : s))}
            className="absolute inset-0 size-full"
          />
        )}

        <AnimatePresence>
          {state !== "ready" && (
            <motion.div className="absolute inset-0" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
              <Image src={game.cover.src} alt={game.cover.alt} fill sizes="(min-width: 1024px) 75vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
              <div className="absolute inset-0 grid place-items-center">
                {state === "idle" ? (
                  <button
                    type="button"
                    onClick={() => setState("loading")}
                    className="group flex flex-col items-center gap-4"
                  >
                    <span className="grid size-24 place-items-center rounded-full bg-bronze text-ink transition-transform duration-500 group-hover:scale-110">
                      <Play className="ml-1 size-9" fill="currentColor" />
                    </span>
                    <span className="display text-3xl">Jugar</span>
                  </button>
                ) : (
                  <div className="w-64 text-center" role="status" aria-live="polite">
                    <Gamepad2 className="mx-auto size-8 animate-pulse text-bronze" />
                    <p className="mt-4 font-mono text-xs uppercase tracking-widest text-bone-dim">
                      Cargando {progress !== null ? `${Math.round(progress * 100)}%` : "…"}
                    </p>
                    <div className="mt-3 h-px w-full overflow-hidden bg-line">
                      {progress !== null ? (
                        <div className="h-full bg-bronze transition-[width]" style={{ width: `${progress * 100}%` }} />
                      ) : (
                        <motion.div className="h-full w-1/3 bg-bronze" animate={{ x: ["-100%", "300%"] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <ul className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted">
          {game.controls.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={state === "idle"}
            onClick={() => { setNonce((n) => n + 1); setState("loading"); setProgress(null); }}
            className="inline-flex items-center gap-2 border border-line px-4 py-2 text-xs uppercase tracking-widest hover:border-bronze hover:text-bronze disabled:opacity-40"
          >
            <RotateCcw className="size-4" /> Reiniciar
          </button>
          <button
            type="button"
            disabled={state === "idle"}
            onClick={toggleFs}
            className="inline-flex items-center gap-2 border border-line px-4 py-2 text-xs uppercase tracking-widest hover:border-bronze hover:text-bronze disabled:opacity-40"
          >
            {fs ? <Minimize className="size-4" /> : <Maximize className="size-4" />} {fs ? "Salir" : "Pantalla completa"}
          </button>
        </div>
      </div>
    </div>
  );
}
