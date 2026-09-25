import type { ServiceSlug } from "./types";
import { realProjectsEn } from "./projects-real-en";

/**
 * Traducción al inglés del CONTENIDO (servicios, proyectos, juegos,
 * conferencias, datos del estudio). Solo textos: imágenes, años, slugs y
 * enlaces se toman del contenido en español, así hay una sola fuente.
 *
 * ⚠ BORRADOR de traducción para el mockup: lo revisa el cliente.
 * Al agregar un servicio/proyecto en español, agregar aquí su versión en inglés
 * (si falta, el sitio en inglés muestra el texto en español).
 */

export const servicesEn: Record<ServiceSlug, { name?: string; tagline: string; body: string[]; deliverables: string[]; coverAlt: string }> = {
  "3d-rendering": {
    name: "3D Rendering",
    tagline: "Photorealistic images that sell the project before it's built.",
    body: [
      "Exterior, interior and aerial renders with lighting, materials and staging true to the design. Every image is composed like architectural photography: framing, time of day and atmosphere chosen for the project's audience.",
      "We deliver at the resolution each channel needs, from billboards to social media.",
    ],
    deliverables: ["Exterior and interior renders", "Aerial and site views", "Post-production and staging", "Large-format print and digital formats"],
    coverAlt: "Trialto towers at sunset",
  },
  "cgi-animation": {
    name: "CGI Animation",
    tagline: "Cinematic walkthroughs and animations of the project.",
    body: [
      "Architectural animations with a film language: walkthroughs, light time-lapses, construction sequences and launch pieces.",
      "Full production: script, previs, rendering, music and editing.",
    ],
    deliverables: ["4K video walkthroughs", "Short pieces for social media", "Construction sequences", "Editing, music and color"],
    coverAlt: "Animation still of a terraced building",
  },
  "360-virtual-tour": {
    name: "360 Virtual Tour",
    tagline: "Walk through every space from the browser, no install needed.",
    body: [
      "Navigable 360° virtual tours on web and mobile, with points of interest, interactive floor plans and finish options.",
      "Ideal for sales galleries, digital campaigns and construction follow-up.",
    ],
    deliverables: ["Rendered 360° panoramas", "Hotspots and info per space", "Interactive floor plan", "Compatible with VR headsets"],
    coverAlt: "Glass pavilion by a lake",
  },
  "vr-games": {
    name: "VR/Games",
    tagline: "Virtual reality and video games: experiences to walk through and play.",
    body: [
      "Real-time experiences (Unreal Engine) for headsets like Meta Quest: clients walk the project at 1:1 scale and make decisions before building. We also build multi-user spaces and virtual showrooms.",
      "And video games that run right in the browser, no install needed: playable pieces for brands, launches and interactive experiences.",
    ],
    deliverables: ["Real-time VR experiences", "Virtual showrooms", "Finish configurators", "Browser video games"],
    coverAlt: "Office tower at night with an illuminated facade",
  },
  web3d: {
    tagline: "Interactive 3D models right on the web.",
    body: [
      "3D experiences that run in the browser: unit selectors, interactive masterplans and product viewers, no downloads.",
      "Designed so buyers can explore availability, views and areas from any device.",
    ],
    deliverables: ["Interactive masterplans", "Unit selector and availability", "Embeddable 3D viewers", "CRM integration"],
    coverAlt: "Terraced business complex at sunset",
  },
  ai: {
    name: "AI",
    tagline: "Artificial intelligence applied to visualization.",
    body: [
      "AI workflows to speed up design iterations, staging variants and campaign content, always with our team's quality control.",
      "We bring in AI where it saves time without sacrificing fidelity to the project.",
    ],
    deliverables: ["Fast staging variants", "Concept exploration", "Campaign content", "Sales gallery assistants"],
    coverAlt: "Glass house lit at night",
  },
};

type ProjectEn = {
  summary: string;
  coverAlt: string;
  /** alt de cada imagen, en el mismo orden que en español */
  alts: string[];
  specs?: Record<string, string>;
  videoTitles?: string[];
};

