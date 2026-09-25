import type { MetadataRoute } from "next";
import { games } from "@/content/games";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { LOCALES, route, type RouteKey } from "@/lib/i18n";

// sitio estático (output: "export"): se genera una sola vez en el build
export const dynamic = "force-static";

/**
 * sitemap.xml generado desde el contenido, en los dos idiomas: cada URL declara
 * su equivalente en el otro idioma (hreflang). Una página nueva aparece sola.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${site.url}${p}`;
  const entry = (key: RouteKey, rest: string, priority: number, extra: Partial<MetadataRoute.Sitemap[number]> = {}) =>
    LOCALES.map((lang) => ({
      url: u(route(lang, key, rest)),
      priority,
      alternates: { languages: { es: u(route("es", key, rest)), en: u(route("en", key, rest)) } },
      ...extra,
    }));

  return [
    ...entry("home", "", 1),
    ...entry("projects", "", 0.9),
    ...(["vrGames", "studio", "contact"] as const).flatMap((k) => entry(k, "", 0.8)),
    ...projects.flatMap((p) => entry("projects", `/${p.slug}`, 0.7, { images: p.images.map((i) => u(i.src)) })),
    ...games.flatMap((g) => entry("vrGames", `/${g.slug}`, 0.6)),
    ...entry("privacy", "", 0.3),
  ];
}
