"use client";

/**
 * Loader de next/image para el sitio estático: en vez de un servidor de imágenes,
 * usa las versiones WebP que genera `npm run images` (scripts/optimize-images.mjs).
 *
 *   /media/projects/sinara/01.jpg + ancho 900 → /_img/media/projects/sinara/01-1080.webp
 *
 * - En desarrollo devuelve el original (así una imagen recién agregada se ve sin
 *   correr el script); el `?w=` solo evita el aviso de Next de que el loader ignora el ancho.
 * - Imágenes externas, SVG o GIF pasan sin cambios.
 */
import { BASE_PATH } from "./basePath";

// Mantener igual que WIDTHS en scripts/optimize-images.mjs
const WIDTHS = [320, 640, 1080, 1600, 2400];

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const local = src.startsWith("/") && /\.(jpe?g|png)$/i.test(src);
  if (!local || process.env.NODE_ENV === "development") return local ? `${src}?w=${width}` : src;

  const path = BASE_PATH && src.startsWith(BASE_PATH) ? src.slice(BASE_PATH.length) : src;
  const w = WIDTHS.find((x) => x >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `${BASE_PATH}/_img${path.replace(/\.(jpe?g|png)$/i, "")}-${w}.webp`;
}
