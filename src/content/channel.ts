import type { Locale } from "@/lib/i18n";
import { channelTitlesEn } from "./en";
import type { VideoRef } from "./types";

/**
 * Channel: videos destacados del canal.
 * ⚠ Para el mockup se usan los Vimeo del sitio actual. Reemplazar por los IDs
 * de YouTube del canal (@miesgrouparq6892): { provider: "youtube", id: "XXXXXXXXXXX", title: "…" }
 */
export const channelVideos: VideoRef[] = [
  { provider: "vimeo", id: "949710062", title: "Reel de visualización arquitectónica" },
  { provider: "vimeo", id: "1055326939", title: "Animación CGI — torre residencial" },
  { provider: "vimeo", id: "1055278532", title: "Recorrido virtual — conjunto escalonado" },
  { provider: "vimeo", id: "1055328748", title: "Lanzamiento — centro empresarial" },
];

export const getChannelVideos = (lang: Locale = "es"): VideoRef[] =>
  lang === "es" ? channelVideos : channelVideos.map((v, i) => ({ ...v, title: channelTitlesEn[i] ?? v.title }));
