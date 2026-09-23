import { z } from "zod";

/** Esquema compartido cliente/servidor: la misma validación en ambos lados. */
export const contactSchema = z.object({
  name: z.string("Escribe tu nombre").trim().min(2, "Escribe tu nombre"),
  email: z.email("Correo no válido"),
  phone: z.string("Escribe un teléfono").trim().min(7, "Teléfono no válido").max(20),
  projectType: z.string("Elige un tipo de proyecto").min(1, "Elige un tipo de proyecto"),
  message: z.string().trim().max(2000).optional().default(""),
  privacy: z.literal(true, "Debes aceptar la política de datos"),
  /** honeypot: debe llegar vacío (los bots lo llenan) */
  company: z.string().max(0).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
