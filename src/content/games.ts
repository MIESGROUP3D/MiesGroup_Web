import { img } from "./media";
import type { Game, VideoRef } from "./types";

/**
 * Videojuegos.
 *
 * "torre-demo" es un juego DE EJEMPLO (HTML5 Canvas, en public/games/torre-demo/)
 * que existe solo para probar la integración de punta a punta: carga diferida,
 * pantalla completa y aviso en móvil. Cuando el cliente entregue su build:
 *   1. Copia la carpeta exportada a public/games/<slug>/ (con index.html en la raíz)
 *   2. Agrega su entrada aquí
 *   3. Si es Unity/Godot con hilos, revisa los headers en next.config.ts
 */
export const games: Game[] = [
  {
    slug: "torre-demo",
    title: "Torre — demo de integración",
    summary:
      "Apila las losas con precisión para levantar la torre más alta. Juego de ejemplo que valida cómo se cargará el juego real del cliente en esta sección.",
    buildPath: "/games/torre-demo/index.html",
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
