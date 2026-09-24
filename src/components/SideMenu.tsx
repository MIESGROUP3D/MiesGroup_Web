"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { expandTransition } from "@/lib/motion";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { mainNav } from "@/content/navigation";
import { sortedProjects } from "@/content/projects";
import { services } from "@/content/services";
import { site, whatsappHref } from "@/content/site";
import type { MediaImage } from "@/content/types";

/** Imagen que se muestra en el panel al pasar por cada enlace. */
const previews: Record<string, MediaImage> = {
  "/": sortedProjects[0].cover,
  "/servicios": services[1].cover,
  "/estudio": site.hero.poster,
  "/contacto": sortedProjects[sortedProjects.length - 1].cover,
};

/** Minuto actual (se re-lee cada 15 s). null en el servidor: evita desfases de hidratación. */
const subscribeMinute = (cb: () => void) => {
  const id = setInterval(cb, 15_000);
  return () => clearInterval(id);
};
const useMinute = () => useSyncExternalStore(subscribeMinute, () => Math.floor(Date.now() / 60_000), () => null);

/**
 * Menú en pestaña lateral (borde derecho).
 *
 * - Cerrado: pestaña negra con ícono + "Menú". Al pasar el mouse el panel
 *   asoma unos milímetros (invita a abrirlo).
 * - Abierto: el panel entra arrastrando la pestaña (ícono → ✕); la página se
 *   corre un poco y se oscurece.
 * - Panel: vista previa que cambia con el enlace señalado, 4 enlaces
 *   numerados, contacto y hora local de las 3 sedes.
 * - Accesible: aria-expanded, foco atrapado, Escape y clic fuera cierran; el
 *   panel cerrado es `inert`.
 *
 * Envuelve al contenido de la página (`children`) para poder desplazarlo.
 * Lo que es `position: fixed` (modales, WhatsApp) va FUERA de este componente:
 * el transform del desplazamiento los volvería relativos al contenedor.
 */
export function SideMenu({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const minute = useMinute();
  useFocusTrap(menuRef, open);

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
  const current = mainNav.find((i) => active(i.href))?.href ?? "/";
  const preview = previews[hovered ?? current];
  const time = (timeZone: string) =>
    minute === null ? "--:--" : new Intl.DateTimeFormat("es-CO", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone }).format(minute * 60_000);

  return (
    <>
      {/* Contenido: se corre un poco a la izquierda con el menú abierto.
          Sin transform cuando está cerrado (no crea bloque contenedor). */}
      <div
        className="transition-transform duration-500 ease-[cubic-bezier(.39,.14,.26,1)] motion-reduce:transition-none"
        style={open ? { transform: "translateX(-3rem)" } : undefined}
      >
        {children}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            aria-hidden
            className="fixed inset-0 z-[55] bg-ink/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Pestaña + panel se mueven juntos. Cerrado, solo asoma la pestaña (--tab). */}
      <div
        ref={menuRef}
        className={cn(
          "pointer-events-none fixed inset-y-0 right-0 z-[60] flex items-center [--tab:2rem] md:[--tab:2.5rem]",
          "transition-transform duration-500 ease-[cubic-bezier(.39,.14,.26,1)] motion-reduce:transition-none",
          open ? "translate-x-0" : "translate-x-[calc(100%-var(--tab))] hover:translate-x-[calc(100%-var(--tab)-0.75rem)]",
        )}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls="menu-lateral"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((o) => !o)}
          className="pointer-events-auto flex h-36 w-[var(--tab)] shrink-0 flex-col items-center justify-center gap-4 bg-ink text-paper md:h-40"
        >
          {/* dos líneas que se cruzan en ✕ */}
          <span aria-hidden className="relative block h-3 w-3.5">
            <span className={cn("absolute left-0 h-px w-full bg-current transition-all duration-500", open ? "top-1/2 rotate-45" : "top-0.5")} />
            <span className={cn("absolute left-0 h-px w-full bg-current transition-all duration-500", open ? "top-1/2 -rotate-45" : "bottom-0.5")} />
          </span>
          <span aria-hidden className="rotate-180 text-xs tracking-[0.08em] [writing-mode:vertical-rl] md:text-sm">
            {open ? "Cerrar" : "Menú"}
          </span>
        </button>

        <nav
          id="menu-lateral"
          aria-label="Principal"
          inert={!open}
          className="pointer-events-auto flex h-full w-[min(30rem,calc(100vw-var(--tab)))] flex-col overflow-y-auto bg-ink px-6 py-6 text-paper md:px-8 md:py-8"
        >
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold tracking-[-0.02em]">
              mies<span className="font-normal">group</span>
            </span>
            <span className="text-paper/50">Est. {site.foundedYear}</span>
          </div>

          {/* Vista previa: cambia con el enlace señalado */}
          <motion.div
            className="relative mt-6 aspect-[16/10] shrink-0 overflow-hidden bg-paper/10"
            initial={false}
            animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.96 }}
            transition={{ ...expandTransition, delay: open ? 0.1 : 0 }}
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={preview.src}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.39, 0.14, 0.26, 1] }}
              >
                <Image src={preview.src} alt="" fill quality={70} sizes="30rem" className="object-cover" />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <ul className="mt-8" onPointerLeave={() => setHovered(null)}>
            {mainNav.map((item, i) => {
              const isActive = active(item.href);
              return (
                <li key={item.href} className="overflow-hidden border-b border-paper/15">
                  <motion.div
                    initial={false}
                    animate={open ? { y: "0%", opacity: 1 } : { y: "70%", opacity: 0 }}
                    transition={{ ...expandTransition, delay: open ? 0.15 + i * 0.05 : 0 }}
                  >
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      onPointerEnter={() => setHovered(item.href)}
                      onFocus={() => setHovered(item.href)}
                      className="group flex items-baseline gap-4 py-2.5"
                    >
                      <span className={cn("w-6 text-xs tabular-nums", isActive ? "text-paper" : "text-paper/40")}>{String(i + 1).padStart(2, "0")}</span>
                      <span
                        className={cn(
                          "text-4xl font-medium tracking-[-0.035em] transition-[color,transform] duration-500 ease-[cubic-bezier(.39,.14,.26,1)] group-hover:translate-x-2 group-focus-visible:translate-x-2 md:text-5xl",
                          isActive ? "text-paper" : "text-paper/45 group-hover:text-paper group-focus-visible:text-paper",
                        )}
                      >
                        {item.label}
                      </span>
                      <span aria-hidden className="ml-auto -translate-x-2 text-xl opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
                        →
                      </span>
                      {isActive && <span className="sr-only">(página actual)</span>}
                    </Link>
                  </motion.div>
                </li>
              );
            })}
          </ul>

          <motion.div
            className="mt-auto pt-10 text-sm"
            initial={false}
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: 0.4, delay: open ? 0.4 : 0 }}
          >
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <a href={`mailto:${site.email}`} className="hover:underline hover:underline-offset-4">{site.email}</a>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="hover:underline hover:underline-offset-4">WhatsApp</a>
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline hover:underline-offset-4">Instagram</a>
            </div>
            {/* Hora local de cada sede */}
            <ul className="mt-5 grid grid-cols-3 gap-3 border-t border-paper/15 pt-4">
              {site.locations.map((l) => (
                <li key={l.code}>
                  <span className="block text-paper/50">{l.city}</span>
                  <time className="block tabular-nums">{time(l.timeZone)}</time>
                </li>
              ))}
            </ul>
          </motion.div>
        </nav>
      </div>
    </>
  );
}
