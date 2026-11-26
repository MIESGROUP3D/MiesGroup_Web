import { NotFoundContent } from "@/components/NotFoundContent";

/** Proyecto o juego inexistente (notFound() en las vistas). Las URLs que no existen usan global-not-found.tsx. */
export default function NotFound() {
  return <NotFoundContent />;
}
