import { useSyncExternalStore } from "react";

/**
 * Cortina de transición entre secciones (la dibuja <PageCurtain /> en el layout).
 *
 * start (nace del rectángulo del elemento tocado: panel del menú o del acordeón)
 * → cover (cubre la pantalla) → wait (se navega por detrás) → reveal (se retira
 * hacia la izquierda) → fin.
 */
export type CurtainRect = { x: number; y: number; w: number; h: number };
export type CurtainState = { phase: "start" | "cover" | "wait" | "reveal"; href: string; from: CurtainRect };

let state: CurtainState | null = null;
const listeners = new Set<() => void>();

export function setCurtain(next: CurtainState | null) {
  state = next;
  listeners.forEach((l) => l());
}

export const getCurtain = () => state;

export function useCurtain() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => null,
  );
}

/**
 * Navega a `href` con la cortina, naciendo del elemento `from`.
 * Devuelve false (y no hace nada) si no corresponde animar: clic con
 * modificadores / en otra pestaña, o movimiento reducido. En ese caso el
 * llamador deja que el enlace navegue normal.
 */
export function navigateWithCurtain(e: React.MouseEvent, href: string, from: Element | null) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (state) return true; // ya hay una transición en curso: ignorar el doble clic
  e.preventDefault();
  const r = from?.getBoundingClientRect();
  setCurtain({
    phase: "start",
    href,
    from: r ? { x: r.left, y: r.top, w: r.width, h: r.height } : { x: window.innerWidth, y: 0, w: 0, h: window.innerHeight },
  });
  return true;
}
