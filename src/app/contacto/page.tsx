import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { site, whatsappHref } from "@/content/site";

export const metadata: Metadata = { title: "Contacto", description: "Cuéntanos de tu proyecto de visualización 3D, animación, tour 360°, VR o Web3D." };

/** Contacto: primero los canales directos (un clic), luego un formulario corto. */
export default function ContactPage() {
  return (
    <div className="shell pt-6">
      <h1 className="display text-3xl md:text-4xl">Contacto</h1>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="space-y-1 text-2xl font-medium tracking-[-0.02em] md:text-3xl">
          <p>
            <a href={`mailto:${site.email}`} className="link-underline">{site.email}</a>
          </p>
          <p>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="link-underline">WhatsApp</a>
          </p>
        </div>
        <dl className="grid content-start gap-x-6 gap-y-1 sm:grid-cols-[8rem_1fr]">
          <dt className="text-muted">Teléfonos</dt>
          <dd>
            {site.phones.map((p) => (
              <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="block hover:underline hover:underline-offset-4">{p}</a>
            ))}
          </dd>
          <dt className="text-muted">Sedes</dt>
          <dd>{site.locations.map((l) => `${l.city}, ${l.country}`).join(" · ")}</dd>
        </dl>
      </section>

      <section className="mt-16 grid gap-6 border-t border-line pt-6 md:grid-cols-2" aria-labelledby="h-form">
        <h2 id="h-form" className="text-muted">O escríbenos aquí</h2>
        <ContactForm />
      </section>
    </div>
  );
}
