"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { navigateWithCurtain, useCurtain } from "@/lib/curtain";
import { expandTransition } from "@/lib/motion";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { mainNav } from "@/content/navigation";
import { site, siteText, whatsappHref } from "@/content/site";
import { t } from "@/content/ui";
import { route } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";

/**
 * Menú lateral — versión funcional.
 *
 * - Botón "Menú" arriba a la derecha, siempre visible y legible (texto
 *   horizontal + ícono). Abierto, el mismo botón dice "Cerrar". No aparece en
 *   el inicio (el acordeón ya es la navegación).
 * - Panel negro desde la derecha, lo mínimo: logo arriba y, apoyados abajo,
 *   los títulos (la sección actual en blanco, las demás en gris), una línea
 *   fina y el contacto: WhatsApp y correo.
 * - Al elegir una sección: cortina negra que nace del panel (PageCurtain).
 * - Accesible: aria-expanded, foco atrapado, Escape y clic fuera cierran; el
 *   panel cerrado es `inert`.
 */
export function SideMenu() {
  const pathname = usePathname();
  const lang = useLang();
  const ui = t(lang);
  // ruta sin barra final (trailingSlash) para comparar
  const path = pathname.replace(/\/$/, "") || "/";
  const curtain = useCurtain();
  const [open, setOpen] = useState(false);
  // true = el menú se cerró DEBAJO de la cortina: sin animación de salida, para que no
  // se vea el panel saliendo cuando la cortina descubre el lado derecho
  const [snap, setSnap] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  useFocusTrap(menuRef, open);
  const close = () => setOpen(false);

  // (patrón "ajustar estado durante el render" de React, con estado propio)
  // - al cambiar de página: cerrar el menú
  // - cortina ya cubriendo la pantalla: cerrar el menú al instante (no se ve)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  if (open && curtain?.phase === "wait") {
    setSnap(true);
    setOpen(false);
  }

  /** Elegir una sección: cortina negra naciendo del panel (salvo la página actual). */
  const navigate = (e: React.MouseEvent, href: string) => {
    const here = (pathname.replace(/\/$/, "") || "/") === href;
    if (here || !navigateWithCurtain(e, href, panelRef.current)) close();
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

  // sección activa; /proyectos también cubre /proyectos/<slug>
  const home = route(lang, "home");
  const active = (href: string) => (href === home ? path === home : path === href || path.startsWith(href + "/"));
  const onHome = path === home;
  // entrada escalonada de los bloques del panel
  const reveal = (i: number) => ({
    initial: false as const,
    animate: open ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: { ...expandTransition, delay: open ? 0.12 + i * 0.05 : 0 },
  });

  return (
    <>
      {/* En el inicio (acordeón a pantalla completa) no hay botón ni panel;
          la cortina de abajo sí se mantiene para terminar la transición al llegar */}
      {!onHome && (
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
            {/* botón Menú arriba a la derecha (el idioma va abajo, sobre WhatsApp) */}
            <div className="fixed right-[clamp(1rem,3vw,2.5rem)] top-3 z-[65] flex items-center gap-2">
            <button
              type="button"
              aria-expanded={open}
              aria-controls="menu-lateral"
              onClick={() => {
                setSnap(false);
                setOpen((o) => !o);
              }}
              // borde claro: sigue visible cuando pasa sobre la sección negra de la home
              className="flex h-10 items-center gap-2.5 bg-ink px-4 text-sm text-paper ring-1 ring-paper/25 transition-colors hover:bg-ink-soft"
            >
              {/* dos líneas que se cruzan en ✕ */}
              <span aria-hidden className="relative block h-2.5 w-3.5">
                <span className={cn("absolute left-0 h-px w-full bg-current", !snap && "transition-all duration-500", open ? "top-1/2 rotate-45" : "top-0")} />
                <span className={cn("absolute left-0 h-px w-full bg-current", !snap && "transition-all duration-500", open ? "top-1/2 -rotate-45" : "bottom-0")} />
              </span>
              {open ? ui.common.close : ui.common.menu}
            </button>
            </div>
    
            <nav
              ref={panelRef}
              id="menu-lateral"
              aria-label={lang === "en" ? "Main" : "Principal"}
              inert={!open}
              className={cn(
                "fixed inset-y-0 right-0 z-[60] scroll-dark flex w-[min(26rem,100vw)] flex-col overflow-y-auto bg-ink px-6 pb-6 text-paper md:px-8 md:pb-8",
                !snap && "transition-transform duration-500 ease-[cubic-bezier(.39,.14,.26,1)] motion-reduce:transition-none",
                open ? "translate-x-0" : "translate-x-full",
              )}
            >
              {/* logo a la altura del botón Cerrar (misma fila que el header del sitio) */}
              <div className="flex h-16 shrink-0 items-center">
                <Link href={home} onClick={(e) => navigate(e, home)} aria-label={ui.common.homeAria}>
                  <Logo />
                </Link>
              </div>
    
              {/* títulos apoyados abajo, sobre el contacto: aire arriba y todo al alcance del pulgar */}
              <ul className="mt-auto space-y-1 pt-10">
                {mainNav.map((key, i) => {
                  const href = route(lang, key);
                  const isActive = active(href);
                  return (
                    <motion.li key={key} {...reveal(i)}>
                      <Link
                        href={href}
                        aria-current={isActive ? "page" : undefined}
                        onClick={(e) => navigate(e, href)}
                        className={cn(
                          "block py-1.5 text-4xl font-medium tracking-[-0.035em] transition-colors",
                          isActive ? "text-paper" : "text-paper/45 hover:text-paper",
                        )}
                      >
                        {ui.nav[key]}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
    
              <motion.div className="mt-6 border-t border-paper/15 pt-6 text-sm" {...reveal(mainNav.length)}>
                <a
                  href={whatsappHref(siteText(lang).whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-paper px-4 py-3 font-medium text-ink transition-colors hover:bg-paper/85"
                >
                  {ui.common.whatsappCta} <span aria-hidden>→</span>
                </a>
                <a href={`mailto:${site.email}`} className="mt-4 block text-paper/70 hover:text-paper">
                  {site.email}
                </a>
                {/* idioma: fuera del inicio vive aquí (en el inicio va abajo a la derecha, sobre WhatsApp) */}
                <div className="mt-5 flex items-center justify-between border-t border-paper/15 pt-4">
                  <span className="text-paper/60">{ui.lang.label}</span>
                  <LangSwitch />
                </div>
              </motion.div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
