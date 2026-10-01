import type { Locale } from "@/lib/i18n";
import { img } from "./media";
import type { MediaImage, VideoRef } from "./types";

/**
 * Talks / Conferencias: la línea educativa de MIES Group (charlas, talleres y cursos).
 * Textos y video tomados de la página anterior (miesgroup3d.com/conferencias), ordenados
 * y traducidos al inglés. El taller de Colombia 4.0 está en el canal de YouTube.
 */
type Text = Record<Locale, string>;
type Talk = { video: VideoRef; title: Text; event: Text; poster?: MediaImage };

const talks: Talk[] = [
  {
    video: { provider: "vimeo", id: "1062853810", title: "MIESGROUP — Conferencias" },
    poster: img("/media/talks/ia-audiovisual.jpg", "", 1920, 1080),
    title: { es: "Generación audiovisual con inteligencia artificial", en: "Audiovisual generation with artificial intelligence" },
    event: { es: "Conferencia", en: "Talk" },
  },
  {
    video: { provider: "youtube", id: "j4STrOb3AEM", title: "Taller: generando cortometrajes con IA" },
    title: { es: "Taller: generando cortometrajes con inteligencia artificial", en: "Workshop: making short films with artificial intelligence" },
    event: { es: "Colombia 4.0 · 2024", en: "Colombia 4.0 · 2024" },
  },
];

const copy = {
  es: {
    headline: "Inspirando el futuro: charlas, talleres y cursos en tecnología",
    body: [
      "En MIESGROUP creemos en el poder del conocimiento y la innovación para transformar industrias. A través de nuestra línea educativa ofrecemos charlas, talleres y cursos especializados en tecnologías emergentes como visualización 3D, realidad virtual (VR), realidad aumentada (AR), inteligencia artificial (IA) y más.",
      "Nuestro equipo comparte su experiencia y visión en eventos, universidades, empresas y congresos, con herramientas prácticas y conocimientos clave para potenciar la creatividad y la eficiencia en diversos sectores.",
      "Ya sea que busques inspiración, formación técnica o estrategias innovadoras, nuestros programas están diseñados para equipar a profesionales y empresas con las habilidades del futuro.",
    ],
    heroCta: "Ver conferencia",
    videosTitle: "En video",
    cta: "¡Lleva tu conocimiento al siguiente nivel con MIESGROUP! Contáctanos y descubre cómo nuestras sesiones pueden impulsar tu desarrollo.",
    ctaButton: "Hablemos",
    whatsapp: "¡Hola MIES Group! 👋 Quiero información sobre sus charlas, talleres o cursos.",
  },
  en: {
    headline: "Inspiring the future: talks, workshops and courses in technology",
    body: [
      "At MIESGROUP we believe in the power of knowledge and innovation to transform industries. Through our education line we offer talks, workshops and courses specialized in emerging technologies such as 3D visualization, virtual reality (VR), augmented reality (AR), artificial intelligence (AI) and more.",
      "Our team shares its experience and vision at events, universities, companies and conferences, with practical tools and key knowledge to boost creativity and efficiency across industries.",
      "Whether you are looking for inspiration, technical training or innovative strategies, our programs are designed to equip professionals and companies with the skills of the future.",
    ],
    heroCta: "Watch the talk",
    videosTitle: "On video",
    cta: "Take your knowledge to the next level with MIESGROUP! Contact us and discover how our sessions can boost your growth.",
    ctaButton: "Let's talk",
    whatsapp: "Hi MIES Group! 👋 I'd like information about your talks, workshops or courses.",
  },
};

export const getTalksCopy = (lang: Locale) => copy[lang];

export const getTalks = (lang: Locale) =>
  talks.map((t) => ({ video: { ...t.video, title: t.title[lang] }, title: t.title[lang], event: t.event[lang], poster: t.poster }));
