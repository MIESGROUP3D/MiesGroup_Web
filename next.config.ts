import type { NextConfig } from "next";

/**
 * Configuración de Next.js — MOCKUP publicado en GitHub Pages (sitio estático).
 *
 * - output: "export" → `next build` genera HTML/CSS/JS plano en /out.
 * - basePath: GitHub Pages publica en /MiesGroup_Web/. Llega por la variable
 *   NEXT_PUBLIC_BASE_PATH (la define el workflow); en local queda vacía.
 *   Las rutas de imágenes se prefijan con withBase() (src/lib/basePath.ts).
 * - images.unoptimized: sin servidor no hay optimización de imágenes.
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

  // Oculta el botón "N" de Next.js en desarrollo (tapaba el hero en las demos).
  // Los errores de compilación y de ejecución se siguen mostrando.
  devIndicators: false,

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
