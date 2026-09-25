"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { expandTransition } from "@/lib/motion";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { mainNav } from "@/content/navigation";
import { site, whatsappHref } from "@/content/site";
import { Logo } from "./Logo";

/**
 * Cortina de transición: start (del ancho del panel) → cover (pantalla completa)
 * → wait (se navega por detrás) → reveal (se retira hacia la izquierda).
 * `from`: ancho del panel como fracción de la pantalla (escala inicial).
 */
type Curtain = { phase: "start" | "cover" | "wait" | "reveal"; href: string; from: number };
const CURTAIN_EASE = "cubic-bezier(.39,.14,.26,1)";

/**
 * Menú lateral — versión funcional.
 *
 * - Botón "Menú" arriba a la derecha, siempre visible y legible (texto
 *   horizontal + ícono). Abierto, el mismo botón dice "Cerrar".
 * - Panel negro desde la derecha, lo mínimo: logo arriba y, apoyados abajo,
 *   los 4 títulos (la sección actual en blanco, las demás en gris), una línea
 *   fina y el contacto: WhatsApp y correo.
 * - Al elegir una sección: transición "cortina negra" (ver `navigate`).
 * - Accesible: aria-expanded, foco atrapado, Escape y clic fuera cierran; el
 *   panel cerrado es `inert`.
 */
