import type { RouteKey } from "@/lib/i18n";

/**
 * Menú principal (botón "Menú" → panel lateral; no aparece en el inicio, que
 * es un acordeón con una entrada por servicio + Estudio y Contacto).
 * Estudio reúne "About us", Channel y Conferencias del sitio actual, y
 * VR/Games reúne "Metaverse / VR" y "Video Juegos" (se llega desde su panel
 * del inicio, no está en el menú). La página de Servicios se eliminó.
 * Solo las secciones: el texto sale de ui.nav y la dirección de route(),
 * según el idioma (src/lib/i18n.ts).
 */
export const mainNav = ["home", "projects", "studio", "contact"] as const satisfies readonly RouteKey[];
