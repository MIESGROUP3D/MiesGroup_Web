import type { Locale } from "@/lib/i18n";
import { conferencesEn } from "./en";
import type { Conference } from "./types";

/** ⚠ Datos DE EJEMPLO: reemplazar con las conferencias reales del cliente. */
export const conferences: Conference[] = [
  {
    title: "Visualización inmersiva para vender sobre planos",
    event: "Encuentro de Constructores del Eje Cafetero",
    date: "2026-05-14",
    city: "Manizales, CO",
    summary: "Cómo el render, el tour 360° y la VR acortan el ciclo de venta en proyectos residenciales.",
  },
  {
    title: "Del render al tiempo real: Unreal Engine en arquitectura",
    event: "Semana de la Arquitectura",
    date: "2025-10-02",
    city: "Bogotá, CO",
    summary: "Flujo de trabajo, costos y resultados de migrar la visualización a motores en tiempo real.",
  },
  {
    title: "IA aplicada a la visualización arquitectónica",
    event: "Foro de Innovación Inmobiliaria",
    date: "2025-06-19",
    city: "Córdoba, AR",
    summary: "Casos de uso reales de IA generativa sin perder fidelidad al proyecto.",
  },
];

/** Conferencias en un idioma (en inglés, título y resumen de en.ts; el evento no se traduce). */
export const getConferences = (lang: Locale = "es"): Conference[] =>
  lang === "es" ? conferences : conferences.map((c, i) => ({ ...c, ...conferencesEn[i] }));
