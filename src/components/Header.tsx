"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { backTarget, markGoingBack, recordPath } from "@/lib/backstack";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { t } from "@/content/ui";
import { localeFromPath, route } from "@/lib/i18n";
import { navigateWithCurtain } from "@/lib/curtain";

/**
 * Cabecera mínima: solo el logo, sin barra fija (la navegación vive en el
 * botón "Menú" + panel lateral, SideMenu).
 * - Inicio: flota en blanco sobre el acordeón a pantalla completa.
 * - Proyectos y Channel: fila negra, continúa la página oscura.
 * - Resto: fila blanca, logo negro.
 * - Inicio: el logo va dentro de una píldora de vidrio esmerilado.
 * Fuera del inicio, una flecha a la izquierda del logo VUELVE a la página anterior del
 * sitio (con la cortina); si se entró directo, sube a la página madre (lib/backstack).
 */
export function Header() {
  const path = usePathname().replace(/\/$/, "") || "/";
  const lang = localeFromPath(path);
  const ui = t(lang).common;
  const overHome = path === route(lang, "home");
  // páginas negras: la cabecera continúa el fondo oscuro
  const dark = path === route(lang, "projects") || path === route(lang, "channel");
  useEffect(() => {
    recordPath(path + window.location.search);
  }, [path]);
  // href para el HTML estático / clic medio: la página madre; al hacer clic se calcula el destino real
  const fallback = backTarget(path).href;
  const router = useRouter();
  return (
    <header className={cn(overHome && "absolute inset-x-0 top-0 z-20 text-paper", dark && "bg-ink text-paper")}>
      {/* sin el ancho máximo de .shell: el logo va a la esquina, simétrico al botón Menú */}
      <div className="flex h-16 items-center px-[clamp(1rem,3vw,2.5rem)]">
        <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
          {ui.skip}
        </a>
        {!overHome && (
          <Link
            href={fallback}
            aria-label={ui.back}
            title={ui.back}
            onClick={(e) => {
              // clic con Ctrl/⌘/medio: el navegador abre la página madre (href) en otra pestaña
              if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              const { href, fromHistory } = backTarget(path);
              if (fromHistory) markGoingBack();
              // con cortina; si el visitante pidió menos movimiento, navega directo
              if (!navigateWithCurtain(e, href, e.currentTarget)) {
                e.preventDefault();
                router.push(href);
              }
            }}
            className="-ml-1 mr-4 grid size-10 place-items-center rounded-full ring-1 ring-current/25 transition-colors hover:bg-current/10 hover:ring-current/60"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
          </Link>
        )}
        {/* en el inicio el logo va en una píldora de vidrio (como la barra de categorías) para leerse sobre cualquier foto,
            con el lema de marca centrado debajo */}
        <div className="relative">
          <Link
            href={route(lang, "home")}
            aria-label={ui.homeAria}
            className={cn(
              "block",
              overHome &&
                "-ml-1 mt-2 rounded-full border border-paper/35 bg-paper/25 px-4 py-2.5 shadow-[0_10px_40px_-12px_rgba(0,0,0,.5)] backdrop-blur-xl backdrop-saturate-150",
            )}
          >
            <Logo tone={overHome ? "home" : dark ? "light" : "dark"} />
          </Link>
          {overHome && (
            <p className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[0.4375rem] uppercase tracking-[0.18em] text-paper/85 [text-shadow:0_1px_6px_rgb(0_0_0/0.5)]">
              {ui.tagline}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
