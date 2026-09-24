"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { expandTransition } from "@/lib/motion";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { whatsappHref } from "@/content/site";
import type { Service } from "@/content/types";

/*
 * El servicio abierto vive en el hash (#web3d): un enlace a /servicios/#<slug>
 * llega con el modal ya abierto (útil para compartir un servicio).
 * replaceState en vez de location.hash: no salta el scroll ni ensucia el historial.
 */
const HASH_EVENT = "servicios:hash";
const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  window.addEventListener(HASH_EVENT, cb);
  return () => {
    window.removeEventListener("hashchange", cb);
    window.removeEventListener(HASH_EVENT, cb);
  };
};
const readHash = () => decodeURIComponent(window.location.hash.slice(1));

function setHash(slug: string | null) {
  const { pathname, search } = window.location;
  window.history.replaceState(window.history.state, "", slug ? `${pathname}${search}#${slug}` : `${pathname}${search}`);
  window.dispatchEvent(new Event(HASH_EVENT));
}
const closeService = () => setHash(null);

/**
 * Servicios en grilla compacta (imagen + nombre). Al hacer clic, la tarjeta se
 * expande en un modal con el detalle (referencia: motion.dev modal-shared-layout).
 * Tarjeta y modal comparten `layoutId` en el contenedor, la imagen y el título.
 */
export function ServiceGrid({ services, counts }: { services: Service[]; counts: Record<string, number> }) {
  const hash = useSyncExternalStore(subscribe, readHash, () => "");
  const selected = services.find((s) => s.slug === hash) ?? null;

  return (
    <>
      <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <li key={s.slug} id={s.slug} className="scroll-mt-20">
            <ServiceCard service={s} index={i} hidden={selected?.slug === s.slug} onOpen={() => setHash(s.slug)} />
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {selected && <ServiceModal key={selected.slug} service={selected} index={services.indexOf(selected)} count={counts[selected.slug] ?? 0} onClose={closeService} />}
      </AnimatePresence>
    </>
  );
}

function ServiceCard({ service: s, index, hidden, onOpen }: { service: Service; index: number; hidden: boolean; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={ref}
      layoutId={`svc-${s.slug}`}
      transition={expandTransition}
      // al volver del modal pasa por encima del fondo que se desvanece
      onLayoutAnimationStart={() => ref.current && (ref.current.style.zIndex = "80")}
      onLayoutAnimationComplete={() => ref.current && (ref.current.style.zIndex = "")}
      className="relative bg-paper"
      style={{ visibility: hidden ? "hidden" : "visible" }}
    >
      <button type="button" onClick={onOpen} className="group block w-full text-left" aria-haspopup="dialog">
        <motion.div layoutId={`svc-img-${s.slug}`} transition={expandTransition} className="relative aspect-[3/2] bg-paper-2">
          <Image src={s.cover.src} alt={s.cover.alt} fill quality={75} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-opacity duration-500 group-hover:opacity-90" />
        </motion.div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-muted">{String(index + 1).padStart(2, "0")}</span>
          <motion.h2 layoutId={`svc-title-${s.slug}`} transition={expandTransition} className="font-medium group-hover:underline group-hover:underline-offset-4">
            {s.name}
          </motion.h2>
        </div>
      </button>
    </motion.div>
  );
}

function ServiceModal({ service: s, index, count, onClose }: { service: Service; index: number; count: number; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, true);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("[data-close]")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70]">
      <motion.div
        className="absolute inset-0 bg-ink/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />
      <div className="pointer-events-none absolute inset-0 grid place-items-center p-4">
        <motion.div
          ref={panelRef}
          layoutId={`svc-${s.slug}`}
          transition={expandTransition}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`svc-titulo-${s.slug}`}
          className="pointer-events-auto relative max-h-[90svh] w-full max-w-3xl overflow-y-auto bg-paper"
        >
          <motion.div layoutId={`svc-img-${s.slug}`} transition={expandTransition} className="relative aspect-[3/2] bg-paper-2">
            <Image src={s.cover.src} alt={s.cover.alt} fill quality={80} sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </motion.div>

          <div className="p-6 md:p-8">
            <div className="flex items-baseline gap-3">
              <span className="text-muted">{String(index + 1).padStart(2, "0")}</span>
              <motion.h2 id={`svc-titulo-${s.slug}`} layoutId={`svc-title-${s.slug}`} transition={expandTransition} className="display text-2xl md:text-3xl">
                {s.name}
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.4 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              <p className="mt-4 text-lg">{s.tagline}</p>
              <p className="mt-3 text-ink-soft">{s.body[0]}</p>
              <ul className="mt-6 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                {s.deliverables.map((d) => (
                  <li key={d} className="border-t border-line py-2">{d}</li>
                ))}
              </ul>
              <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                {count > 0 && (
                  <Link href={`/?servicio=${s.slug}`} className="underline underline-offset-4 hover:no-underline">
                    Ver {count} {count === 1 ? "proyecto" : "proyectos"} →
                  </Link>
                )}
                <a href={whatsappHref(`Hola MIES Group, me interesa el servicio de ${s.name}.`)} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ink">
                  Cotizar por WhatsApp
                </a>
              </p>
            </motion.div>
          </div>

          <button type="button" data-close onClick={onClose} className="absolute right-3 top-3 bg-paper px-3 py-1.5 text-sm hover:underline">
            Cerrar ✕
          </button>
        </motion.div>
      </div>
    </div>
  );
}
