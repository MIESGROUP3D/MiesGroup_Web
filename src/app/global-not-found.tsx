import type { Metadata } from "next";
import { NotFoundContent } from "@/components/NotFoundContent";
import { RootShell, rootViewport } from "@/components/RootShell";

/**
 * 404 de las URLs que no existen. Con dos layouts raíz (uno por idioma) no hay
 * un layout común para armarla, así que Next usa este archivo (experimental.globalNotFound
 * en next.config.ts). Lleva el mismo esqueleto del sitio, en inglés (idioma por defecto).
 */
export const metadata: Metadata = {
  title: "404 — Page not found · MIES Group",
  robots: { index: false, follow: false },
};
export const viewport = rootViewport;

export default function GlobalNotFound() {
  return (
    <RootShell lang="en">
      <NotFoundContent />
    </RootShell>
  );
}
