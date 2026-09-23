"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { isGroup, mainNav, type NavLink } from "@/content/navigation";
import { Logo } from "./Logo";

/**
 * Header
 * - Transparente sobre el hero; fondo sólido con blur al hacer scroll.
 * - Se oculta al bajar y reaparece al subir (más espacio para los renders).
 * - Mega-menú de servicios con miniatura (escritorio), acordeón (móvil).
 * - Accesible: aria-expanded, Escape cierra, navegación por teclado.
 */
export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 240 && y > prev && !open && !mobile);
  });

  // cerrar menús al navegar (patrón "ajustar estado durante el render" de React)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
    setMobile(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(label);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 160);
  };

  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const solid = scrolled || open !== null || mobile;

  return (
    <>
    <motion.header
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        solid ? "border-b border-line bg-ink/85 backdrop-blur-xl" : "bg-gradient-to-b from-ink/70 to-transparent",
      )}
    >
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-bone focus:px-4 focus:py-2 focus:text-ink">
        Saltar al contenido
      </a>
      <div className="shell flex h-18 items-center justify-between gap-6 md:h-20">
        <Link href="/" aria-label="MIES Group — inicio" className="shrink-0">
          <Logo />
        </Link>

        {/* Escritorio */}
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) =>
              isGroup(item) ? (
                <li key={item.label} onMouseEnter={() => openMenu(item.label)} onMouseLeave={scheduleClose}>
                  <button
                    type="button"
                    aria-expanded={open === item.label}
                    aria-controls={`menu-${item.label}`}
                    onClick={() => setOpen(open === item.label ? null : item.label)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 text-[0.8rem] font-medium uppercase tracking-[0.14em] transition-colors hover:text-bronze",
                      item.children.some((c) => active(c.href)) && "text-bronze",
                    )}
                  >
                    {item.label}
                    <ChevronDown className={cn("size-3.5 transition-transform duration-300", open === item.label && "rotate-180")} />
                  </button>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active(item.href) ? "page" : undefined}
                    className={cn(
                      "px-4 py-2 text-[0.8rem] font-medium uppercase tracking-[0.14em] transition-colors hover:text-bronze",
                      active(item.href) && "text-bronze",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contacto"
            className="group hidden items-center gap-2 border border-bone/40 px-5 py-2.5 text-[0.78rem] font-medium uppercase tracking-[0.14em] transition-colors hover:border-bronze hover:bg-bronze hover:text-ink sm:inline-flex"
          >
            Contacto
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <button
            type="button"
            className="grid size-11 place-items-center lg:hidden"
            aria-label={mobile ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobile}
            aria-controls="menu-movil"
            onClick={() => setMobile((m) => !m)}
          >
            {mobile ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Paneles desplegables (escritorio) */}
      <AnimatePresence>
        {mainNav.filter(isGroup).map(
          (group) =>
            open === group.label && (
              <motion.div
                key={group.label}
                id={`menu-${group.label}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => openMenu(group.label)}
                onMouseLeave={scheduleClose}
                className="absolute inset-x-0 top-full hidden border-b border-line bg-ink/95 backdrop-blur-xl lg:block"
              >
                <div className="shell py-8">
                  {group.mega ? <MegaGrid links={group.children} /> : <SimpleList links={group.children} />}
                </div>
              </motion.div>
            ),
        )}
      </AnimatePresence>

    </motion.header>

      {/* Menú móvil: FUERA del <header> porque su transform/backdrop-filter
          convierte a `position: fixed` en relativo al header (altura 0). */}
      <AnimatePresence>
        {mobile && (
          <motion.nav
            id="menu-movil"
            aria-label="Principal móvil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 bottom-0 top-18 z-[45] overflow-y-auto bg-ink md:top-20 lg:hidden"
          >
            <ul className="shell divide-y divide-line py-4">
              {mainNav.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {isGroup(item) ? (
                    <details className="group py-4" open={item.mega}>
                      <summary className="display flex cursor-pointer list-none items-center justify-between text-4xl">
                        {item.label}
                        <ChevronDown className="size-6 transition-transform group-open:rotate-180" />
                      </summary>
                      <ul className="mt-4 grid gap-1 pl-1">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} className="block py-2 text-lg text-bone-dim hover:text-bronze">
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <Link href={item.href} className="display block py-4 text-4xl hover:text-bronze">
                      {item.label}
                    </Link>
                  )}
                </motion.li>
              ))}
              <li className="py-6">
                <Link href="/contacto" className="inline-flex items-center gap-2 bg-bronze px-6 py-4 font-medium uppercase tracking-[0.14em] text-ink">
                  Hablemos de tu proyecto <ArrowUpRight className="size-4" />
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

function MegaGrid({ links }: { links: NavLink[] }) {
  return (
    <ul className="grid grid-cols-6 gap-4">
      {links.map((l, i) => (
        <motion.li key={l.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          <Link href={l.href} className="group block">
            <div className="relative aspect-[4/3] overflow-hidden bg-ink-3">
              {l.image && (
                <Image src={l.image} alt="" fill sizes="16vw" quality={60} className="object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-100" />
              )}
              <span className="absolute left-2 top-2 font-mono text-[0.65rem] text-bone/80">0{i + 1}</span>
            </div>
            <p className="mt-3 text-sm font-medium uppercase tracking-[0.12em] group-hover:text-bronze">{l.label}</p>
            <p className="mt-1 text-xs leading-snug text-muted">{l.description}</p>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}

function SimpleList({ links }: { links: NavLink[] }) {
  return (
    <ul className="flex gap-16">
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="group block">
            <p className="display text-4xl group-hover:text-bronze">{l.label}</p>
            <p className="mt-1 text-sm text-muted">{l.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
