import type { Metadata, Viewport } from "next";
// Fuentes auto-alojadas (sin Google Fonts externo), font-display: swap
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/eb-garamond";
import "@fontsource-variable/eb-garamond/wght-italic.css";
import "@/app/globals.css";
import { Header } from "@/components/Header";
import { IntroParticles } from "@/components/IntroParticles";
import { INTRO_LOGO } from "@/lib/brand";
import { withBase } from "@/lib/basePath";
import { ProjectModal } from "@/components/ProjectModal";
import { PageCurtain } from "@/components/PageCurtain";
import { SideMenu } from "@/components/SideMenu";
import { Providers } from "@/components/Providers";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { site, siteText } from "@/content/site";
import type { Locale } from "@/lib/i18n";

/**
 * Esqueleto común de todas las páginas (<html>, <body>, header, menú, footer…).
 *
 * Hay DOS layouts raíz, uno por idioma — src/app/(en)/layout.tsx y
 * src/app/(es)/layout.tsx — y los dos usan este componente. Así el HTML estático
 * ya sale con el <html lang> correcto (antes salía siempre "en" y se corregía
 * con JavaScript, tarde para Google y algunos lectores de pantalla).
 * Cambiar de idioma recarga la página completa (Next lo hace solo al pasar de
 * un layout raíz a otro).
 */
export function rootMetadata(lang: Locale): Metadata {
  return {
    metadataBase: new URL(site.url),
    title: {
      default: lang === "es" ? `${site.name} — Estudio 3D de visualización arquitectónica` : `${site.name} — Architectural visualization 3D studio`,
      template: `%s · ${site.name}`,
    },
    description: siteText(lang).description,
    openGraph: {
      type: "website",
      locale: lang === "es" ? "es_CO" : "en_US",
      alternateLocale: [lang === "es" ? "en_US" : "es_CO"],
      siteName: site.name,
      images: [{ url: site.hero.poster.src, width: site.hero.poster.width, height: site.hero.poster.height, alt: site.hero.poster.alt }],
    },
    twitter: { card: "summary_large_image" },
    // ⚠ MOCKUP: no indexar hasta el lanzamiento. Quitar en producción.
    robots: { index: false, follow: false },
  };
}

/**
 * Sin `maximum-scale`: el sitio actual bloquea el zoom en móvil (WCAG 1.4.4).
 */
export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

/** Datos estructurados LocalBusiness (SEO local para las 3 sedes) */
const jsonLd = (lang: Locale) => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.legalName,
  url: site.url,
  description: siteText(lang).description,
  foundingDate: String(site.foundedYear),
  telephone: site.phones[0],
  email: site.email,
  sameAs: Object.values(site.social),
  address: site.locations.map((l) => ({ "@type": "PostalAddress", addressLocality: l.city, addressCountry: l.code })),
});

// Intro en CADA pestaña nueva; solo se omite al recargar/volver en la misma pestaña,
// que conserva window.name (a diferencia de sessionStorage, no se copia a pestañas nuevas).
const introScript = `try{if(window.name==="mies-intro")document.documentElement.classList.add("intro-seen")}catch(e){}`;

export function RootShell({ lang, children }: { lang: Locale; children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: el script de abajo agrega la clase intro-seen antes de hidratar
    <html lang={lang} suppressHydrationWarning>
      {/* <head> es válido aquí: esto es el layout raíz (la regla solo lo reconoce en archivos layout.tsx) */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {/* Intro de partículas: si ya se vio en esta sesión, ocultarla antes del primer pintado */}
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        {/* el logo de la intro se pide de inmediato (si no, a veces no llegaba a tiempo y la intro se saltaba) */}
        <link rel="preload" as="image" href={withBase(INTRO_LOGO)} />
      </head>
      <body className="min-h-dvh">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang)) }} />
        <IntroParticles />
        <Providers>
          <Header />
          {/* Sin fundido global entre páginas: congelaba la pantalla y trababa la
              cortina del menú (SideMenu), que ya hace de transición */}
          <main id="contenido">{children}</main>
          <Footer />
          {/* Botón "Menú" + panel lateral */}
          <SideMenu />
          {/* Cortina negra de transición (la usan el menú y los paneles del inicio) */}
          <PageCurtain />
          {/* Proyecto abierto sobre la página (lo abre cualquier ProjectLink) */}
          <ProjectModal />
          <WhatsAppFab />
        </Providers>
      </body>
    </html>
  );
}
