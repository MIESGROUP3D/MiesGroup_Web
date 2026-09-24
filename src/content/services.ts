import { img } from "./media";
import type { Service, ServiceSlug } from "./types";

/**
 * Servicios. ⚠ Los textos son un BORRADOR para el mockup: se reemplazan por los
 * textos definitivos del cliente. `legacyPath` = URL actual en WordPress,
 * para las redirecciones 301 cuando el sitio pase a un hosting con servidor.
 */
export const services: Service[] = [
  {
    slug: "3d-rendering",
    name: "3D Rendering",
    tagline: "Imágenes fotorrealistas que venden el proyecto antes de construirlo.",
    body: [
      "Renders exteriores, interiores y aéreos con iluminación, materiales y ambientación fieles al diseño. Cada imagen se compone como una fotografía de arquitectura: encuadre, hora del día y atmósfera pensados para el público del proyecto.",
      "Entregamos en la resolución que cada canal necesita, desde valla publicitaria hasta redes sociales.",
    ],
    deliverables: ["Renders exteriores e interiores", "Vistas aéreas e implantación", "Postproducción y ambientación", "Formatos para impresión gran formato y digital"],
    cover: img("/media/projects/torre-aurora/01.jpg", "Render exterior de torre residencial al atardecer"),
    legacyPath: "/3d-rendering/",
  },
  {
    slug: "cgi-animation",
    name: "CGI Animation",
    tagline: "Recorridos y animaciones cinematográficas del proyecto.",
    body: [
      "Animaciones arquitectónicas con lenguaje de cine: recorridos, time-lapses de luz, secuencias constructivas y piezas para lanzamiento comercial.",
      "Producción completa: guion, previsualización, render, música y edición.",
    ],
    deliverables: ["Recorridos virtuales en video 4K", "Piezas cortas para redes", "Secuencias constructivas", "Edición, música y color"],
    cover: img("/media/projects/terrazas-del-valle/01.jpg", "Fotograma de animación de edificio escalonado"),
    legacyPath: "/cgi-animation/",
  },
  {
    slug: "360-virtual-tour",
    name: "360 Virtual Tour",
    tagline: "Recorre cada espacio desde el navegador, sin instalar nada.",
    body: [
      "Tours virtuales 360° navegables en web y móvil, con puntos de interés, planos interactivos y cambio de acabados.",
      "Ideales para sala de ventas, pauta digital y seguimiento de obra.",
    ],
    deliverables: ["Panorámicas 360° renderizadas", "Hotspots e información por espacio", "Planta interactiva", "Compatible con visores VR"],
    cover: img("/media/projects/pabellon-lago/02.jpg", "Vista de pabellón de vidrio junto a un lago"),
    legacyPath: "/360-virtual-tour/",
  },
  {
    slug: "metaverse-vr",
    name: "Metaverse / VR",
    tagline: "Experiencias inmersivas en realidad virtual a escala real.",
    body: [
      "Experiencias en tiempo real (Unreal Engine) para visores como Meta Quest: el cliente camina el proyecto a escala 1:1 y toma decisiones antes de construir.",
      "También desarrollamos espacios multiusuario y showrooms virtuales.",
    ],
    deliverables: ["Experiencias VR en tiempo real", "Showrooms virtuales", "Configuradores de acabados", "Soporte para sala de ventas"],
    cover: img("/media/projects/edificio-cumbre/03.jpg", "Torre de oficinas de noche con fachada iluminada"),
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
    cover: img("/media/projects/centro-empresarial-norte/02.jpg", "Complejo empresarial escalonado al atardecer"),
    legacyPath: "/que-es-web3d/",
  },
  {
    slug: "ai",
    name: "AI",
    tagline: "Inteligencia artificial aplicada a la visualización.",
    body: [
      "Flujos con IA para acelerar iteraciones de diseño, variantes de ambientación y contenido para campañas, siempre con control de calidad del equipo.",
      "Integramos IA donde reduce tiempos sin sacrificar fidelidad al proyecto.",
    ],
    deliverables: ["Variantes rápidas de ambientación", "Exploración de conceptos", "Contenido para campañas", "Asistentes para sala de ventas"],
    cover: img("/media/projects/casa-mirador/01.jpg", "Casa de vidrio iluminada de noche"),
    legacyPath: "/ai/",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function serviceName(slug: ServiceSlug) {
  return getService(slug)?.name ?? slug;
}
