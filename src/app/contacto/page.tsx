import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { WhatsappIcon } from "@/components/icons";
import { site, whatsappHref } from "@/content/site";

export const metadata: Metadata = { title: "Contacto", description: "Cuéntanos de tu proyecto de visualización 3D, animación, tour 360°, VR o Web3D." };

export default function ContactPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Contacto" }]} title={<>Hablemos de<br />tu proyecto</>} />
      <section className="shell grid gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <ContactForm />
        </div>
        <aside className="space-y-10 md:col-span-4 md:col-start-9">
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 border border-line p-6 transition-colors hover:border-bronze">
            <span className="flex items-center gap-4">
              <WhatsappIcon className="size-8 text-bronze" />
              <span>
                <span className="block font-medium">WhatsApp</span>
                <span className="block text-sm text-muted">Respuesta más rápida</span>
              </span>
            </span>
            <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <div>
            <p className="eyebrow mb-4">Teléfonos</p>
            <ul className="space-y-2 font-mono">
              {site.phones.map((p) => <li key={p}><a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-bronze">{p}</a></li>)}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Correo</p>
            <a href={`mailto:${site.email}`} className="font-mono hover:text-bronze">{site.email}</a>
          </div>
          <div>
            <p className="eyebrow mb-4">Sedes</p>
            <p className="text-bone-dim">{site.locations.map((l) => `${l.city}, ${l.code}`).join(" · ")}</p>
          </div>
        </aside>
      </section>
    </>
  );
}
