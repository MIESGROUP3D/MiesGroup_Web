/**
 * Idiomas del sitio: inglés (por defecto, pedido del cliente: URLs principales)
 * y español (bajo /es/). Cada página tiene su equivalente en el otro idioma según ROUTES.
 *
 * Para agregar una página traducida: sumar su ruta aquí y crear su archivo
 * en src/app/... (inglés) y src/app/es/... (español) usando la misma vista (src/views).
 */
export type Locale = "es" | "en";
export const LOCALES: Locale[] = ["es", "en"];
export const DEFAULT_LOCALE: Locale = "en";

const ROUTES = {
  home: { en: "/", es: "/es" },
  projects: { en: "/projects", es: "/es/proyectos" },
  vrGames: { en: "/vr-games", es: "/es/vr-games" },
  studio: { en: "/studio", es: "/es/estudio" },
  channel: { en: "/channel", es: "/es/channel" },
  talks: { en: "/talks", es: "/es/charlas" },
  contact: { en: "/contact", es: "/es/contacto" },
  privacy: { en: "/privacy", es: "/es/privacidad" },
} as const;

export type RouteKey = keyof typeof ROUTES;

/** Ruta de una sección en un idioma: route("es", "projects", "/torre-aurora") → "/es/proyectos/torre-aurora" */
export function route(lang: Locale, key: RouteKey, rest = ""): string {
  const base: string = ROUTES[key][lang];
  if (!rest) return base;
  return base === "/" ? rest : `${base}${rest}`;
}

const normalize = (p: string) => p.replace(/\/+$/, "") || "/";

/** Idioma de una ruta (sin basePath): /es/… → "es"; el resto → "en" */
export function localeFromPath(pathname: string): Locale {
  const p = normalize(pathname);
  return p === "/es" || p.startsWith("/es/") ? "es" : "en";
}

/**
 * La misma página en el otro idioma: /projects/torre-aurora → /es/proyectos/torre-aurora.
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
export function alternates(key: RouteKey, rest = "", current: Locale = DEFAULT_LOCALE) {
  return {
    canonical: route(current, key, rest),
    languages: { es: route("es", key, rest), en: route("en", key, rest) },
  };
}
