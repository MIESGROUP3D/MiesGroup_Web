import type { Metadata, Viewport } from "next";
// Fuentes auto-alojadas (sin Google Fonts externo), font-display: swap
import "@fontsource-variable/big-shoulders-display";
import "@fontsource-variable/instrument-sans";
import "@fontsource/ibm-plex-mono/400";
import "@fontsource/ibm-plex-mono/500";
import "./globals.css";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { site } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Estudio 3D de visualización arquitectónica`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: site.name,
    images: [{ url: site.hero.poster.src, width: site.hero.poster.width, height: site.hero.poster.height, alt: site.hero.poster.alt }],
  },
  twitter: { card: "summary_large_image" },
  // ⚠ MOCKUP: no indexar hasta el lanzamiento. Quitar en producción.
  robots: { index: false, follow: false },
};

/**
 * Sin `maximum-scale`: el sitio actual bloquea el zoom en móvil (WCAG 1.4.4).
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0b0a",
};

/** Datos estructurados LocalBusiness (SEO local para las 3 sedes) */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.legalName,
  url: site.url,
  description: site.description,
  foundingDate: String(site.foundedYear),
  telephone: site.phones[0],
  email: site.email,
  sameAs: Object.values(site.social),
  address: site.locations.map((l) => ({ "@type": "PostalAddress", addressLocality: l.city, addressCountry: l.code })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body className="grain min-h-dvh">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>
          <Header />
          <main id="contenido">{children}</main>
          <Footer />
          <WhatsAppFab />
        </Providers>
      </body>
    </html>
  );
}
