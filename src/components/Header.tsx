"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { mainNav } from "@/content/navigation";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { Logo } from "./Logo";

/**
 * Header mínimo: logo a la izquierda, 4 enlaces a la derecha.
 * - Sticky y blanco: nunca tapa imágenes con degradados ni cambia de estilo.
 * - Móvil: botón "Menú" → panel a pantalla completa (foco atrapado, Escape cierra).
 */
export function Header() {
  const pathname = usePathname();
  const [mobile, setMobile] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, mobile);

  // cerrar el menú al navegar (patrón "ajustar estado durante el render" de React)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobile(false);
  }

  useEffect(() => {
    if (!mobile) return;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobile(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobile]);

  // "Proyectos" (/) también queda activo dentro de /proyectos/…
  const active = (href: string) => (href === "/" ? pathname === "/" || pathname.startsWith("/proyectos") : pathname === href || pathname.startsWith(href + "/"));

  return (
    // sin backdrop-filter: convertiría al panel móvil (position: fixed) en relativo al header
    <header className="sticky top-0 z-50 bg-paper">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Saltar al contenido
      </a>
      <div ref={panelRef} className="shell flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="MIES Group — inicio">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active(item.href) ? "page" : undefined}
                  className={cn("transition-colors hover:text-ink", active(item.href) ? "text-ink" : "text-muted")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="-mr-2 px-2 py-3 md:hidden"
          aria-expanded={mobile}
          aria-controls="menu-movil"
          onClick={() => setMobile((m) => !m)}
        >
          {mobile ? "Cerrar" : "Menú"}
        </button>

        <AnimatePresence>
          {mobile && (
            <motion.nav
              id="menu-movil"
              aria-label="Principal móvil"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 bottom-0 top-16 z-40 bg-paper md:hidden"
            >
              <ul className="shell pt-6">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active(item.href) ? "page" : undefined}
                      className={cn("block py-2 text-4xl font-medium tracking-[-0.03em]", active(item.href) ? "text-ink" : "text-muted")}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
