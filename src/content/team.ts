import type { Locale } from "@/lib/i18n";
import type { MediaImage } from "./types";
import { img } from "./media";

/**
 * Equipo del estudio (sección "Equipo" de /studio), en marco circular.
 * - `founder`: socios fundadores, arriba y más grandes.
 * - Sin `photo`: se muestra un círculo con las iniciales hasta tener la foto
 *   (fotos 400×400 en public/media/team/<nombre>.jpg).
 * - `linkedin`: URL de su perfil; con ella, la foto y el nombre llevan a LinkedIn
 *   (pestaña nueva). Sin ella, la persona se muestra sin enlace.
 *
 * ⚠ Por confirmar: tildes de los nombres y que cada persona acepte aparecer en la web.
 */
type Member = { name: string; role: Record<Locale, string>; founder?: boolean; photo?: MediaImage; linkedin?: string };

const architect3d = { es: "Arquitecto / Artista 3D", en: "Architect / 3D Artist" };
const architect3dF = { es: "Arquitecta / Artista 3D", en: "Architect / 3D Artist" };

const team: Member[] = [
  {
    name: "Alejandro Alzate",
    role: { es: "Cofundador", en: "Co-Founder" },
    founder: true,
    photo: img("/media/team/alejandro-alzate.jpg", "Alejandro Alzate", 400, 400),
    linkedin: "https://www.linkedin.com/in/alejandroalzatem/",
  },
  {
    name: "Cristian Salazar",
    role: { es: "CTO y cofundador", en: "CTO & Co-Founder" },
    founder: true,
    photo: img("/media/team/cristian-salazar.jpg", "Cristian Salazar", 400, 400),
    linkedin: "https://www.linkedin.com/in/crissalazar/",
  },
  {
    name: "Jeremy Higuita",
    role: { es: "Programador 3D / Web", en: "3D / Web Developer" },
    photo: img("/media/team/jeremy-higuita-v2.jpg", "Jeremy Higuita", 400, 400),
    linkedin: "https://www.linkedin.com/in/jeremy-higuita-012651278/",
  },
  {
    name: "Julián Robledo",
    role: { es: "Posproductor", en: "Post-production Artist" },
    photo: img("/media/team/julian-robledo.jpg", "Julián Robledo", 400, 400),
    linkedin: "https://www.linkedin.com/in/julianrpost/",
  },
  {
    name: "Vanessa Hoyos",
    role: { es: "Project Manager", en: "Project Manager" },
    photo: img("/media/team/vanessa-hoyos-v4.jpg", "Vanessa Hoyos", 400, 400),
  },
  {
    name: "Mariana Jaramillo",
    role: architect3dF,
    photo: img("/media/team/mariana-jaramillo.jpg", "Mariana Jaramillo", 400, 400),
    linkedin: "https://www.linkedin.com/in/mariana-jaramillo-cardona-4105443a7/",
  },
  {
    name: "Jesús Otálvaro Salazar",
    role: architect3d,
    photo: img("/media/team/jesus-otalvaro-v4.jpg", "Jesús Otálvaro Salazar", 400, 400),
    linkedin: "https://www.linkedin.com/in/jes%C3%BAs-david-otalvaro-salazar-902470410/",
  },
  { name: "Sergio Galvis", role: architect3d, linkedin: "https://www.linkedin.com/in/sergio-alejandro-galvis-calvo-761a321a7/" },
  { name: "Fernando Grillo", role: architect3d },
  { name: "Jennifer Grillo", role: architect3dF },
  {
    name: "Miguel Serna",
    role: { es: "Marketing", en: "Marketing" },
    photo: img("/media/team/miguel-serna.jpg", "Miguel Serna", 400, 400),
    linkedin: "https://www.linkedin.com/in/miguel-serna-hernandez-5a5a232b5/",
  },
  { name: "Laura Camila Aristizábal", role: { es: "Auxiliar administrativa", en: "Administrative Assistant" } },
];

export const getTeam = (lang: Locale) => team.map((m) => ({ ...m, role: m.role[lang] }));

/** Iniciales para el círculo sin foto: "Laura Camila Aristizábal" → "LA" (primer nombre + último apellido). */
export const initials = (name: string) => {
  const w = name.split(" ");
  return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : "")).toUpperCase();
};
