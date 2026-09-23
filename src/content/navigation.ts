import { services } from "./services";

/**
 * Menú principal: de 11 ítems planos (sitio actual) a 6 entradas.
 * Los servicios y el contenido (Channel/Conferencias) van en desplegables.
 */
export type NavLink = { label: string; href: string; description?: string; image?: string };
export type NavItem = NavLink | { label: string; children: NavLink[]; mega?: boolean };

export const mainNav: NavItem[] = [
  {
    label: "Servicios",
    mega: true,
    children: services.map((s) => ({
      label: s.name,
      href: `/servicios/${s.slug}`,
      description: s.tagline,
      image: s.cover.src,
    })),
  },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Videojuegos", href: "/videojuegos" },
  {
    label: "Contenido",
    children: [
      { label: "Channel", href: "/channel", description: "Videos, making-of y reels" },
      { label: "Conferencias", href: "/conferencias", description: "Charlas y eventos del estudio" },
    ],
  },
  { label: "Nosotros", href: "/nosotros" },
];

export const isGroup = (i: NavItem): i is Extract<NavItem, { children: NavLink[] }> => "children" in i;
