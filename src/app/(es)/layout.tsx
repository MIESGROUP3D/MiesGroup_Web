import { RootShell, rootMetadata, rootViewport } from "@/components/RootShell";

/** Layout raíz de las páginas en español (/es/…). Ver RootShell. */
export const metadata = rootMetadata("es");
export const viewport = rootViewport;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="es">{children}</RootShell>;
}
