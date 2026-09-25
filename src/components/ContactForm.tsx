"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { z } from "zod";
import { contactSchema } from "@/lib/contact-schema";
import { getServices } from "@/content/services";
import { t } from "@/content/ui";
import { route } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";

type Errors = Partial<Record<string, string[]>>;

export function ContactForm() {
  const lang = useLang();
  const ui = t(lang).form;
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = { ...Object.fromEntries(fd), privacy: fd.get("privacy") === "on" };
    const parsed = contactSchema(lang).safeParse(payload);
    if (!parsed.success) {
      setErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }
    setErrors({});
    setStatus("sending");
    // ⚠ MOCKUP (sitio estático en GitHub Pages): no hay servidor que reciba el
    // mensaje, así que solo se simula el envío. Para producción: un hosting con
    // servidor (ruta de API + Resend) o un servicio de formularios externo.
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border border-line bg-paper-2 p-10">
        <span className="grid size-14 place-items-center bg-ink text-paper"><Check className="size-7" /></span>
        <p className="display mt-6 text-2xl">{ui.sentTitle}</p>
        <p className="mt-3 text-ink-soft">{ui.sentText}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-x-6 gap-y-8 sm:grid-cols-2">
      <Field name="name" label={ui.name} autoComplete="name" errors={errors.name} />
      <Field name="email" label={ui.email} type="email" autoComplete="email" errors={errors.email} />
      <Field name="phone" label={ui.phone} type="tel" autoComplete="tel" errors={errors.phone} />
      <div>
        <label htmlFor="projectType" className="eyebrow">{ui.projectType}</label>
        <select id="projectType" name="projectType" defaultValue="" aria-invalid={!!errors.projectType} className="mt-2 w-full appearance-none border-b border-line-strong bg-transparent py-3 text-lg outline-none focus:border-ink [&>option]:bg-paper">
          <option value="" disabled>{ui.choose}</option>
          {getServices(lang).map((s) => <option key={s.slug}>{s.name}</option>)}
          <option>{ui.other}</option>
        </select>
        <FieldError errors={errors.projectType} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className="eyebrow">{ui.message}</label>
        <textarea id="message" name="message" rows={4} className="mt-2 w-full resize-y border-b border-line-strong bg-transparent py-3 text-lg outline-none focus:border-ink" />
      </div>

      {/* honeypot: invisible para humanos */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>Empresa <input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="sm:col-span-2">
        {/* aviso de recolección: qué pedimos, para qué y cómo borrarlo (ver /privacidad) */}
        <p id="aviso-datos" className="mb-4 text-sm text-muted">
          {ui.notice}
        </p>
        <label className="flex items-start gap-3 text-sm text-ink-soft">
          {/* sin marcar por defecto: la autorización debe ser explícita (Ley 1581) */}
          <input type="checkbox" name="privacy" aria-describedby="aviso-datos" className="mt-0.5 size-4 accent-[var(--color-ink)]" aria-invalid={!!errors.privacy} />
          <span>
            {ui.consentBefore}{" "}
            <Link href={route(lang, "privacy")} className="text-ink underline underline-offset-4">
              {ui.consentLink}
            </Link>
            .
          </span>
        </label>
        <FieldError errors={errors.privacy} />
      </div>

      <div className="flex items-center gap-6 sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center gap-3 bg-ink px-8 py-4 text-sm text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
        >
          {status === "sending" ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {ui.send}
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
        <p className="text-sm text-muted">{ui.mock}</p>
      </div>
    </form>
  );
}

function Field({ name, label, type = "text", autoComplete, errors }: { name: string; label: string; type?: string; autoComplete?: string; errors?: string[] }) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={!!errors}
        aria-describedby={errors ? `${name}-err` : undefined}
        className={cn("mt-2 w-full border-b bg-transparent py-3 text-lg outline-none transition-colors focus:border-ink", errors ? "border-red-700" : "border-line-strong")}
      />
      <FieldError id={`${name}-err`} errors={errors} />
    </div>
  );
}

function FieldError({ errors, id }: { errors?: string[]; id?: string }) {
  if (!errors?.length) return null;
  return <p id={id} className="mt-2 text-xs text-red-700">{errors[0]}</p>;
}
