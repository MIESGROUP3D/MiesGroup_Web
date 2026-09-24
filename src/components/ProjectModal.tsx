"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { setOpenProject } from "@/lib/motion";

/**
 * Proyecto abierto sobre la grilla (patrón App Store de iOS, ref. motion.dev).
 *
 * - Se monta desde la ruta interceptada app/@modal/(.)proyectos/[slug]: la URL
 *   es /proyectos/<slug> (compartible). Entrando directo a esa URL se ve la
 *   página completa, sin modal.
 * - La portada comparte `layoutId` con la tarjeta: crece desde la grilla.
 *   El fondo blanco y el resto del contenido aparecen alrededor.
 * - Cerrar (botón, Escape o "atrás"): el contenido se desvanece, la tarjeta
 *   vuelve a su sitio y recién ahí se hace router.back().
 */
export function ProjectModal({ slug, children }: { slug: string; children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, open);

  // la tarjeta de la grilla se oculta mientras su portada vive aquí
  useEffect(() => {
    setOpenProject(slug);
    scrollRef.current?.scrollTo({ top: 0 });
    return () => setOpenProject(null);
  }, [slug]);

  /*
   * Cierre en dos pasos: 1) `closing` desvanece el contenido y devuelve la
   * tarjeta a la grilla; 2) un frame después se desmonta (AnimatePresence
   * conserva el último render, así que `closing` tiene que pintarse antes).
   */
  const [closing, setClosing] = useState(false);
  const close = () => {
    setOpenProject(null);
    setClosing(true);
  };
  useEffect(() => {
    if (!closing) return;
    const id = requestAnimationFrame(() => setOpen(false));
    return () => cancelAnimationFrame(id);
  }, [closing]);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("[data-close]")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenProject(null);
        setClosing(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <AnimatePresence onExitComplete={() => router.back()}>
      {open && (
        <motion.div
          key="modal"
          ref={scrollRef}
          className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain"
          // se anima el color (no la opacidad) para no desvanecer la portada que vuela
          initial={{ backgroundColor: "rgba(255,255,255,0)" }}
          animate={{ backgroundColor: "rgba(255,255,255,1)" }}
          exit={{ backgroundColor: "rgba(255,255,255,0)" }}
          transition={{ duration: 0.35 }}
        >
          <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={`titulo-${slug}`} className="modal-panel shell max-w-6xl pb-16" data-closing={closing ? "" : undefined}>
            <div data-fade className="sticky top-0 z-10 -mx-2 flex justify-end bg-paper/90 py-3">
              <button type="button" data-close onClick={close} className="px-2 py-1 text-muted hover:text-ink">
                Cerrar ✕
              </button>
            </div>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
