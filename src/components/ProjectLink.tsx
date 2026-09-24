"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { setOpenProject, skipNextMorph } from "@/lib/motion";

/**
 * Enlace a un proyecto que lo abre en el modal (ProjectModal) sin salir de la
 * página. Sigue siendo un <a href> real: Ctrl/⌘+clic, clic medio o "abrir en
 * pestaña nueva" van a la página completa /proyectos/<slug>/.
 *
 * `morph={false}`: la portada no "vuela" desde la tarjeta de la grilla (útil
 * cuando se abre desde el hero u otro lugar lejos de la grilla).
 */
export function ProjectLink({
  slug,
  morph = true,
  onClick,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { slug: string; morph?: boolean }) {
  return (
    <Link
      href={`/proyectos/${slug}/`}
      scroll={false}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        if (!morph) skipNextMorph();
        setOpenProject(slug);
      }}
    />
  );
}