export const projectsEn: Record<string, ProjectEn> = {
  // proyectos reales (generado junto con projects-real.ts)
  ...realProjectsEn,
  "torre-aurora": {
    summary: "18-story residential tower. Launch campaign with sunset and night renders plus a 60-second animation.",
    coverAlt: "Torre Aurora at sunset reflected in a pool of water",
    alts: ["Torre Aurora at sunset reflected in a pool of water", "Torre Aurora at night with lit apartments", "Torre Aurora on a foggy day", "Torre Aurora at golden hour"],
    specs: { Software: "3ds Max · Corona · After Effects", Deliverables: "12 renders · 1 4K animation", Duration: "5 weeks" },
    videoTitles: ["Torre Aurora — animation"],
  },
  "pabellon-lago": {
    summary: "Lakeside events pavilion. Exterior renders and a 360° tour for sales.",
    coverAlt: "Pabellón del Lago at golden hour",
    alts: ["Pabellón del Lago on a clear day", "Pabellón del Lago at golden hour", "Pabellón del Lago at dusk", "Pabellón del Lago in morning fog"],
    specs: { Software: "Unreal Engine · Pano2VR", Deliverables: "8 renders · 360° tour with 14 nodes" },
  },
  "terrazas-del-valle": {
    summary: "Terraced housing complex. Web3D masterplan with availability per unit.",
    coverAlt: "Terrazas del Valle at golden hour",
    alts: ["Terrazas del Valle at golden hour", "Terrazas del Valle by day", "Terrazas del Valle at sunset", "Terrazas del Valle at night"],
    videoTitles: ["Terrazas del Valle — walkthrough"],
  },
  "edificio-cumbre": {
    summary: "Office tower. Real-scale VR experience for pre-selling corporate floors.",
    coverAlt: "Edificio Cumbre at night",
    alts: ["Edificio Cumbre by day", "Edificio Cumbre in the fog", "Edificio Cumbre at night", "Edificio Cumbre at golden hour"],
  },
  "casa-mirador": {
    summary: "Glass single-family home. Staging exploration with an AI-assisted workflow.",
    coverAlt: "Casa Mirador lit at night",
    alts: ["Casa Mirador lit at night", "Casa Mirador at sunset", "Casa Mirador by day", "Casa Mirador at golden hour"],
  },
  "centro-empresarial-norte": {
    summary: "Office and retail complex. Launch animation and 3D viewer for the sales team.",
    coverAlt: "Centro Empresarial Norte at sunset",
    alts: ["Centro Empresarial Norte in the fog", "Centro Empresarial Norte at sunset", "Centro Empresarial Norte by day", "Centro Empresarial Norte at night"],
    videoTitles: ["Centro Empresarial Norte — launch"],
  },
};

export const categoryLabelsEn = {
  residencial: "Residential",
  comercial: "Commercial",
  corporativo: "Corporate",
  hotelero: "Hospitality",
  interiorismo: "Interior design",
} as const;

export const gamesEn: Record<string, { title: string; summary: string; controls: string[]; coverAlt: string }> = {
  "torre-demo": {
    title: "Tower — integration demo",
    summary: "Stack the slabs precisely to build the tallest tower. A sample game that shows how the client's real game will load in this section.",
    controls: ["Click, tap or spacebar: drop slab", "R: restart"],
    coverAlt: "Tower game cover: terraced building at night",
  },
};

export const gameVideoTitlesEn = ["Video games — piece 1", "Video games — piece 2", "Video games — piece 3", "Video games — piece 4"];

export const channelTitlesEn = ["Architectural visualization reel", "CGI animation — residential tower", "Virtual walkthrough — terraced complex", "Launch — business center"];

/** Conferencias, en el mismo orden que en español (los nombres de eventos no se traducen) */
export const conferencesEn = [
  { title: "Immersive visualization to sell off-plan", summary: "How renders, 360° tours and VR shorten the sales cycle in residential projects." },
  { title: "From rendering to real time: Unreal Engine in architecture", summary: "Workflow, costs and results of moving visualization to real-time engines." },
  { title: "AI applied to architectural visualization", summary: "Real use cases of generative AI without losing fidelity to the project." },
];

export const siteEn = {
  description:
    "Architectural visualization 3D studio: photorealistic renders, CGI animation, 360° virtual tours, virtual reality, Web3D and AI for real estate and commercial projects.",
  whatsappMessage: "Hi MIES Group! 👋 I'd like to talk about a new 3D visualization project.",
  countries: { Colombia: "Colombia", Argentina: "Argentina", "Estados Unidos": "United States" } as Record<string, string>,
  story: [
    "MIESGROUP was born in 2015 in Córdoba, Argentina, in the world of renders, and quickly evolved into virtual reality and the metaverse. Today it is headquartered in Manizales, Colombia.",
    "The team brings together interdisciplinary profiles from architecture, design and technology, with a personal approach: we understand each client's needs and turn them into images and experiences that help decide, sell and build.",
  ],
  heroPosterAlt: "Sinara towers among the greenery",
};
