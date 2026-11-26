import type { NextConfig } from "next";

/**
 * Configuración de Next.js — MOCKUP publicado en GitHub Pages (sitio estático).
 *
 * - output: "export" → `next build` genera HTML/CSS/JS plano en /out.
 * - basePath: GitHub Pages publica en /MiesGroup_Web/. Llega por la variable
 *   NEXT_PUBLIC_BASE_PATH (la define el workflow); en local queda vacía.
 *   Las rutas de imágenes se prefijan con withBase() (src/lib/basePath.ts).
 * - images: sin servidor no hay optimización al vuelo; un loader propio
 *   (src/lib/imageLoader.ts) usa las versiones WebP que genera
 *   scripts/optimize-images.mjs antes del build (npm run images).
 * - trailingSlash: /estudio → /estudio/index.html (lo que GitHub Pages sirve).
 *
 * Quedaron fuera por ser un sitio estático (volver a agregarlos al pasar a un
 * hosting con servidor, p. ej. Vercel): redirecciones 301 de las URLs viejas
 * de WordPress, headers de seguridad y el envío real del formulario.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,

  // Botón "N" de Next.js en desarrollo (abajo a la izquierda): muestra errores, estado de la
  // ruta y herramientas de depuración. Solo existe en `next dev`; el sitio publicado no lo tiene.
  devIndicators: { position: "bottom-left" },

  // 404 común a los dos layouts raíz (uno por idioma): src/app/global-not-found.tsx
  experimental: { globalNotFound: true },

  images: {
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    // anchos que existen en public/_img (ver WIDTHS en el loader y en el script)
    deviceSizes: [640, 1080, 1600, 2400],
    imageSizes: [320],
    qualities: [60, 75, 80],
  },
};

export default nextConfig;
