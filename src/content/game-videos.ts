import type { Locale } from "@/lib/i18n";
import type { CgiVideo } from "./cgi";
import { img } from "./media";

/**
 * Videos de videojuegos y VR (categoría "VR/Juegos" de Proyectos), tomados de la
 * página anterior (miesgroup3d.com/video-juegos): videos de Vimeo del estudio.
 * Mismo formato que las animaciones CGI (galería con vista previa al verse en pantalla).
 * Miniaturas: copias locales de las de Vimeo. El banner es una copia del video de Bunny.
 */
const v = (id: string, seconds: number, es: string, en: string, vertical = false) => ({ id, seconds, title: { es, en }, vertical });

// orden pensado para la galería: dos horizontales + el vertical (bloque), luego el resto
const videos = [
  v("1055326939", 38, "Videojuego Herragro", "Herragro videogame"),
  v("1055278532", 27, "INFERIA", "INFERIA"),
  v("949710062", 58, "MIESFUT · portero virtual", "MIESFUT · virtual goalkeeper", true),
  v("1055328748", 23, "AKAYU (Fortnite)", "AKAYU (Fortnite)"),
  v("912306196", 70, "MIESFRUIT", "MIESFRUIT"),
];

export const getGameVideos = (lang: Locale): CgiVideo[] =>
  videos.map((x) => ({ id: x.id, seconds: x.seconds, vertical: x.vertical, title: x.title[lang], poster: img(`/media/games/${x.id}.jpg`, x.title[lang], 1280, 720) }));
