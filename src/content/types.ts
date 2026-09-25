/**
 * Tipos del contenido del sitio.
 *
 * Todo lo editable vive en src/content/*. Los componentes nunca tienen texto
 * "quemado": leen de aquí. Si mañana se conecta un CMS (Sanity/Payload), solo
 * cambia la fuente de estos datos, no los componentes.
 *
 * Cada arreglo está tipado (`const projects: Project[]`): si falta un campo
 * obligatorio (p. ej. el `alt` de una imagen) el build falla antes de publicar.
 */

export type ServiceSlug =
  | "3d-rendering"
  | "cgi-animation"
  | "360-virtual-tour"
  | "vr-games"
  | "web3d"
  | "ai";

export type ProjectCategory = "residencial" | "comercial" | "corporativo" | "hotelero" | "interiorismo";

export interface MediaImage {
  /** Ruta dentro de /public, p. ej. /media/projects/torre-aurora/01.jpg */
  src: string;
  /** Texto alternativo descriptivo (SEO + accesibilidad). Obligatorio. */
  alt: string;
  width: number;
  height: number;
}

export type VideoRef =
  | { provider: "vimeo"; id: string; title: string; poster?: MediaImage }
  | { provider: "youtube"; id: string; title: string; poster?: MediaImage }
  /** MP4 auto-alojado: solo para clips cortos (fondos). Lo largo va a Vimeo. */
  | { provider: "file"; src: string; title: string; poster?: MediaImage };

export interface Seo {
  title?: string;
  description?: string;
}

export interface Service {
  slug: ServiceSlug;
  /** Nombre corto para menú y tarjetas */
  name: string;
  /** Una línea: qué resuelve */
  tagline: string;
  /** Párrafos de la página del servicio */
  body: string[];
  /** Entregables / características, en viñetas */
  deliverables: string[];
  cover: MediaImage;
  /** Slug de la URL vieja de WordPress para la redirección 301 */
  legacyPath: string;
  seo?: Seo;
}

export interface Project {
  slug: string;
  title: string;
  client?: string;
  location: string;
  year: number;
  category: ProjectCategory;
  services: ServiceSlug[];
  summary: string;
  /** Aparece en "Proyectos destacados" de la home */
  featured?: boolean;
  /** Orden manual en el portafolio (menor = primero). Sin orden → por año. */
  order?: number;
  cover: MediaImage;
  images: MediaImage[];
  videos?: VideoRef[];
  /** Ficha técnica libre: { "Software": "3ds Max, Corona" } */
  specs?: Record<string, string>;
  seo?: Seo;
}

export interface Game {
  slug: string;
  title: string;
  summary: string;
  /** Carpeta dentro de /public/games/<slug>/ con index.html en la raíz */
  buildPath: string;
  cover: MediaImage;
  trailer?: VideoRef;
  controls: string[];
  /** false = en móvil se muestra aviso + trailer en lugar del juego */
  mobileSupported: boolean;
  /** Tecnología del build: define headers de servidor necesarios */
  engine: "html5" | "threejs" | "godot" | "unity" | "otro";
  status: "jugable" | "proximamente";
}

export interface Conference {
  title: string;
  event: string;
  date: string; // ISO yyyy-mm-dd
  city: string;
  summary: string;
  video?: VideoRef;
  link?: string;
}
