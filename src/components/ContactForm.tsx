"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { z } from "zod";
import { contactSchema } from "@/lib/contact-schema";
import { services } from "@/content/services";

type Errors = Partial<Record<string, string[]>>;

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = { ...Object.fromEntries(fd), privacy: fd.get("privacy") === "on" };
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border border-line bg-paper-2 p-10">
        <span className="grid size-14 place-items-center bg-ink text-paper"><Check className="size-7" /></span>
        <p className="display mt-6 text-2xl">Mensaje recibido</p>
        <p className="mt-3 text-ink-soft">Te respondemos en menos de 24 horas hábiles.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-x-6 gap-y-8 sm:grid-cols-2">
      <Field name="name" label="Nombre" autoComplete="name" errors={errors.name} />
      <Field name="email" label="Correo" type="email" autoComplete="email" errors={errors.email} />
      <Field name="phone" label="Teléfono / WhatsApp" type="tel" autoComplete="tel" errors={errors.phone} />
      <div>
        <label htmlFor="projectType" className="eyebrow">Tipo de proyecto</label>
        <select id="projectType" name="projectType" defaultValue="" aria-invalid={!!errors.projectType} className="mt-2 w-full appearance-none border-b border-line-strong bg-transparent py-3 text-lg outline-none focus:border-ink [&>option]:bg-paper">
          <option value="" disabled>Selecciona…</option>
          {services.map((s) => <option key={s.slug}>{s.name}</option>)}
          <option>Videojuego / experiencia interactiva</option>
          <option>Otro</option>
        </select>
        <FieldError errors={errors.projectType} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className="eyebrow">Cuéntanos del proyecto (opcional)</label>
        <textarea id="message" name="message" rows={4} className="mt-2 w-full resize-y border-b border-line-strong bg-transparent py-3 text-lg outline-none focus:border-ink" />
      </div>

      {/* honeypot: invisible para humanos */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>Empresa <input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <input type="checkbox" name="privacy" className="mt-0.5 size-4 accent-[var(--color-ink)]" aria-invalid={!!errors.privacy} />
          <span>Acepto la <Link href="/privacidad" className="text-ink underline underline-offset-4">política de privacidad y tratamiento de datos</Link>.</span>
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
          Enviar
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
        <AnimatePresence>
          {status === "error" && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-red-700" role="alert">
              No se pudo enviar. Intenta de nuevo o escríbenos por WhatsApp.
            </motion.p>
          )}
        </AnimatePresence>
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
