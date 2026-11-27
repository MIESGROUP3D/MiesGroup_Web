"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, MonitorSmartphone, Play, Plus, X } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { withBase } from "@/lib/basePath";
import { route } from "@/lib/i18n";
import { expandTransition } from "@/lib/motion";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { useLang } from "@/lib/useLang";
import { whatsappHref } from "@/content/site";
import { web3d, type Web3dFeature } from "@/content/web3d";
import { WhatsappIcon } from "./icons";

/**
 * Categoría ORBITAL de Proyectos (fondo negro), pensada como página de producto:
 * que una constructora termine pidiendo una demo.
 *   1. Intro + puntos clave
 *   2. Demo en vivo (solo si web3d.demoUrl tiene enlace)
 *   3. Video explicativo y tipologías
 *   4. Ventajas en tarjetas: cada una con su clip; al tocarla crece a un panel con
 *      el texto completo (estilo App Store, misma curva que los proyectos)
 *   5. "Para tu equipo de ventas": módulo comercial, panel y Analytics
 *   6. Cierre con "Agenda una demo" (WhatsApp con mensaje sobre ORBITAL) y contacto
 */
export function Web3dShowcase() {
  const lang = useLang();
  const tx = (v: Record<string, string>) => v[lang];

  return (
    <div className="text-paper">
      {/* 1. Texto + puntos clave */}
      <section className="grid gap-8 px-1 py-12 md:grid-cols-12 md:gap-6 md:px-4 md:py-16">
        <p className="text-2xl leading-snug md:col-span-6 md:text-3xl">{tx(web3d.intro[0])}</p>
        <ul className="space-y-4 md:col-span-5 md:col-start-8">
          {web3d.highlights.map((h) => (
            <li key={h.es} className="flex gap-3 border-t border-paper/15 pt-4 text-paper/80">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-paper" />
              {tx(h)}
            </li>
          ))}
        </ul>
      </section>

      {/* 2. Demo en vivo */}
      {web3d.demoUrl && <LiveDemo url={web3d.demoUrl} />}

      {/* 3. Video explicativo */}
      <ExplainerVideo />

      <section className="grid items-center gap-6 py-12 md:grid-cols-12 md:py-16">
        <div className="md:col-span-7">
          <InViewVideo src={web3d.typologies.video} poster={web3d.typologies.poster} sizes="(min-width: 768px) 58vw, 100vw" className="relative aspect-video w-full" />
        </div>
        <p className="px-1 leading-relaxed text-paper/80 md:col-span-5 md:px-4 md:text-lg">{tx(web3d.intro[1])}</p>
      </section>

      {/* 4. Ventajas */}
      <Features />

      {/* 5. Equipo de ventas */}
      <section aria-labelledby="h-ventas" className="mt-16 grid items-center gap-8 border-t border-paper/15 pt-12 md:mt-24 md:grid-cols-12 md:gap-6 md:pt-16">
        <div className="px-1 md:col-span-5 md:px-4">
          <p className="text-sm uppercase tracking-[0.14em] text-paper/50">{tx(web3d.sales.eyebrow)}</p>
          <h2 id="h-ventas" className="display mt-3 text-3xl leading-tight md:text-5xl">
            {tx(web3d.sales.title)}
          </h2>
          <p className="mt-4 leading-relaxed text-paper/75 md:text-lg">{tx(web3d.sales.text)}</p>
          <dl className="mt-8 space-y-5">
            {web3d.sales.items.map((it) => (
              <div key={it.title.es} className="border-t border-paper/15 pt-4">
                <dt className="font-medium">{tx(it.title)}</dt>
                <dd className="mt-1 text-paper/70">{tx(it.text)}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="md:col-span-7">
          <InViewVideo src={web3d.sales.clip.video} poster={web3d.sales.clip.poster} sizes="(min-width: 768px) 58vw, 100vw" className="relative aspect-video w-full" />
        </div>
      </section>

      {/* 6. Cierre */}
      <section className="mt-16 border-t border-paper/15 px-1 pt-12 text-center md:mt-24 md:px-4 md:pt-20">
        <h2 className="display text-3xl md:text-5xl">{tx(web3d.cta.closingTitle)}</h2>
        <p className="mx-auto mt-4 max-w-xl text-paper/75 md:text-lg">{tx(web3d.cta.closingText)}</p>
        <div className="mt-8 flex justify-center">
          <OrbitalActions withContact />
        </div>
      </section>
    </div>
  );
}

/**
 * Botones de ORBITAL: "Agenda una demo" (WhatsApp con un mensaje sobre ORBITAL),
 * "Ver demo en vivo" (solo si hay enlace) y, en el cierre, "Escríbenos" (Contacto).
 * También van en el banner (ProjectGrid → VideoBanner).
 */
export function OrbitalActions({ withContact = false }: { withContact?: boolean }) {
  const lang = useLang();
  const tx = (v: Record<string, string>) => v[lang];
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={whatsappHref(tx(web3d.cta.whatsapp))}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper/85"
      >
        <WhatsappIcon className="size-4" />
        {tx(web3d.cta.demo)}
      </a>
      {web3d.demoUrl && (
        <a href="#demo" className="inline-flex items-center gap-2 rounded-full border border-paper/40 px-5 py-3 text-sm backdrop-blur transition-colors hover:bg-paper hover:text-ink">
          <Play className="size-3.5" fill="currentColor" />
          {tx(web3d.cta.live)}
        </a>
      )}
      {withContact && (
        <Link href={route(lang, "contact")} className="inline-flex items-center gap-2 rounded-full border border-paper/40 px-5 py-3 text-sm transition-colors hover:bg-paper hover:text-ink">
          {tx(web3d.cta.contact)}
          <ArrowUpRight className="size-4" />
        </Link>
      )}
    </div>
  );
}

/**
 * Demo en vivo: primero una portada con "Probar la demo" (el sitio externo no se
 * carga ni recibe datos hasta que el visitante lo pide) y luego el proyecto dentro
 * de la página, con enlace para abrirlo en una pestaña nueva.
 */
function LiveDemo({ url }: { url: string }) {
  const lang = useLang();
  const tx = (v: Record<string, string>) => v[lang];
  const [on, setOn] = useState(false);
  return (
    <section id="demo" aria-labelledby="h-demo" className="scroll-mt-24 pb-12 md:pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4 px-1 pb-5 md:px-4">
        <div>
          <h2 id="h-demo" className="display text-3xl md:text-5xl">{tx(web3d.cta.liveTitle)}</h2>
          <p className="mt-2 max-w-xl text-paper/70">{tx(web3d.cta.liveText)}</p>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-paper/70 underline underline-offset-4 hover:text-paper">
          {tx(web3d.cta.newTab)} <ArrowUpRight className="size-4" />
        </a>
      </div>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-ink-soft ring-1 ring-paper/15 sm:aspect-video">
        {on ? (
          <iframe src={url} title={tx(web3d.cta.liveTitle)} allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer" allowFullScreen className="absolute inset-0 size-full" />
        ) : (
          <button type="button" onClick={() => setOn(true)} className="group absolute inset-0 grid place-items-center">
            <Image src={withBase("/media/web3d/banner-web3d.jpg")} alt="" fill sizes="100vw" className="object-cover opacity-60 transition-opacity group-hover:opacity-75" />
            <span className="relative inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3.5 text-sm font-medium text-ink">
              <Play className="size-4" fill="currentColor" />
              {tx(web3d.cta.tryIt)}
            </span>
          </button>
        )}
      </div>
    </section>
  );
}

/**
 * Video explicativo (con sonido: el visitante decide cuándo verlo). Primero la
 * portada (WebP del tamaño justo) con un botón de reproducir; al tocarlo se monta
 * el video y arranca. Así no se descarga nada antes, y se evita que el navegador
 * pinte el <video> vacío como un recuadro gris encima de la portada.
 */
function ExplainerVideo() {
  const lang = useLang();
  const [playing, setPlaying] = useState(false);
  const label = web3d.cta.watch[lang];
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-ink-soft">
      {playing ? (
        <video src={withBase(web3d.video.src)} controls autoPlay playsInline className="absolute inset-0 size-full bg-ink object-contain" />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 grid place-items-center">
          <Image src={withBase(web3d.video.poster)} alt="" fill sizes="100vw" className="object-cover" />
          <span aria-hidden className="absolute inset-0 bg-ink/25 transition-colors group-hover:bg-ink/10" />
          <span className="relative inline-flex items-center gap-3 rounded-full bg-paper px-6 py-3.5 text-sm font-medium text-ink shadow-[0_10px_40px_-12px_rgba(0,0,0,.6)]">
            <Play className="size-4" fill="currentColor" />
            {label}
          </span>
        </button>
      )}
    </div>
  );
}

/** true en el navegador y false en el servidor, sin efectos (para el portal del panel). */
const useIsClient = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

/** Ventajas: cuadrícula de tarjetas con clip; cada una crece a un panel con el texto completo. */
function Features() {
  const lang = useLang();
  const tx = (v: Record<string, string>) => v[lang];
  const [open, setOpen] = useState<number | null>(null);
  const isClient = useIsClient();
  const features = web3d.features;

  return (
    <section aria-labelledby="h-ventajas" className="border-t border-paper/15 pt-10 md:pt-14">
      <h2 id="h-ventajas" className="display px-1 text-3xl md:px-4 md:text-5xl">
        {tx(web3d.featuresTitle)}
      </h2>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-12 md:gap-4 lg:grid-cols-3">
        {features.map((f, i) => (
          <li key={f.title.es}>
            <motion.button
              type="button"
              layoutId={`orbital-card-${i}`}
              transition={expandTransition}
              onClick={() => setOpen(i)}
              aria-haspopup="dialog"
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-ink-soft text-left"
            >
              {f.video && <InViewVideo src={f.video} poster={f.poster} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="absolute inset-0" />}
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                <span>
                  <span className="block text-xs tabular-nums text-paper/60">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-1 block text-xl font-medium leading-tight md:text-2xl">{tx(f.title)}</span>
                </span>
                <span className="grid size-9 shrink-0 place-items-center rounded-full ring-1 ring-paper/40 transition-colors group-hover:bg-paper group-hover:text-ink">
                  <Plus className="size-4" />
                  <span className="sr-only">{tx(web3d.cta.more)}</span>
                </span>
              </span>
            </motion.button>
          </li>
        ))}
        {/* tarjeta de texto que completa la cuadrícula */}
        <li className="flex aspect-[4/3] flex-col justify-between rounded-xl p-5 ring-1 ring-paper/15">
          <MonitorSmartphone aria-hidden className="size-8 text-paper/70" />
          <div>
            <h3 className="text-xl font-medium leading-tight md:text-2xl">{tx(web3d.devices.title)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-paper/70">{tx(web3d.devices.text)}</p>
          </div>
        </li>
      </ul>

      {isClient &&
        createPortal(
          <AnimatePresence>
            {open !== null && <FeaturePanel key={open} index={open} feature={features[open]} onClose={() => setOpen(null)} />}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}

/** Panel de una ventaja: crece desde su tarjeta (layoutId). Escape, el botón o tocar afuera lo cierran. */
function FeaturePanel({ index, feature, onClose }: { index: number; feature: Web3dFeature; onClose: () => void }) {
  const lang = useLang();
  const tx = (v: Record<string, string>) => v[lang];
  const panel = useRef<HTMLDivElement>(null);
  useFocusTrap(panel, true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-4 md:p-10" role="dialog" aria-modal="true" aria-labelledby="orbital-panel-title">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />
      <motion.div
        ref={panel}
        layoutId={`orbital-card-${index}`}
        transition={expandTransition}
        className="relative max-h-full w-full max-w-4xl overflow-y-auto overscroll-contain rounded-xl bg-ink text-paper ring-1 ring-paper/15"
      >
        {feature.video && <InViewVideo src={feature.video} poster={feature.poster} sizes="(min-width: 1024px) 896px, 100vw" className="relative aspect-video w-full" />}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.15, duration: 0.3 }} className="p-6 md:p-10">
          <p className="text-sm tabular-nums text-paper/50">{String(index + 1).padStart(2, "0")}</p>
          <h3 id="orbital-panel-title" className="mt-2 text-2xl font-medium leading-tight md:text-4xl">
            {tx(feature.title)}
          </h3>
          <p className="mt-4 max-w-2xl leading-relaxed text-paper/80 md:text-lg">{tx(feature.text)}</p>
        </motion.div>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          className="absolute right-3 top-3 flex h-10 items-center gap-2 rounded-full bg-paper px-4 text-sm font-medium text-ink"
        >
          {tx(web3d.cta.close)} <X className="size-4" />
        </button>
      </motion.div>
    </div>
  );
}

/**
 * Clip en bucle y sin sonido que arranca al verse en pantalla y se pausa al salir
 * (sigue donde iba). preload="none": un clip que nunca se ve no se descarga.
 * El póster es un next/image detrás del video (WebP del tamaño justo, carga diferida).
 * `className` define la posición y el tamaño (p. ej. "relative aspect-video w-full" o "absolute inset-0").
 */
function InViewVideo({ src, poster, sizes, className }: { src: string; poster?: string; sizes: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = setTimeout(() => setReduced(true));
      return () => clearTimeout(id);
    }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.4 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div className={cn("overflow-hidden bg-ink-soft", className)}>
      {poster && <Image src={withBase(poster)} alt="" fill sizes={sizes} className="object-cover" />}
      <video
        ref={ref}
        src={reduced ? undefined : withBase(src)}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        className="absolute inset-0 size-full object-cover"
      />
    </div>
  );
}
