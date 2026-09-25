import { img, projectImages } from "./media";
import type { Locale } from "@/lib/i18n";
import { categoryLabelsEn, projectsEn } from "./en";
import { realProjects } from "./projects-real";
import type { Project, ProjectCategory } from "./types";

/**
 * Portafolio. ⚠ PROYECTOS DE EJEMPLO para el mockup (nombres e imágenes
 * placeholder). Para agregar uno real:
 *   1. Copia los renders a public/media/projects/<slug>/
 *   2. Duplica un bloque de este arreglo y cambia los datos
 *   3. `npm run build` valida que no falte nada
 */
/**
 * Proyectos DE EJEMPLO (placeholder) que quedan solo para las categorías sin
 * material real todavía (Animación CGI, Tour 360°, VR/Juegos, Web3D, IA).
 * Se reemplazan a medida que el cliente entregue esos proyectos.
 */
const sampleProjects: Project[] = [
  {
    slug: "torre-aurora",
    title: "Torre Aurora",
    location: "Manizales, CO",
    year: 2026,
    category: "residencial",
    services: ["cgi-animation"],
    summary: "Torre residencial de 18 pisos. Campaña de lanzamiento con renders de atardecer, nocturnos y una animación de 60 s.",
    featured: true,
    order: 11,
    cover: img("/media/projects/torre-aurora/01.jpg", "Torre Aurora al atardecer reflejada en espejo de agua"),
    images: projectImages("torre-aurora", [
      "Torre Aurora al atardecer reflejada en espejo de agua",
      "Torre Aurora de noche con apartamentos iluminados",
      "Torre Aurora en un día de niebla",
      "Torre Aurora a la hora dorada",
    ]),
    videos: [{ provider: "vimeo", id: "1055326939", title: "Torre Aurora — animación" }],
    specs: { Software: "3ds Max · Corona · After Effects", Entregables: "12 renders · 1 animación 4K", Duración: "5 semanas" },
  },
  {
    slug: "pabellon-lago",
    title: "Pabellón del Lago",
    location: "Córdoba, AR",
    year: 2025,
    category: "hotelero",
    services: ["360-virtual-tour"],
    summary: "Pabellón de eventos frente al lago. Renders exteriores y tour 360° para comercialización.",
    featured: true,
    order: 12,
    cover: img("/media/projects/pabellon-lago/02.jpg", "Pabellón del Lago a la hora dorada"),
    images: projectImages("pabellon-lago", [
      "Pabellón del Lago en un día despejado",
      "Pabellón del Lago a la hora dorada",
      "Pabellón del Lago al anochecer",
      "Pabellón del Lago con niebla matinal",
    ]),
    specs: { Software: "Unreal Engine · Pano2VR", Entregables: "8 renders · tour 360° de 14 nodos" },
  },
  {
    slug: "terrazas-del-valle",
    title: "Terrazas del Valle",
    location: "Pereira, CO",
    year: 2025,
    category: "residencial",
    services: ["cgi-animation", "web3d"],
    summary: "Conjunto escalonado de vivienda. Masterplan Web3D con disponibilidad por unidad.",
    featured: true,
    order: 13,
    cover: img("/media/projects/terrazas-del-valle/01.jpg", "Terrazas del Valle a la hora dorada"),
    images: projectImages("terrazas-del-valle", [
      "Terrazas del Valle a la hora dorada",
      "Terrazas del Valle de día",
      "Terrazas del Valle al atardecer",
      "Terrazas del Valle de noche",
    ]),
    videos: [{ provider: "vimeo", id: "1055278532", title: "Terrazas del Valle — recorrido" }],
  },
  {
    slug: "edificio-cumbre",
    title: "Edificio Cumbre",
    location: "Bogotá, CO",
    year: 2024,
    category: "corporativo",
    services: ["vr-games"],
    summary: "Torre de oficinas. Experiencia VR a escala real para preventa de pisos corporativos.",
    featured: true,
    order: 14,
    cover: img("/media/projects/edificio-cumbre/03.jpg", "Edificio Cumbre de noche"),
    images: projectImages("edificio-cumbre", [
      "Edificio Cumbre de día",
      "Edificio Cumbre con niebla",
      "Edificio Cumbre de noche",
      "Edificio Cumbre a la hora dorada",
    ]),
  },
  {
    slug: "casa-mirador",
    title: "Casa Mirador",
    location: "Los Ángeles, US",
    year: 2024,
    category: "residencial",
    services: ["ai"],
    summary: "Vivienda unifamiliar de vidrio. Exploración de ambientaciones con flujo asistido por IA.",
    order: 15,
    cover: img("/media/projects/casa-mirador/01.jpg", "Casa Mirador iluminada de noche"),
    images: projectImages("casa-mirador", [
      "Casa Mirador iluminada de noche",
      "Casa Mirador al atardecer",
      "Casa Mirador de día",
      "Casa Mirador a la hora dorada",
    ]),
  },
  {
    slug: "centro-empresarial-norte",
    title: "Centro Empresarial Norte",
    location: "Medellín, CO",
    year: 2023,
    category: "comercial",
    services: ["web3d", "cgi-animation"],
    summary: "Complejo de oficinas y comercio. Animación de lanzamiento y visor 3D para fuerza de ventas.",
    order: 16,
    cover: img("/media/projects/centro-empresarial-norte/02.jpg", "Centro Empresarial Norte al atardecer"),
    images: projectImages("centro-empresarial-norte", [
      "Centro Empresarial Norte con niebla",
      "Centro Empresarial Norte al atardecer",
      "Centro Empresarial Norte de día",
      "Centro Empresarial Norte de noche",
    ]),
    videos: [{ provider: "vimeo", id: "1055328748", title: "Centro Empresarial Norte — lanzamiento" }],
  },
];

/** Todos los proyectos: los reales (src/content/projects-real.ts) primero, luego los de ejemplo. */
export const projects: Project[] = [...realProjects, ...sampleProjects];

export const categoryLabels: Record<ProjectCategory, string> = {
  residencial: "Residencial",
  comercial: "Comercial",
  corporativo: "Corporativo",
  hotelero: "Hotelero",
  interiorismo: "Interiorismo",
};

/** Orden: `order` manual primero, luego año descendente */
export const sortedProjects: Project[] = [...projects].sort(
  (a, b) => (a.order ?? 999) - (b.order ?? 999) || b.year - a.year,
);

export const featuredProjects = sortedProjects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Un proyecto en un idioma (en inglés, con los textos de en.ts). */
export function localizeProject(p: Project, lang: Locale = "es"): Project {
  const e = lang === "en" ? projectsEn[p.slug] : undefined;
  if (!e) return p;
  return {
    ...p,
    summary: e.summary,
    cover: { ...p.cover, alt: e.coverAlt },
    images: p.images.map((im, i) => ({ ...im, alt: e.alts[i] ?? im.alt })),
    specs: e.specs ?? p.specs,
    videos: p.videos?.map((v, i) => ({ ...v, title: e.videoTitles?.[i] ?? v.title })),
  };
}

export const getSortedProjects = (lang: Locale = "es") => sortedProjects.map((p) => localizeProject(p, lang));

export function getProjectIn(slug: string, lang: Locale = "es") {
  const p = getProject(slug);
  return p && localizeProject(p, lang);
}

export const categoryLabelsFor = (lang: Locale = "es"): Record<ProjectCategory, string> => (lang === "en" ? categoryLabelsEn : categoryLabels);
