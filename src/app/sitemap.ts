import type { MetadataRoute } from "next";
import { games } from "@/content/games";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

/** sitemap.xml generado desde el contenido: una página nueva aparece sola. */
export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${site.url}${p}`;
  return [
    { url: u("/"), priority: 1 },
    ...["/servicios", "/estudio", "/contacto", "/videojuegos", "/channel", "/conferencias"].map((p) => ({ url: u(p), priority: 0.8 })),
    ...projects.map((p) => ({ url: u(`/proyectos/${p.slug}`), priority: 0.7, images: p.images.map((i) => u(i.src)) })),
    ...games.map((g) => ({ url: u(`/videojuegos/${g.slug}`), priority: 0.6 })),
  ];
}
