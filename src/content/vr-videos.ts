import type { Locale } from "@/lib/i18n";
import type { CgiVideo } from "./cgi";
import { img } from "./media";

/**
 * Experiencias de realidad virtual (página VR/Juegos), tomadas de la página anterior
 * (miesgroup3d.com/metaverse-vr): videos de Vimeo del estudio. Miniaturas: copias
 * locales de las de Vimeo (algunas son la placa con el logo de MIES; el video de la
 * tarjeta las reemplaza al reproducirse). El banner es una copia del video de Bunny.
 */
const v = (id: string, seconds: number, es: string, en: string) => ({ id, seconds, title: { es, en } });

const videos = [
  v("913771948", 86, "Experiencia VR · medicina", "VR medical experience"),
  v("912309276", 86, "Experiencia VR · diseño interior", "VR interior design experience"),
  v("849140898", 91, "El mundo de Anaestesia", "The world of Anaestesia"),
  v("912311778", 86, "Experiencia VR · casa", "VR house experience"),
  v("912295269", 86, "Experiencia VR · hogar", "VR home experience"),
  v("912301583", 86, "Experiencia VR · agroindustria", "VR agroindustry experience"),
  v("912306196", 70, "MIESFRUIT", "MIESFRUIT"),
];

export const getVrVideos = (lang: Locale): CgiVideo[] =>
  videos.map((x) => ({ id: x.id, seconds: x.seconds, title: x.title[lang], poster: img(`/media/vr/${x.id}.jpg`, x.title[lang], 1280, 720) }));
