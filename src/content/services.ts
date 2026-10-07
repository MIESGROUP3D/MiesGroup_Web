import { img } from "./media";
import type { Locale } from "@/lib/i18n";
import { servicesEn } from "./en";
import type { Service, ServiceSlug } from "./types";

/**
 * Servicios. ⚠ Los textos son un BORRADOR para el mockup: se reemplazan por los
 * textos definitivos del cliente. `legacyPath` = URL actual en WordPress,
 * para las redirecciones 301 cuando el sitio pase a un hosting con servidor.
 */
export const services: Service[] = [
  {
    slug: "3d-rendering",
    name: "Render 3D",
    tagline: "Imágenes fotorrealistas que venden el proyecto antes de construirlo.",
    body: [
      "Renders exteriores, interiores y aéreos con iluminación, materiales y ambientación fieles al diseño. Cada imagen se compone como una fotografía de arquitectura: encuadre, hora del día y atmósfera pensados para el público del proyecto.",
      "Entregamos en la resolución que cada canal necesita, desde valla publicitaria hasta redes sociales.",
    ],
    deliverables: ["Renders exteriores e interiores", "Vistas aéreas e implantación", "Postproducción y ambientación", "Formatos para impresión gran formato y digital"],
    cover: img("/media/projects/trialto/01.jpg", "Torres de Trialto al atardecer", 2000, 1125),
    legacyPath: "/3d-rendering/",
  },
  {
    slug: "cgi-animation",
    name: "Animación CGI",
    tagline: "Recorridos y animaciones cinematográficas del proyecto.",
    body: [
      "Animaciones arquitectónicas con lenguaje de cine: recorridos, time-lapses de luz, secuencias constructivas y piezas para lanzamiento comercial.",
      "Producción completa: guion, previsualización, render, música y edición.",
    ],
    deliverables: ["Recorridos virtuales en video 4K", "Piezas cortas para redes", "Secuencias constructivas", "Edición, música y color"],
    cover: img("/media/cgi/banner-cgi.jpg", "Fotograma de animación CGI de MIES Group", 1920, 1080),
    legacyPath: "/cgi-animation/",
  },
  {
    slug: "360-virtual-tour",
    name: "Tour virtual 360°",
    tagline: "Recorre cada espacio desde el navegador, sin instalar nada.",
    body: [
      "Tours virtuales 360° navegables en web y móvil, con puntos de interés, planos interactivos y cambio de acabados.",
      "Ideales para sala de ventas, pauta digital y seguimiento de obra.",
    ],
    deliverables: ["Panorámicas 360° renderizadas", "Hotspots e información por espacio", "Planta interactiva", "Compatible con visores VR"],
    cover: img("/media/tours/banner-360.jpg", "Recorrido virtual 360° de ZOHO Manizales", 1920, 1080),
    legacyPath: "/360-virtual-tour/",
  },
  {
    slug: "vr-games",
    name: "VR/Juegos",
    tagline: "Realidad virtual y videojuegos: experiencias para recorrer y jugar.",
    body: [
      "Experiencias en tiempo real (Unreal Engine) para visores como Meta Quest: el cliente camina el proyecto a escala 1:1 y toma decisiones antes de construir. También desarrollamos espacios multiusuario y showrooms virtuales.",
      "Y videojuegos que corren directamente en el navegador, sin instalar nada: piezas jugables para marcas, lanzamientos y experiencias interactivas.",
    ],
    deliverables: ["Experiencias VR en tiempo real", "Showrooms virtuales", "Configuradores de acabados", "Videojuegos para navegador"],
    cover: img("/media/games/banner-games.jpg", "Fotograma de videojuego de MIES Group", 1920, 758),
    // en el sitio actual eran dos páginas: /metaverse-vr/ y /video-juegos/
    legacyPath: "/metaverse-vr/",
  },
  {
    slug: "web3d",
    name: "Web3D",
    tagline: "Modelos 3D interactivos directamente en la web.",
    body: [
      "Experiencias 3D que corren en el navegador: selectores de unidades, masterplans interactivos y visores de producto, sin descargas.",
      "Pensado para que el comprador explore disponibilidad, vistas y áreas desde cualquier dispositivo.",
    ],
    deliverables: ["Masterplans interactivos", "Selector de unidades y disponibilidad", "Visores 3D embebibles", "Integración con CRM"],
    cover: img("/media/web3d/banner-web3d.jpg", "Plataforma Web3D de MIES Group", 1600, 632),
    legacyPath: "/que-es-web3d/",
  },
  {
    slug: "ai",
    name: "IA",
    tagline: "Inteligencia artificial aplicada a la visualización.",
    body: [
      "Flujos con IA para acelerar iteraciones de diseño, variantes de ambientación y contenido para campañas, siempre con control de calidad del equipo.",
      "Integramos IA donde reduce tiempos sin sacrificar fidelidad al proyecto.",
    ],
    deliverables: ["Variantes rápidas de ambientación", "Exploración de conceptos", "Contenido para campañas", "Asistentes para sala de ventas"],
    cover: img("/media/ai/banner-ai.jpg", "Fotograma generado con inteligencia artificial por MIES Group", 1920, 758),
    legacyPath: "/ai/",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function serviceName(slug: ServiceSlug, lang: Locale = "es") {
  return getServiceIn(slug, lang)?.name ?? slug;
}

/** Servicios en un idioma (en inglés, con los textos de en.ts; los nombres son iguales). */
export function getServices(lang: Locale = "es"): Service[] {
  if (lang === "es") return services;
  return services.map((s) => {
    const e = servicesEn[s.slug];
    return e ? { ...s, name: e.name ?? s.name, tagline: e.tagline, body: e.body, deliverables: e.deliverables, cover: { ...s.cover, alt: e.coverAlt } } : s;
  });
}

export function getServiceIn(slug: string, lang: Locale = "es") {
  return getServices(lang).find((s) => s.slug === slug);
}