export function SideMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  // true = el menú se cerró DEBAJO de la cortina: sin animación de salida, para que no
  // se vea el panel saliendo cuando la cortina descubre el lado derecho
  const [snap, setSnap] = useState(false);
  const [curtain, setCurtain] = useState<Curtain | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  useFocusTrap(menuRef, open);
  const close = () => setOpen(false);

  // al cambiar de página: cerrar el menú y, si la cortina estaba esperando, retirarla
  // (patrón "ajustar estado durante el render" de React)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    if (curtain?.phase === "wait") setCurtain({ ...curtain, phase: "reveal" });
  }

  useEffect(() => {
    // start → cover: dos frames para que el navegador pinte la escala inicial
    // antes de arrancar la transición CSS
    if (curtain?.phase === "start") {
      let id = requestAnimationFrame(() => {
        id = requestAnimationFrame(() => setCurtain((c) => (c ? { ...c, phase: "cover" } : c)));
      });
      return () => cancelAnimationFrame(id);
    }
    // respaldo: si la página nueva tarda, la cortina se retira igual a los 3 s
    if (curtain?.phase === "wait") {
      const id = setTimeout(() => setCurtain((c) => (c ? { ...c, phase: "reveal" } : c)), 3000);
      return () => clearTimeout(id);
    }
  }, [curtain?.phase]);

  /**
   * Transición "cortina negra" al elegir una sección del menú:
   * 1) el panel se expande hasta cubrir la pantalla, 2) se navega por detrás,
   * 3) la cortina se retira hacia la izquierda. Sin cortina si es la página
   * actual, si se abre en otra pestaña o con movimiento reducido.
   */
  const navigate = (e: React.MouseEvent, href: string) => {
    const here = (pathname.replace(/\/$/, "") || "/") === href;
    if (here || reduce || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      close();
      return;
    }
    e.preventDefault();
    setCurtain({ phase: "start", href, from: (panelRef.current?.offsetWidth ?? 0) / window.innerWidth });
  };
  const onCurtainDone = () => {
    if (!curtain) return;
    if (curtain.phase === "cover") {
      // pantalla cubierta: cerrar el menú al instante (no se ve) y cambiar de página
      setSnap(true);
      setOpen(false);
      setCurtain({ ...curtain, phase: "wait" });
      // subir al inicio YA, tapado por la cortina (con scroll-behavior: smooth, la subida
      // de Next se animaría y se vería al retirarse la cortina)
      window.scrollTo({ top: 0, behavior: "instant" });
      router.push(curtain.href, { scroll: false });
    } else if (curtain.phase === "reveal") {
      setCurtain(null);
    }
  };

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    // el espacio reservado de la barra de scroll (scrollbar-gutter) toma el fondo de
    // <html>: en negro empalma con el panel en vez de verse una franja blanca
    root.style.background = "var(--color-ink)";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      root.style.background = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // "Inicio" (/) también queda activo dentro de /proyectos/… (el portafolio vive en la home)
  const active = (href: string) => (href === "/" ? pathname === "/" || pathname.startsWith("/proyectos") : pathname === href || pathname.startsWith(href + "/"));
  // entrada escalonada de los bloques del panel
  const reveal = (i: number) => ({
    initial: false as const,
    animate: open ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: { ...expandTransition, delay: open ? 0.12 + i * 0.05 : 0 },
  });

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            aria-hidden
            className="fixed inset-0 z-[55] bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: snap ? 0 : 0.35 }}
            onClick={close}
          />
        )}
      </AnimatePresence>

      <div ref={menuRef}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="menu-lateral"
          onClick={() => {
            setSnap(false);
            setOpen((o) => !o);
          }}
          // borde claro: sigue visible cuando pasa sobre la sección negra de la home
          className="fixed right-[clamp(1rem,3vw,2.5rem)] top-3 z-[65] flex h-10 items-center gap-2.5 bg-ink px-4 text-sm text-paper ring-1 ring-paper/25 transition-colors hover:bg-ink-soft"
        >
          {/* dos líneas que se cruzan en ✕ */}
          <span aria-hidden className="relative block h-2.5 w-3.5">
            <span className={cn("absolute left-0 h-px w-full bg-current", !snap && "transition-all duration-500", open ? "top-1/2 rotate-45" : "top-0")} />
            <span className={cn("absolute left-0 h-px w-full bg-current", !snap && "transition-all duration-500", open ? "top-1/2 -rotate-45" : "bottom-0")} />
          </span>
          {open ? "Cerrar" : "Menú"}
        </button>

        <nav
          ref={panelRef}
          id="menu-lateral"
          aria-label="Principal"
          inert={!open}
          className={cn(
            "fixed inset-y-0 right-0 z-[60] scroll-dark flex w-[min(26rem,100vw)] flex-col overflow-y-auto bg-ink px-6 pb-6 text-paper md:px-8 md:pb-8",
            !snap && "transition-transform duration-500 ease-[cubic-bezier(.39,.14,.26,1)] motion-reduce:transition-none",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          {/* logo a la altura del botón Cerrar (misma fila que el header del sitio) */}
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/" onClick={(e) => navigate(e, "/")} aria-label="MIES Group — inicio">
              <Logo />
            </Link>
          </div>

          {/* títulos apoyados abajo, sobre el contacto: aire arriba y todo al alcance del pulgar */}
          <ul className="mt-auto space-y-1 pt-10">
            {mainNav.map((item, i) => {
              const isActive = active(item.href);
              return (
                <motion.li key={item.href} {...reveal(i)}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e) => navigate(e, item.href)}
                    className={cn(
                      "block py-1.5 text-4xl font-medium tracking-[-0.035em] transition-colors",
                      isActive ? "text-paper" : "text-paper/45 hover:text-paper",
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              );
            })}
          </ul>

          <motion.div className="mt-6 border-t border-paper/15 pt-6 text-sm" {...reveal(mainNav.length)}>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-paper px-4 py-3 font-medium text-ink transition-colors hover:bg-paper/85"
            >
              Escríbenos por WhatsApp <span aria-hidden>→</span>
            </a>
            <a href={`mailto:${site.email}`} className="mt-4 block text-paper/70 hover:text-paper">
              {site.email}
            </a>
          </motion.div>
        </nav>
      </div>

      {/* Cortina de transición entre secciones: nace del ancho del panel,
          cubre la pantalla y se retira hacia la izquierda.
          Solo `transform` con transición CSS: la anima la GPU (compositor), así
          no se traba aunque React esté ocupado armando la página nueva. */}
      {curtain && (
        <div
          aria-hidden
          className="fixed inset-0 z-[90] origin-right bg-ink will-change-transform"
          style={{
            transform: curtain.phase === "start" ? `scaleX(${curtain.from})` : curtain.phase === "reveal" ? "translateX(-100%)" : "none",
            // bloquea clics mientras cubre; al retirarse ya no estorba
            pointerEvents: curtain.phase === "reveal" ? "none" : "auto",
            transition:
              curtain.phase === "start" || curtain.phase === "wait"
                ? "none"
                : curtain.phase === "reveal"
                  ? `transform 650ms ${CURTAIN_EASE} 60ms`
                  : `transform 450ms ${CURTAIN_EASE}`,
          }}
          onTransitionEnd={(e) => e.target === e.currentTarget && onCurtainDone()}
        />
      )}
    </>
  );
}
