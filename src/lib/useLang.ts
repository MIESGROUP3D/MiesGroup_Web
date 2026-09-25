"use client";

import { usePathname } from "next/navigation";
import { localeFromPath, type Locale } from "./i18n";

/** Idioma de la página actual, para componentes del cliente (lo deduce de la URL). */
export function useLang(): Locale {
  return localeFromPath(usePathname());
}
