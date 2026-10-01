import Image from "next/image";
import { cn } from "@/lib/cn";
import { withBase } from "@/lib/basePath";

/**
 * Logo oficial horizontal de MIES Group (originales en la NAS:
 * RESOURCES/logomiesgroup; copias para la web en public/brand/, recortadas sin
 * la línea "3D Studio" para una cabecera más limpia).
 * - `tone="home"`  → símbolo y MIES en blanco, GROUP en negro (solo en el inicio).
 * - `tone="light"` → todo blanco (fondos oscuros: Proyectos, menú).
 * - `tone="dark"`  → todo negro (páginas claras).
 * El alto lo da `className` (por defecto 20 px); el ancho sale de la proporción.
 */
const SRC = {
  home: "/brand/logo-home.png",
  light: "/brand/logo-blanco-solido.png",
  dark: "/brand/logo-negro.png",
} as const;

export function Logo({ tone = "dark", className }: { tone?: keyof typeof SRC; className?: string }) {
  return (
    <Image
      src={withBase(SRC[tone])}
      alt="MIES Group"
      width={1200}
      height={138}
      priority
      className={cn("h-[20px] w-auto", className)}
    />
  );
}
