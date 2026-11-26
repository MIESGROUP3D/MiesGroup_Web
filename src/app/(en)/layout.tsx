import { RootShell, rootMetadata, rootViewport } from "@/components/RootShell";

/** Layout raíz de las páginas en inglés (idioma por defecto, sin prefijo en la URL). Ver RootShell. */
export const metadata = rootMetadata("en");
export const viewport = rootViewport;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
