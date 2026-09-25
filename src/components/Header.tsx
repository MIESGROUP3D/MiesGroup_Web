"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { t } from "@/content/ui";
import { localeFromPath, route } from "@/lib/i18n";

/**
 * Cabecera mínima: solo el logo, sin barra fija (la navegación vive en el
 * botón "Menú" + panel lateral, SideMenu).
 * - Inicio: flota en blanco sobre el acordeón a pantalla completa.
 * - /proyectos: fila negra, continúa la sección oscura.
 * - Resto: fila blanca, logo negro.
 */
export function Header() {
  const path = usePathname().replace(/\/$/, "") || "/";
  const lang = localeFromPath(path);
  const ui = t(lang).common;
  const overHome = path === route(lang, "home");
  const dark = path === route(lang, "projects");
  return (
    <header className={cn(overHome && "absolute inset-x-0 top-0 z-20 text-paper", dark && "bg-ink text-paper")}>
      <div className="shell flex h-16 items-center">
        <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
          {ui.skip}
        </a>
        <Link href={route(lang, "home")} aria-label={ui.homeAria}>
          <Logo />
        </Link>
      </div>
    </header>
  );
}
