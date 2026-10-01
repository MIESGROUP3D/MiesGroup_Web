import type { Locale } from "@/lib/i18n";
import { channelTitlesEn } from "./en";
import type { VideoRef } from "./types";

export type ChannelVideo = Extract<VideoRef, { provider: "youtube" }> & { /** fecha de publicación (AAAA-MM-DD) */ date: string };

/**
 * Channel: videos del canal de YouTube de MIES Group
 * (youtube.com/channel/UCJHw00bC20XRR4f09kdch5A), del más reciente al más antiguo.
 * El primero es el destacado. Títulos como en YouTube (con ortografía corregida);
 * la traducción al inglés está en en.ts (channelTitlesEn, mismo orden).
 */
export const channelVideos: ChannelVideo[] = [
  { provider: "youtube", id: "gAQvKHXiY2I", date: "2025-04-07", title: "INTERACTIA (plataforma educativa)" },
  { provider: "youtube", id: "lNr4BYI4ZxE", date: "2025-02-04", title: "Qué es lo mejor de trabajar en MIESGROUP" },
  { provider: "youtube", id: "hsZB_FX4jFs", date: "2025-02-04", title: "Precio: vivienda modelo vs. vivienda VR" },
  { provider: "youtube", id: "T4j5szPA47k", date: "2025-02-04", title: "Nuestros mayores desafíos como empresa" },
  { provider: "youtube", id: "uC73DgysZWk", date: "2025-02-04", title: "Mitos sobre la IA" },
  { provider: "youtube", id: "_r5LCwchDk0", date: "2025-02-04", title: "Hablemos de conceptos tecnológicos" },
  { provider: "youtube", id: "j4STrOb3AEM", date: "2025-01-16", title: "Taller: generando cortometrajes con inteligencia artificial (Colombia 4.0 – 2024)" },
  { provider: "youtube", id: "adsLHhW_FbM", date: "2023-11-16", title: "MIESGROUP, ¡nuestro compromiso!" },
  { provider: "youtube", id: "al-gQqv7gSo", date: "2023-07-07", title: "El mundo de Ana.Estesia (S.C.A.R.E)" },
  { provider: "youtube", id: "PbNJxSwJoag", date: "2022-08-18", title: "MIESGROUP 3D Studio — presentación" },
];

export const getChannelVideos = (lang: Locale = "es"): ChannelVideo[] =>
  lang === "es" ? channelVideos : channelVideos.map((v, i) => ({ ...v, title: channelTitlesEn[i] ?? v.title }));
