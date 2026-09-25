import { ContactForm } from "@/components/ContactForm";
import { site, siteText, whatsappHref } from "@/content/site";
import { t } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { pageMeta } from "./meta";

export const contactMeta = (lang: Locale) => pageMeta(lang, "contact", { title: t(lang).contact.title, description: t(lang).contact.description });

/** Contacto: primero los canales directos (un clic), luego un formulario corto. */
export function ContactView({ lang }: { lang: Locale }) {
  const ui = t(lang).contact;
  const text = siteText(lang);
  return (
    <div lang={lang} className="shell pt-6">
      <h1 className="display text-3xl md:text-4xl">{ui.title}</h1>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="space-y-1 text-2xl font-medium tracking-[-0.02em] md:text-3xl">
          <p>
            <a href={`mailto:${site.email}`} className="link-underline">{site.email}</a>
          </p>
          <p>
            <a href={whatsappHref(text.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="link-underline">WhatsApp</a>
          </p>
        </div>
        <dl className="grid content-start gap-x-6 gap-y-1 sm:grid-cols-[8rem_1fr]">
          <dt className="text-muted">{ui.phones}</dt>
          <dd>
            {site.phones.map((p) => (
              <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="block hover:underline hover:underline-offset-4">{p}</a>
            ))}
          </dd>
          <dt className="text-muted">{ui.offices}</dt>
          <dd>{text.locations.map((l) => `${l.city}, ${l.country}`).join(" · ")}</dd>
        </dl>
      </section>

      <section className="mt-16 grid gap-6 border-t border-line pt-6 md:grid-cols-2" aria-labelledby="h-form">
        <h2 id="h-form" className="text-muted">{ui.formTitle}</h2>
        <ContactForm />
      </section>
    </div>
  );
}
