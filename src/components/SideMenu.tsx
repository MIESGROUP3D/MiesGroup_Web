"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { expandTransition } from "@/lib/motion";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { mainNav } from "@/content/navigation";
import { site, whatsappHref } from "@/content/site";
import { Logo } from "./Logo";

/**
 * Menú lateral — versión funcional.
 *
 * - Botón "Menú" arriba a la derecha, siempre visible y legible (texto
 *   horizontal + ícono). Abierto, el mismo botón dice "Cerrar".
 * - Panel negro desde la derecha, lo mínimo: logo arriba y, apoyados abajo,
 *   los 4 títulos (la sección actual en blanco, las demás en gris), una línea
 *   fina y el contacto: WhatsApp y correo.
 * - Accesible: aria-expanded, foco atrapado, Escape y clic fuera cierran; el
 *   panel cerrado es `inert`.
 */
export function SideMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useFocusTrap(menuRef, open);
  const close = () => setOpen(false);

  // cerrar al navegar (patrón "ajustar estado durante el render" de React)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // "Proyectos" (/) también queda activo dentro de /proyectos/…
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
            transition={{ duration: 0.35 }}
            onClick={close}
          />
        )}
      </AnimatePresence>

      <div ref={menuRef}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="menu-lateral"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "fixed right-[clamp(1rem,3vw,2.5rem)] top-3 z-[65] flex h-10 items-center gap-2.5 bg-ink px-4 text-sm text-paper transition-colors hover:bg-ink-soft",
            open && "ring-1 ring-paper/25",
          )}
        >
          {/* dos líneas que se cruzan en ✕ */}
          <span aria-hidden className="relative block h-2.5 w-3.5">
            <span className={cn("absolute left-0 h-px w-full bg-current transition-all duration-500", open ? "top-1/2 rotate-45" : "top-0")} />
            <span className={cn("absolute left-0 h-px w-full bg-current transition-all duration-500", open ? "top-1/2 -rotate-45" : "bottom-0")} />
          </span>
          {open ? "Cerrar" : "Menú"}
        </button>

        <nav
          id="menu-lateral"
          aria-label="Principal"
          inert={!open}
          className={cn(
            "fixed inset-y-0 right-0 z-[60] flex w-[min(26rem,100vw)] flex-col overflow-y-auto bg-ink px-6 pb-6 text-paper md:px-8 md:pb-8",
            "transition-transform duration-500 ease-[cubic-bezier(.39,.14,.26,1)] motion-reduce:transition-none",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          {/* logo a la altura del botón Cerrar (misma fila que el header del sitio) */}
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/" onClick={close} aria-label="MIES Group — inicio">
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
                    onClick={close}
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
    </>
  );
}
