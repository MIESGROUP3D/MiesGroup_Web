import { img } from "./media";
import type { Locale } from "@/lib/i18n";
import { siteEn } from "./en";
import type { VideoRef } from "./types";

/**
 * Datos globales: un solo lugar para teléfonos, redes, sedes y textos del hero.
 * Datos tomados de miesgroup3d.com (sept. 2026). ⚠ Pendiente confirmar con el
 * cliente cuál número es el WhatsApp oficial (el CTA actual usa uno distinto
 * a los de "About Us").
 */
export const site = {
  name: "MIES Group",
  legalName: "MIESGROUP 3D Studio",
  url: "https://miesgroup3d.com",
  tagline: "We make it happen, we make it exist",
  description:
    "Estudio 3D de visualización arquitectónica: renders fotorrealistas, animación CGI, tours virtuales 360°, realidad virtual, Web3D e IA para proyectos inmobiliarios y comerciales.",
  foundedYear: 2015,

  whatsapp: {
    /** Solo dígitos, con indicativo */
    number: "573147897441",
    /** Se codifica con encodeURIComponent al construir el enlace (sin caracteres rotos) */
    message:
      "¡Hola MIES Group! 👋 Quiero hablar sobre un nuevo proyecto de visualización 3D.",
  },
  phones: ["+57 301 491 2226", "+57 318 779 9543"],
  /** ⚠ Pendiente: correo que recibe los formularios */
  email: "contacto@miesgroup3d.com",
  locations: [
    { city: "Manizales", country: "Colombia", code: "CO", timeZone: "America/Bogota", hq: true },
    { city: "Córdoba", country: "Argentina", code: "AR", timeZone: "America/Argentina/Cordoba" },
    { city: "Los Ángeles", country: "Estados Unidos", code: "US", timeZone: "America/Los_Angeles" },
  ],
  social: {
    youtube: "https://www.youtube.com/@miesgrouparq6892",
    instagram: "https://www.instagram.com/miesgroup/",
    linkedin: "https://www.linkedin.com/in/miesgroup/",
  },

  hero: {
    /** Primer frame visible: SIEMPRE una imagen (nunca negro mientras carga el video) */
    poster: img("/media/projects/sinara/01.jpg", "Torres de Sinara entre la vegetación", 2400, 1680),
    /**
     * Video de fondo opcional: MP4 corto (≤ 8 MB, 1080p, sin audio).
     * Déjalo en null para usar solo la imagen. Ej: { provider: "file", src: "/media/hero/reel.mp4", title: "Reel" }
     */
    video: null as VideoRef | null,
    /** Reel completo que se abre con el botón "Ver reel" (Vimeo, streaming adaptativo) */
    reel: { provider: "vimeo", id: "949710062", title: "Reel MIES Group" } satisfies VideoRef,
  },

  stats: [
    { value: "2015", label: "Fundado en Córdoba, AR" },
    { value: "3", label: "Sedes: CO · AR · US" },
    { value: "6", label: "Líneas de servicio" },
    { value: "+10", label: "Años haciendo visible lo que aún no existe" },
  ],

  about: {
    mission:
      "Transformamos la forma en que las empresas visualizan y comunican sus proyectos mediante soluciones innovadoras en visualización 3D, realidad virtual (VR), aumentada (AR), extendida (XR) e inteligencia artificial.",
    vision:
      "Ser la empresa líder en Latinoamérica en innovación y desarrollo de experiencias inmersivas con tecnologías 3D, VR, AR, XR e IA, redefiniendo los estándares de visualización en múltiples industrias.",
    story: [
      "MIESGROUP nació en 2015 en Córdoba, Argentina, en el mundo de los renders, y evolucionó rápidamente hacia la realidad virtual y el metaverso. Hoy tiene su sede en Manizales, Colombia.",
      "El equipo reúne perfiles interdisciplinarios de arquitectura, diseño y tecnología, con un enfoque personalizado: entendemos las necesidades de cada cliente y las convertimos en imágenes y experiencias que ayudan a decidir, vender y construir.",
    ],
  },
} as const;

export function whatsappHref(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

/** Textos globales del sitio en un idioma. */
export function siteText(lang: Locale = "es") {
  if (lang === "es") {
    return { description: site.description, whatsappMessage: site.whatsapp.message, story: site.about.story, heroPoster: site.hero.poster, locations: site.locations };
  }
  return {
    description: siteEn.description,
    whatsappMessage: siteEn.whatsappMessage,
    story: siteEn.story,
    heroPoster: { ...site.hero.poster, alt: siteEn.heroPosterAlt },
    locations: site.locations.map((l) => ({ ...l, country: siteEn.countries[l.country] ?? l.country })),
  };
}
