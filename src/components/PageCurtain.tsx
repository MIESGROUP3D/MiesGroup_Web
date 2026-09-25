"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { getCurtain, setCurtain, useCurtain } from "@/lib/curtain";

const EASE = "cubic-bezier(.39,.14,.26,1)";

/**
 * Cortina negra de transición entre secciones (ver src/lib/curtain.ts).
 * La inician el menú lateral y los paneles del inicio con navigateWithCurtain().
 *
 * - Nace EXACTAMENTE del rectángulo del elemento tocado (translate + scale con
 *   origen arriba a la izquierda) y crece hasta cubrir la pantalla.
 * - Tapada la pantalla: sube al inicio sin animación y navega.
 * - Al cambiar la ruta: se retira hacia la izquierda.
 * - Solo `transform` con transición CSS: la anima la GPU y no se traba aunque
 *   React esté armando la página nueva.
 */
export function PageCurtain() {
  const curtain = useCurtain();
  const router = useRouter();
  const pathname = usePathname();

  // al cambiar de página con la cortina esperando: retirarla. En un efecto (no en
  // el render) porque el estado es compartido y avisa a otros componentes.
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    const c = getCurtain();
    if (c?.phase === "wait") setCurtain({ ...c, phase: "reveal" });
  }, [pathname]);

  useEffect(() => {
    // start → cover: dos frames para que se pinte la forma inicial antes de la transición
    if (curtain?.phase === "start") {
      let id = requestAnimationFrame(() => {
        id = requestAnimationFrame(() => setCurtain({ ...curtain, phase: "cover" }));
      });
      return () => cancelAnimationFrame(id);
    }
    // respaldo: si la página nueva tarda, la cortina se retira igual a los 3 s
    if (curtain?.phase === "wait") {
      const id = setTimeout(() => setCurtain({ ...curtain, phase: "reveal" }), 3000);
      return () => clearTimeout(id);
    }
  }, [curtain]);

  if (!curtain) return null;

  const onEnd = () => {
    if (curtain.phase === "cover") {
      setCurtain({ ...curtain, phase: "wait" });
      // subir al inicio YA, tapado (con scroll-behavior: smooth la subida de Next se vería)
      window.scrollTo({ top: 0, behavior: "instant" });
      router.push(curtain.href, { scroll: false });
    } else if (curtain.phase === "reveal") {
      setCurtain(null);
    }
  };

  const { x, y, w, h } = curtain.from;
  const W = window.innerWidth;
  const H = window.innerHeight;
  const transform =
    curtain.phase === "start"
      ? `translate(${x}px, ${y}px) scale(${Math.max(w / W, 0.001)}, ${Math.max(h / H, 0.001)})`
      : curtain.phase === "reveal"
        ? "translateX(-100%)"
        : "none";
  const transition =
    curtain.phase === "cover" ? `transform 500ms ${EASE}` : curtain.phase === "reveal" ? `transform 650ms ${EASE} 60ms` : "none";

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[90] origin-top-left bg-ink will-change-transform"
      // bloquea clics mientras cubre; al retirarse ya no estorba
      style={{ transform, transition, pointerEvents: curtain.phase === "reveal" ? "none" : "auto" }}
      onTransitionEnd={(e) => e.target === e.currentTarget && onEnd()}
    />
  );
}
