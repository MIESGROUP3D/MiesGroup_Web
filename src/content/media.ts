import type { MediaImage } from "./types";

/**
 * Helper para declarar imágenes. Todos los placeholders son 2000×1250.
 * Cuando lleguen los renders reales, pasa sus dimensiones reales
 * (next/image las usa para reservar espacio y evitar saltos de layout / CLS).
 */
export function img(src: string, alt: string, width = 2000, height = 1250): MediaImage {
  return { src, alt, width, height };
}

/** Atajo para las 4 imágenes de un proyecto placeholder */
export function projectImages(slug: string, alts: [string, string, string, string]): MediaImage[] {
  return alts.map((alt, i) => img(`/media/projects/${slug}/0${i + 1}.jpg`, alt));
}
