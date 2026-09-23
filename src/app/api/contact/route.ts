import { z } from "zod";
import { contactSchema } from "@/lib/contact-schema";
import { site } from "@/content/site";

/**
 * POST /api/contact
 *
 * 1. Valida con Zod (mismo esquema que el formulario).
 * 2. Honeypot: si `company` viene lleno, responde 200 sin enviar (no delata al bot).
 * 3. Envía correo con Resend SI existe RESEND_API_KEY; si no (mockup/local),
 *    solo registra en consola.
 *
 * Variables de entorno (.env.local):
 *   RESEND_API_KEY=re_xxx
 *   CONTACT_TO=correo@cliente.com        (por defecto site.email)
 *   CONTACT_FROM="MIES Web <web@miesgroup3d.com>"   (dominio verificado en Resend)
 * Pendiente para producción: Cloudflare Turnstile (verificar token aquí).
 */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ ok: false, errors: z.flattenError(parsed.error).fieldErrors }, { status: 422 });
  }
  const data = parsed.data;
  if (data.company) return Response.json({ ok: true });

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[contact] (modo mockup, sin RESEND_API_KEY)", { ...data, privacy: undefined });
    return Response.json({ ok: true, mock: true });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "MIES Web <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO ?? site.email],
      reply_to: data.email,
      subject: `Nuevo contacto web — ${data.projectType} — ${data.name}`,
      text: [
        `Nombre: ${data.name}`,
        `Correo: ${data.email}`,
        `Teléfono: ${data.phone}`,
        `Tipo de proyecto: ${data.projectType}`,
        "",
        data.message || "(sin mensaje)",
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend falló", res.status, await res.text());
    return Response.json({ ok: false, error: "No se pudo enviar" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
