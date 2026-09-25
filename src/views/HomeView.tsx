import { HomeAccordion, type AccordionPanel } from "@/components/HomeAccordion";
import { getSortedProjects } from "@/content/projects";
import { getServices } from "@/content/services";
import { site, siteText } from "@/content/site";
import { t } from "@/content/ui";
import { route, type Locale } from "@/lib/i18n";
import { pageMeta } from "./meta";

export const homeMeta = (lang: Locale) =>
  pageMeta(lang, "home", {
    // título completo (sin la plantilla "%s · MIES Group")
    title: { absolute: lang === "en" ? `${site.name} — Architectural visualization 3D studio` : `${site.name} — Estudio 3D de visualización arquitectónica` },
    description: siteText(lang).description,
  });

/**
 * Inicio: una sola pantalla, sin scroll. Un panel por sección (los 6
 * servicios, entre ellos VR/Games, más Estudio y Contacto) en acordeón;
 * cada uno lleva a su página.
 */
export function HomeView({ lang }: { lang: Locale }) {
  const ui = t(lang);
  const projects = getSortedProjects(lang);
  const cities = site.locations.map((l) => l.city).join(", ");

  const panels: AccordionPanel[] = [
    ...getServices(lang).map((s) => {
      return {
        key: s.slug,
        title: s.name,
        description: s.tagline,
        cta: s.slug === "vr-games" ? ui.home.ctaVrGames : ui.home.ctaProjects,
        // VR/Games tiene página propia (VR + juegos); el resto: la sección de proyectos ya filtrada
        href: s.slug === "vr-games" ? `${route(lang, "vrGames")}/` : `${route(lang, "projects")}/?servicio=${s.slug}`,
        image: s.cover,
      };
    }),
    {
      key: "estudio",
      title: ui.nav.studio,
      description: ui.home.studio.description(site.foundedYear, cities),
      tag: ui.home.studio.tag(site.foundedYear),
      cta: ui.home.studio.cta,
      href: `${route(lang, "studio")}/`,
      image: siteText(lang).heroPoster,
    },
    {
      key: "contacto",
      title: ui.nav.contact,
      description: ui.home.contact.description,
      tag: ui.home.contact.tag,
      cta: ui.home.contact.cta,
      href: `${route(lang, "contact")}/`,
      // toma real: piscina infinita de Trialto (si no está, la portada del primer proyecto)
      image: projects.find((p) => p.slug === "trialto")?.images[6] ?? projects[0].cover,
    },
  ];

  return (
    <div lang={lang}>
      <h1 className="sr-only">
        {site.name} — {ui.home.title}
      </h1>
      <HomeAccordion panels={panels} label={ui.home.sections} />
    </div>
  );
}
