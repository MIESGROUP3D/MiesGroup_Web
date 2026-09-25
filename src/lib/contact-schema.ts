import { z } from "zod";
import { t } from "@/content/ui";
import type { Locale } from "./i18n";

/** Esquema del formulario de contacto, con los mensajes de error en el idioma de la página. */
export function contactSchema(lang: Locale = "es") {
  const e = t(lang).form.errors;
  return z.object({
    name: z.string(e.name).trim().min(2, e.name),
    email: z.email(e.email),
    phone: z.string(e.phone).trim().min(7, e.phoneInvalid).max(20),
    projectType: z.string(e.projectType).min(1, e.projectType),
    message: z.string().trim().max(2000).optional().default(""),
    privacy: z.literal(true, e.privacy),
    /** honeypot: debe llegar vacío (los bots lo llenan) */
    company: z.string().max(0).optional().default(""),
  });
}

export type ContactInput = z.infer<ReturnType<typeof contactSchema>>;
