import type { Metadata } from "next";
import { alternates, type Locale, type RouteKey } from "@/lib/i18n";

/**
 * Metadatos de una página en un idioma: título, descripción, idioma de Open
 * Graph y enlaces alternativos (hreflang) a la misma página en el otro idioma.
 */
export function pageMeta(
  lang: Locale,
  key: RouteKey,
  { title, description, rest = "", images }: { title?: Metadata["title"]; description?: string; rest?: string; images?: NonNullable<Metadata["openGraph"]>["images"] },
): Metadata {
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: alternates(key, rest, lang),
    openGraph: { locale: lang === "en" ? "en_US" : "es_CO", ...(images ? { images } : {}) },
  };
}
