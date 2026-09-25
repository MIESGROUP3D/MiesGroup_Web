/**
 * Menú principal: 4 entradas (referencia mir.no). Todo lo demás
 * (videojuegos, channel, conferencias) se alcanza desde Estudio o el footer.
 * Regla: cualquier proyecto a 2 clics desde cualquier página.
 */
export type NavLink = { label: string; href: string };

export const mainNav: NavLink[] = [
  { label: "Inicio", href: "/" }, // la home: hero + portafolio completo
  { label: "Servicios", href: "/servicios" },
  { label: "Estudio", href: "/estudio" },
  { label: "Contacto", href: "/contacto" },
];
