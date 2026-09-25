"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { setOpenProject, useOpenProject } from "@/lib/motion";
import { getProjectIn } from "@/content/projects";
import { t } from "@/content/ui";
import { useLang } from "@/lib/useLang";
import { ProjectDetail } from "./ProjectDetail";

/**
 * Proyecto abierto sobre la página (patrón App Store de iOS, ref. motion.dev).
 * Hay uno solo, montado en el layout; lo abre cualquier ProjectLink.
 *
 * - MOCKUP estático (GitHub Pages): el modal NO cambia la URL (las rutas
 *   interceptadas necesitan servidor). /proyectos/<slug>/ sigue existiendo
 *   como página completa para enlaces directos.
 * - La portada comparte `layoutId` con la tarjeta: crece desde la grilla.
 * - Cerrar (botón o Escape): el contenido se desvanece y la tarjeta vuelve a
 *   su sitio.
 */
export function ProjectModal() {
  const requested = useOpenProject();
  const [shown, setShown] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, shown !== null);

  // abrir o pasar a otro proyecto ("Siguiente"): adoptar el pedido durante el render
  if (requested && requested !== shown && !closing) setShown(requested);

  /*
   * Cierre en dos pasos: 1) `closing` desvanece el contenido y la tarjeta
   * reaparece para volver a la grilla; 2) un frame después se desmonta
   * (AnimatePresence conserva el último render, así que `closing` debe pintarse antes).
   */
  const close = () => {
    setOpenProject(null);
    setClosing(true);
  };
  useEffect(() => {
    if (!closing) return;
    const id = requestAnimationFrame(() => setShown(null));
    return () => cancelAnimationFrame(id);
  }, [closing]);

  useEffect(() => {
    if (!shown) return;
    scrollRef.current?.scrollTo({ top: 0 });
  }, [shown]);

  const isOpen = shown !== null;
  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen]);

  const lang = useLang();
  const project = shown ? getProjectIn(shown, lang) : undefined;

  return (
    <AnimatePresence onExitComplete={() => setClosing(false)}>
      {project && (
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
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`titulo-${project.slug}`}
            className="modal-panel"
            data-closing={closing ? "" : undefined}
          >
            {/* Cerrar: píldora oscura fija arriba a la derecha, visible sobre la portada */}
            <button
              type="button"
              data-close
              data-fade
              onClick={close}
              className="fixed right-[clamp(1rem,3vw,2.5rem)] top-3 z-10 flex h-10 items-center gap-2 bg-ink px-4 text-sm text-paper ring-1 ring-paper/25 transition-colors hover:bg-ink-soft"
            >
              {t(lang).common.close} <span aria-hidden>✕</span>
            </button>
            <ProjectDetail key={project.slug} project={project} lang={lang} inModal />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
