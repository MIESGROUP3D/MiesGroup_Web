import { ContactForm } from "@/components/ContactForm";
import { site, siteText, whatsappHref } from "@/content/site";
import { t } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { pageMeta } from "./meta";

export const contactMeta = (lang: Locale) => pageMeta(lang, "contact", { title: t(lang).contact.title, description: t(lang).contact.description });

/**
 * Contacto: primero los canales directos (un clic), luego un formulario corto.
 * Todo sobre una misma rejilla de 12 columnas: etiqueta a la izquierda (3) y
 * contenido a la derecha (9), con líneas finas entre filas.
 */
export function ContactView({ lang }: { lang: Locale }) {
  const ui = t(lang).contact;
  const text = siteText(lang);
  const row = "grid gap-1 border-t border-line py-5 md:grid-cols-12 md:gap-6";
  const label = "text-sm text-muted md:col-span-3 md:pt-1";
  const value = "md:col-span-9";

  return (
    <div lang={lang} className="shell pt-6">
      <header className="grid gap-4 pb-12 md:grid-cols-12 md:gap-6 md:pb-16">
        <h1 className="display text-4xl md:col-span-6 md:text-6xl">{ui.title}</h1>
        <div className="md:col-span-6 md:self-end">
          <p className="max-w-md text-lg text-ink-soft">{ui.description}</p>
          <p className="mt-1 text-sm text-muted">{ui.reply}</p>
        </div>
      </header>

      {/* Canales directos */}
      <section aria-label={ui.title}>
        <div className={row}>
          <p className={label}>{ui.emailLabel}</p>
          <a href={`mailto:${site.email}`} className={`${value} w-fit text-2xl font-medium tracking-[-0.02em] link-underline md:text-4xl`}>
            {site.email}
          </a>
        </div>
        <div className={row}>
          <p className={label}>{ui.whatsappLabel}</p>
          <a
            href={whatsappHref(text.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${value} group inline-flex w-fit items-center gap-2 text-2xl font-medium tracking-[-0.02em] md:text-4xl`}
          >
            <span className="link-underline">{ui.whatsappCta}</span>
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
          </a>
        </div>
        <div className={row}>
          <p className={label}>{ui.phones}</p>
          <div className={`${value} flex flex-wrap gap-x-8 gap-y-1 text-lg md:text-xl`}>
            {site.phones.map((p) => (
              <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="hover:underline hover:underline-offset-4">
                {p}
              </a>
            ))}
          </div>
        </div>
        <div className={row}>
          <p className={label}>{ui.offices}</p>
          <p className={`${value} text-lg md:text-xl`}>{text.locations.map((l) => `${l.city}, ${l.country}`).join(" · ")}</p>
        </div>
      </section>

      {/* Formulario */}
      <section aria-labelledby="h-form" className={`${row} mt-16 pt-8 md:mt-24`}>
        <h2 id="h-form" className={label}>
          {ui.formTitle}
        </h2>
        <div className={`${value} mt-4 md:mt-0`}>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
