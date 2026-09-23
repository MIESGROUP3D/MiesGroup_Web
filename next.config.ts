import type { NextConfig } from "next";

/**
 * Configuración de Next.js
 *
 * - images: AVIF/WebP automáticos + calidades permitidas (Next 16 solo permite
 *   [75] por defecto; declaramos las que usamos).
 * - headers: seguridad básica + headers del juego en /games.
 * - redirects: URLs del WordPress actual → nuevas rutas (301/308 permanentes)
 *   para no perder posicionamiento SEO.
 */
const legacyRedirects: Array<[string, string]> = [
  ["/3d-rendering", "/servicios/3d-rendering"],
  ["/cgi-animation", "/servicios/cgi-animation"],
  ["/360-virtual-tour", "/servicios/360-virtual-tour"],
  ["/metaverse-vr", "/servicios/metaverse-vr"],
  ["/que-es-web3d", "/servicios/web3d"],
  ["/ai", "/servicios/ai"],
  ["/video-juegos", "/videojuegos"],
  ["/about-us", "/nosotros"],
  ["/privacy-and-data-policy", "/privacidad"],
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 90],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Assets del juego: cache largo (usar nombres con hash o cambiar la carpeta al versionar)
        source: "/games/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" },
          // ── Descomentar SOLO si el build del cliente es Unity/Godot con hilos (SharedArrayBuffer):
          // { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          // { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
      {
        source: "/games/:path*.wasm",
        headers: [{ key: "Content-Type", value: "application/wasm" }],
      },
      // Builds Unity comprimidos (.br / .gz) necesitan Content-Encoding explícito:
      // { source: "/games/:path*.br", headers: [{ key: "Content-Encoding", value: "br" }] },
      // { source: "/games/:path*.gz", headers: [{ key: "Content-Encoding", value: "gzip" }] },
    ];
  },

  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
