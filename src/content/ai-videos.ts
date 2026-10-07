import type { Locale } from "@/lib/i18n";
import type { CgiVideo } from "./cgi";
import { img } from "./media";

/**
 * Videos de inteligencia artificial (categoría "IA" de Proyectos), tomados de la
 * página anterior (miesgroup3d.com/ai): videos de Vimeo del estudio, más la
 * conferencia de IA de la página de Conferencias. Miniaturas: copias locales.
 * El banner es una copia del video de Bunny de esa página.
 */
const v = (id: string, seconds: number, es: string, en: string, vertical = false) => ({ id, seconds, title: { es, en }, vertical });

// dos horizontales + el vertical (bloque), luego el resto
const videos = [
  v("1046471304", 31, "Reel IA", "AI reel"),
  v("1054186303", 34, "Personificación con inteligencia artificial", "AI personification"),
  v("1054184015", 56, "Avanzamos hacia el futuro con la IA", "Moving into the future with AI", true),
  v("1046473529", 126, "INFERIA · teaser del videojuego", "INFERIA · videogame teaser"),
  v("1062853810", 168, "Conferencia: generación audiovisual con IA", "Talk: audiovisual generation with AI"),
];

export const getAiVideos = (lang: Locale): CgiVideo[] =>
  videos.map((x) => ({ id: x.id, seconds: x.seconds, vertical: x.vertical, title: x.title[lang], poster: img(`/media/ai/${x.id}.jpg`, x.title[lang], 1280, 720) }));
