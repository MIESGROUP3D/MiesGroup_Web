/**
 * Prefijo de la URL cuando el sitio vive en una subcarpeta (GitHub Pages:
 * /MiesGroup_Web). next/link lo agrega solo; next/image y los iframes NO, así
 * que toda ruta a /public pasa por withBase().
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const withBase = (path: string) => (path.startsWith("/") ? `${BASE_PATH}${path}` : path);
