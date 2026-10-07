"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { withBase } from "@/lib/basePath";
import { createPortal } from "react-dom";
import type { Tour } from "@/content/tours";
import { t } from "@/content/ui";
import { useLang } from "@/lib/useLang";

/**
 * Galería de tours 360° (categoría "Tour virtual 360°"): tarjetas 16:9 con la
 * miniatura del tour. Clic → el tour de 3DVista se abre a pantalla completa
 * dentro del sitio (se puede recorrer, girar y usar en pantalla completa/VR),
 * con un enlace para abrirlo en otra pestaña. El tour solo se carga al abrirlo.
 */
export function TourGallery({ tours }: { tours: Tour[] }) {
  const lang = useLang();
  const ui = t(lang);
  const en = lang === "en";
  const [open, setOpen] = useState<Tour | null>(null);

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
      <ul className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
        {tours.map((tour, i) => (
          <motion.li
            key={tour.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -5% 0px" }}
            transition={{ duration: 0.6, ease: [0.39, 0.14, 0.26, 1], delay: (i % 3) * 0.05 }}
          >
            {/* los recorridos externos que no se pueden mostrar dentro del sitio se abren en otra pestaña */}
            <TourTrigger tour={tour} onOpen={() => setOpen(tour)} label={`${en ? "Open 360° tour" : "Abrir tour 360°"}: ${tour.title}`}>
              <Image
                src={tour.poster.src}
                alt={tour.poster.alt}
                fill
                quality={75}
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(.39,.14,.26,1)] group-hover:scale-[1.04] motion-reduce:transform-none"
              />
              {tour.preview && <TourPreview src={tour.preview} />}
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
              <span className="absolute right-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur">360°</span>
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-paper md:p-5">
                <span className="text-lg font-semibold leading-tight tracking-[-0.02em] md:text-xl">{tour.title}</span>
                <span className="shrink-0 rounded-full border border-paper/50 px-3 py-1.5 text-xs transition-colors group-hover:bg-paper group-hover:text-ink">
                  {en ? "Explore" : "Recorrer"}
                  {tour.external && <span aria-hidden> ↗</span>}
                </span>
              </span>
            </TourTrigger>
          </motion.li>
        ))}
      </ul>

      {open &&
        createPortal(
          <div role="dialog" aria-modal="true" aria-label={open.title} className="fixed inset-0 z-[90] flex flex-col bg-ink">
            <div className="flex h-14 shrink-0 items-center justify-between gap-4 px-[clamp(1rem,3vw,2.5rem)] text-paper">
              <p className="truncate text-sm font-medium md:text-base">
                <span className="mr-2 text-paper/50">360°</span>
                {open.title}
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={open.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden items-center gap-1.5 rounded-full border border-paper/30 px-4 py-2 text-sm transition-colors hover:bg-paper hover:text-ink sm:inline-flex"
                >
                  {en ? "New tab" : "Nueva pestaña"} <ArrowUpRight className="size-4" />
                </a>
                <button
                  type="button"
                  autoFocus
                  onClick={() => setOpen(null)}
                  className="flex h-9 items-center gap-2 rounded-full bg-paper px-4 text-sm font-medium text-ink"
                >
                  {ui.common.close} <X className="size-4" />
                </button>
              </div>
            </div>
            <iframe
              src={open.url}
              title={open.title}
              allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer; autoplay"
              allowFullScreen
              className="min-h-0 w-full flex-1 border-0 bg-ink"
            />
          </div>,
          document.body,
        )}
    </>
  );
}

/** Tarjeta clicable: botón que abre el visor, o enlace a pestaña nueva si el tour es externo. */
function TourTrigger({ tour, onOpen, label, children }: { tour: Tour; onOpen: () => void; label: string; children: ReactNode }) {
  const cls = "group relative block aspect-video w-full overflow-hidden bg-ink-soft text-left";
  return tour.external ? (
    <a href={tour.url} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls}>
      {children}
    </a>
  ) : (
    <button type="button" onClick={onOpen} aria-label={label} className={cls}>
      {children}
    </button>
  );
}

/**
 * Video corto del tour sobre la miniatura (como en la página anterior): arranca solo,
 * sin sonido y en bucle cuando la tarjeta se ve en pantalla, y se pausa al salir.
 * preload="none": un video que nunca se ve no se descarga. La miniatura queda debajo
 * mientras carga. Con "reducir movimiento" no se muestra.
 */
function TourPreview({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={withBase(src)}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      onPlaying={() => setPlaying(true)}
      className="absolute inset-0 size-full object-cover transition-opacity duration-700 motion-reduce:hidden"
      style={{ opacity: playing ? 1 : 0 }}
    />
  );
}
