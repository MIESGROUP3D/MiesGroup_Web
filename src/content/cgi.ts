import type { Locale } from "@/lib/i18n";
import { img } from "./media";
import type { MediaImage } from "./types";

/**
 * Animaciones CGI (categoría "Animación CGI" de Proyectos), tomadas de la página
 * anterior (miesgroup3d.com/cgi-animation): videos de Vimeo del estudio, del más
 * reciente al más antiguo. Miniaturas: copias locales de las de Vimeo.
 * El banner de la categoría es una copia del video de Bunny de esa página.
 */
export type CgiVideo = { id: string; title: string; seconds: number; poster: MediaImage; vertical?: boolean };

const v = (id: string, seconds: number, es: string, en: string, vertical = false) => ({ id, seconds, title: { es, en }, vertical });

const videos = [
  v("1054299676", 30, "Animación CGI · maquinaria", "CGI animation · machinery"),
  v("1054196238", 28, "Animación de piezas y partes", "Parts and components animation"),
  v("1053439520", 24, "Efectos CGI (FX)", "CGI FX animation", true),
  v("1051227129", 119, "Animación CGI · proyecto residencial", "CGI animation · residential project"),
  v("820665226", 93, "MIESGROUP · animación CGI", "MIESGROUP · CGI animation"),
  v("746957608", 62, "Animación CGI por MIESGROUP", "CGI animation by MIESGROUP"),
  v("746651908", 140, "Animación CGI · recorrido", "CGI animation · walkthrough"),
  v("714244001", 36, "Obra gris / obra blanca", "Shell and core / finished", false),
];

export const getCgiVideos = (lang: Locale): CgiVideo[] =>
  videos.map((x) => ({ id: x.id, seconds: x.seconds, vertical: x.vertical, title: x.title[lang], poster: img(`/media/cgi/${x.id}.jpg`, x.title[lang], 1280, 720) }));
