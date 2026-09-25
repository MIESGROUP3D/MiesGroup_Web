import { useSyncExternalStore } from "react";

/**
 * Curva y duración de las expansiones tipo App Store (referencia:
 * motion.dev/examples/js-app-store-layout). Se usa en proyectos y servicios
 * para que todas las tarjetas "crezcan" igual.
 */
export const expandTransition = { duration: 0.5, ease: [0.39, 0.14, 0.26, 1] } as const;

/*
 * Qué proyecto está abierto en el modal. La tarjeta de la grilla lo lee para
 * ocultarse mientras "vive" dentro del modal y reaparecer justo cuando empieza
 * la animación de regreso (no cuando cambia la URL, que es después).
 */
let openSlug: string | null = null;
const listeners = new Set<() => void>();

export const getOpenProject = () => openSlug;

export function setOpenProject(slug: string | null) {
  openSlug = slug;
  listeners.forEach((l) => l());
}

export function useOpenProject() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => openSlug,
    () => null,
  );
}

/*
 * Abrir un proyecto desde fuera de la grilla (p. ej. el hero): la portada del
 * modal no debe "volar" desde la tarjeta de la grilla, que puede estar fuera de
 * pantalla. Se marca justo antes de navegar y ProjectCover lo lee al montarse.
 * Ventana de tiempo en vez de flag que se consume: resiste el doble render de StrictMode.
 */
let noMorphUntil = 0;
export const skipNextMorph = () => {
  noMorphUntil = Date.now() + 1500;
};
export const shouldSkipMorph = () => Date.now() < noMorphUntil;

/*
 * Mientras una tarjeta vuelve volando desde un modal, debe pasar por ENCIMA de
 * él (z-index alto). Se sube al empezar la animación y se baja al terminar;
 * como Motion no siempre avisa el final (animación interrumpida o casi nula),
 * se baja igual pasado un tiempo máximo. Así nunca queda "atascada" por encima
 * del menú u otras capas.
 */
const liftTimers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();
export function liftWhileFlying(el: HTMLElement | null, maxMs = 900) {
  if (!el) return;
  el.style.zIndex = "80";
  clearTimeout(liftTimers.get(el));
  liftTimers.set(el, setTimeout(() => dropAfterFlying(el), maxMs));
}
export function dropAfterFlying(el: HTMLElement | null) {
  if (!el) return;
  clearTimeout(liftTimers.get(el));
  el.style.zIndex = "";
}
