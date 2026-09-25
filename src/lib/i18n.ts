/**
 * Idiomas del sitio: español (por defecto, en las URLs actuales) e inglés
 * (bajo /en/). Cada página tiene su equivalente en el otro idioma según ROUTES.
 *
 * Para agregar una página traducida: sumar su ruta aquí y crear su archivo
 * en src/app/en/... usando la misma vista (src/views) con lang="en".
 */
export type Locale = "es" | "en";
export const LOCALES: Locale[] = ["es", "en"];
export const DEFAULT_LOCALE: Locale = "es";

const ROUTES = {
  home: { es: "/", en: "/en" },
  projects: { es: "/proyectos", en: "/en/projects" },
  vrGames: { es: "/vr-games", en: "/en/vr-games" },
  studio: { es: "/estudio", en: "/en/studio" },
  contact: { es: "/contacto", en: "/en/contact" },
  privacy: { es: "/privacidad", en: "/en/privacy" },
} as const;

export type RouteKey = keyof typeof ROUTES;

/** Ruta de una sección en un idioma: route("en", "projects", "/torre-aurora") → "/en/projects/torre-aurora" */
export function route(lang: Locale, key: RouteKey, rest = ""): string {
  const base: string = ROUTES[key][lang];
  if (!rest) return base;
  return base === "/" ? rest : `${base}${rest}`;
}

const normalize = (p: string) => p.replace(/\/+$/, "") || "/";

/** Idioma de una ruta (sin basePath): /en/… → "en"; el resto → "es" */
export function localeFromPath(pathname: string): Locale {
  const p = normalize(pathname);
  return p === "/en" || p.startsWith("/en/") ? "en" : "es";
}

/**
 * La misma página en el otro idioma: /proyectos/torre-aurora → /en/projects/torre-aurora.
 * Busca la sección cuyo prefijo coincide más largo; si no hay equivalente, va al inicio.
 */
export function switchLocalePath(pathname: string, to: Locale): string {
  const p = normalize(pathname);
  const from = localeFromPath(p);
  let best: { key: RouteKey; base: string } | null = null;
  for (const key of Object.keys(ROUTES) as RouteKey[]) {
    const base: string = ROUTES[key][from];
    const matches = base === "/" ? p === "/" : p === base || p.startsWith(`${base}/`);
    if (matches && (!best || base.length > best.base.length)) best = { key, base };
  }
  if (!best) return route(to, "home");
  return route(to, best.key, best.base === "/" ? "" : p.slice(best.base.length));
}

/** Enlaces alternativos para buscadores (hreflang) de una sección. */
export function alternates(key: RouteKey, rest = "", current: Locale = "es") {
  return {
    canonical: route(current, key, rest),
    languages: { es: route("es", key, rest), en: route("en", key, rest) },
  };
}
