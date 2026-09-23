import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** true solo en el cliente tras hidratar (evita mismatch SSR con portales). */
export function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
