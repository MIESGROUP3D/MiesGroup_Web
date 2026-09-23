"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight, Play } from "lucide-react";
import { useRef, useState } from "react";
import { site } from "@/content/site";
import { Modal } from "./Modal";
import { VideoFacade } from "./VideoFacade";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Hero de la home.
 * Solución al problema #1 del diagnóstico: el PRIMER frame es un render (póster
 * con prioridad LCP). Si hay video de fondo, se pinta encima cuando carga, así
 * que el usuario nunca ve negro. Con prefers-reduced-motion no hay video ni parallax.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [reel, setReel] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const bg = site.hero.video;
  const lines = site.tagline.split(",").map((l) => l.trim());

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden" aria-label="Presentación">
      <motion.div style={{ y }} className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: reduce ? 1 : 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.6, ease }}
        >
          <Image src={site.hero.poster.src} alt={site.hero.poster.alt} fill priority quality={75} sizes="100vw" className="object-cover" />
          {bg?.provider === "file" && !reduce && (
            <video src={bg.src} autoPlay muted loop playsInline preload="metadata" poster={site.hero.poster.src} className="absolute inset-0 size-full object-cover" />
          )}
        </motion.div>
      </motion.div>

      {/* capas de lectura */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/40" />
      <div className="blueprint absolute inset-0 opacity-40" />

      <motion.div style={{ opacity: fade }} className="shell relative flex h-full flex-col justify-end pb-10 md:pb-14">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <h1 className="display md:col-span-12">
            <span className="sr-only">{site.name} — estudio 3D de visualización arquitectónica. </span>
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.04em]">
                <motion.span
                  className="block text-[clamp(3.2rem,8.6vw,9.75rem)]"
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.2, delay: 0.35 + i * 0.12, ease }}
                >
                  {i === lines.length - 1 ? (
                    <>
                      {line.replace(/exist$/i, "")}
                      <span className="text-bronze">exist</span>
                    </>
                  ) : (
                    line + ","
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            className="flex flex-col gap-6 md:col-span-12 md:flex-row md:items-end md:justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease }}
          >
            <p className="max-w-xs text-sm leading-relaxed text-bone-dim">
              Estudio 3D de visualización arquitectónica. Renders, animación, 360°, VR y experiencias Web3D desde {site.foundedYear}.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setReel(true)}
                className="group inline-flex items-center gap-3 bg-bone px-5 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-bronze"
              >
                <Play className="size-4" fill="currentColor" /> Ver reel
              </button>
              <Link
                href="/proyectos"
                className="group inline-flex items-center gap-2 border border-bone/40 px-5 py-3 text-[0.78rem] font-medium uppercase tracking-[0.14em] transition-colors hover:border-bronze hover:text-bronze"
              >
                Proyectos <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-line pt-5 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted">
          <span className="hidden sm:inline">{site.locations.map((l) => l.city).join(" · ")}</span>
          <span className="flex items-center gap-2">
            <ArrowDown className="size-3.5 animate-bounce" /> Scroll
          </span>
          <span>Est. {site.foundedYear}</span>
        </div>
      </motion.div>

      <Modal open={reel} onClose={() => setReel(false)} label="Reel de MIES Group">
        {reel && <VideoFacade video={site.hero.reel} autoLoad />}
      </Modal>
    </section>
  );
}
