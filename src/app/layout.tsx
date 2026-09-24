import type { Metadata, Viewport } from "next";
import { ViewTransition } from "react";
// Fuentes auto-alojadas (sin Google Fonts externo), font-display: swap
import "@fontsource-variable/instrument-sans";
import "./globals.css";
import { Header } from "@/components/Header";
import { IntroParticles } from "@/components/IntroParticles";
import { SideMenu } from "@/components/SideMenu";
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
  themeColor: "#ffffff",
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

const introScript = `try{if(sessionStorage.getItem("mies-intro"))document.documentElement.classList.add("intro-seen")}catch(e){}`;

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: el script de abajo agrega la clase intro-seen antes de hidratar
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Intro de partículas: si ya se vio en esta sesión, ocultarla antes del primer pintado */}
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="min-h-dvh">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <IntroParticles />
        <Providers>
          {/* Pestaña lateral de navegación; desplaza este contenido al abrirse */}
          <SideMenu>
            <Header />
            {/* Transición suave entre páginas (View Transitions API; sin soporte, navega normal) */}
            <ViewTransition default="page">
              <main id="contenido">{children}</main>
            </ViewTransition>
            <Footer />
          </SideMenu>
          {/* Fuera de SideMenu: son position: fixed */}
          {/* Slot @modal: proyecto abierto sobre la página (ruta interceptada) */}
          {modal}
          <WhatsAppFab />
        </Providers>
      </body>
    </html>
  );
}
