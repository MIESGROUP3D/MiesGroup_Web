import { withBase } from "@/lib/basePath";
import { img } from "./media";
import type { Locale } from "@/lib/i18n";
import { gameVideoTitlesEn, gamesEn } from "./en";
import type { Game, VideoRef } from "./types";

/**
 * Videojuegos.
 *
 * "torre-demo" es un juego DE EJEMPLO (HTML5 Canvas, en public/games/torre-demo/)
 * que existe solo para probar la integración de punta a punta: carga diferida,
 * pantalla completa y aviso en móvil. Cuando el cliente entregue su build:
 *   1. Copia la carpeta exportada a public/games/<slug>/ (con index.html en la raíz)
 *   2. Agrega su entrada aquí
 *   3. Unity/Godot con hilos o comprimidos necesitan headers de servidor (no disponibles en GitHub Pages; ver README)
 */
export const games: Game[] = [
  {
    slug: "torre-demo",
    title: "Torre — demo de integración",
    summary:
      "Apila las losas con precisión para levantar la torre más alta. Juego de ejemplo que valida cómo se cargará el juego real del cliente en esta sección.",
    buildPath: withBase("/games/torre-demo/index.html"),
    cover: img("/media/games/torre-demo.jpg", "Portada del juego Torre: edificio escalonado de noche"),
    controls: ["Clic, toque o barra espaciadora: soltar losa", "R: reiniciar"],
    mobileSupported: true,
    engine: "html5",
    status: "jugable",
  },
];

/** Videos actuales de la sección Video Juegos en miesgroup3d.com (Vimeo) */
export const gameVideos: VideoRef[] = [
  { provider: "vimeo", id: "949710062", title: "Video juegos — pieza 1" },
  { provider: "vimeo", id: "1055326939", title: "Video juegos — pieza 2" },
  { provider: "vimeo", id: "1055278532", title: "Video juegos — pieza 3" },
  { provider: "vimeo", id: "1055328748", title: "Video juegos — pieza 4" },
];

export function getGame(slug: string) {
  return games.find((g) => g.slug === slug);
}

/** Juegos en un idioma (en inglés, con los textos de en.ts). */
export function getGames(lang: Locale = "es"): Game[] {
  if (lang === "es") return games;
  return games.map((g) => {
    const e = gamesEn[g.slug];
    return e ? { ...g, title: e.title, summary: e.summary, controls: e.controls, cover: { ...g.cover, alt: e.coverAlt } } : g;
  });
}

export const getGameIn = (slug: string, lang: Locale = "es") => getGames(lang).find((g) => g.slug === slug);

export const getGameVideos = (lang: Locale = "es"): VideoRef[] =>
  lang === "es" ? gameVideos : gameVideos.map((v, i) => ({ ...v, title: gameVideoTitlesEn[i] ?? v.title }));
