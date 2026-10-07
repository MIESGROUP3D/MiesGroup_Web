import { img } from "./media";
import type { MediaImage } from "./types";

/**
 * Tours virtuales 360° (categoría "Tour virtual 360°" de Proyectos).
 * Tomados de la página anterior (miesgroup3d.com/360-virtual-tour):
 * - Cada tour es un proyecto de 3DVista alojado en el servidor actual de WordPress
 *   (miesgroup3d.com/<carpeta>/). Se abre a pantalla completa dentro del sitio.
 * - Las miniaturas son copias locales de los videos de vista previa de Bunny Stream
 *   (biblioteca 695943), que solo se dejan ver desde miesgroup3d.com.
 *
 * - Los recorridos de Constructora Meléndez viven en constructoramelendez.com, que no
 *   permite mostrarse dentro de otro sitio (X-Frame-Options): `external` → se abren en
 *   una pestaña nueva. Miniaturas: copias locales de la imagen principal de cada recorrido.
 *
 * ⚠ Al mudar el dominio al sitio nuevo, las carpetas de 3DVista deben copiarse al
 *   nuevo hosting (o a 3DVista Hosting) y actualizar `url`.
 */
export type Tour = {
  slug: string;
  title: string;
  url: string;
  bunnyId?: string;
  poster: MediaImage;
  /** video corto en bucle de la tarjeta (copia 480p del de Bunny, en public/media/tours/) */
  preview?: string;
  external?: boolean;
};

const tour = (slug: string, title: string, folder: string, bunnyId: string): Tour => ({
  slug,
  title,
  url: `https://miesgroup3d.com/${folder}/`,
  bunnyId,
  poster: img(`/media/tours/${slug}.jpg`, title, 1600, 900),
  preview: `/media/tours/${slug}.mp4`,
});

/** Recorrido de Constructora Meléndez (se abre en pestaña nueva). */
const melendez = (slug: string, title: string, folder: string): Tour => ({
  slug,
  title,
  url: `https://constructoramelendez.com/${folder}/`,
  poster: img(`/media/tours/${slug}.jpg`, title, 1600, 900),
  external: true,
});

/** Del más reciente al más antiguo. */
export const tours: Tour[] = [
  melendez("tlpradera", "Tierra Linda de la Pradera", "tlpraderarecorridovr"),
  melendez("mirrinao", "Reserva de Mirriñao", "reserva-mirrinao"),
  melendez("vallealto-vr", "Valle Alto", "vallealtorecorridovr"),
  melendez("vegadelrio", "Vega del Río", "vegadelriorvr"),
  tour("verdant", "Verdant Apartamentos", "verdant", "48e11768-15bf-4b82-9011-0eb034c4f008"),
  tour("trialto", "Trialto", "Trialto", "f613bcb6-5f88-4519-a3ee-48795e2fa221"),
  tour("zoho", "ZOHO Manizales", "zoho", "0f15f201-5615-4810-8c16-bbe1e1906c54"),
  tour("arbo360", "ARBO Pance", "arbo360", "9717205c-a9aa-4472-a776-2f6f1c3b1189"),
  tour("casaverde", "Casa Verde", "Casaverde", "69b0da22-1927-4888-94ae-b1e0014428c6"),
  tour("mameyal3", "Colinas de El Mameyal · Tipo 3", "Mameyal3", "0db12c6f-4ea8-46c5-aa05-a87f6e528deb"),
  tour("mameyal4", "Colinas de El Mameyal · Tipo 4", "Mameyal4", "10c3b6a1-bfea-4f3f-a8d4-7734d4f17f45"),
  tour("mameyal5", "Colinas de El Mameyal · Tipo 5", "Mameyal5", "e0490dc8-21ee-4567-8357-75f116fcea24"),
  tour("herragro", "Herragro · Toptec", "Herragro", "c7943c2e-84da-4271-a5e1-e9ca3d9bf86b"),
];
