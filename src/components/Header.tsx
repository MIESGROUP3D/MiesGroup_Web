"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";

/**
 * Cabecera mínima: solo el logo, sin barra fija (la navegación vive en la
 * pestaña lateral, SideMenu). En la home flota en blanco sobre el hero a
 * pantalla completa; en el resto de páginas ocupa su fila, en negro.
 */
export function Header() {
  const overHero = usePathname() === "/";
  return (
    <header className={cn("shell flex h-16 items-center pr-14", overHero && "absolute inset-x-0 top-0 z-20 text-paper")}>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Saltar al contenido
      </a>
      <Link href="/" aria-label="MIES Group — inicio">
        <Logo />
      </Link>
    </header>
  );
}
