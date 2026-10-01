import { localeFromPath, route, type RouteKey } from "./i18n";

/*
 * Historial interno para la flecha "volver" de la cabecera: recuerda las páginas
 * visitadas EN el sitio (sin basePath, con su ?filtro), así la flecha regresa a
 * donde estaba el visitante con la cortina negra, en vez de ir siempre al inicio.
 * Si entró directo a una página (sin historial), sube a la página "madre".
 */
let stack: string[] = [];
let goingBack = false;

/** La cabecera lo llama en cada cambio de ruta. */
export function recordPath(path: string) {
  if (goingBack) {
    goingBack = false;
    stack.pop(); // la página que se dejó al volver
    if (stack[stack.length - 1]?.split("?")[0] === path) return;
  }
  if (stack[stack.length - 1]?.split("?")[0] !== path) stack.push(path);
  if (stack.length > 50) stack = stack.slice(-50);
}

/** Actualiza la página actual cuando cambia solo su ?filtro (p. ej. la categoría en Proyectos). */
export function updateCurrent(full: string) {
  if (stack.length) stack[stack.length - 1] = full;
}

/** Página madre cuando no hay historial: Channel/Talks → Studio; un proyecto → Proyectos; resto → inicio. */
function parentOf(path: string): string {
  const lang = localeFromPath(path);
  const under = (key: RouteKey) => path.startsWith(`${route(lang, key)}/`);
  if (path === route(lang, "channel") || path === route(lang, "talks")) return `${route(lang, "studio")}/`;
  if (under("projects")) return `${route(lang, "projects")}/`;
  if (under("vrGames")) return `${route(lang, "vrGames")}/`;
  return route(lang, "home");
}

/** A dónde lleva la flecha desde `path`; `fromHistory` = es la página anterior real. */
export function backTarget(path: string): { href: string; fromHistory: boolean } {
  const prev = stack.length >= 2 ? stack[stack.length - 2] : null;
  return prev ? { href: prev, fromHistory: true } : { href: parentOf(path), fromHistory: false };
}

export function markGoingBack() {
  goingBack = true;
}
