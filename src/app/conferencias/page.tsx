import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { conferences } from "@/content/conferences";

export const metadata: Metadata = { title: "Conferencias", description: "Charlas y conferencias de MIES Group sobre visualización arquitectónica, VR e IA." };

const fmt = new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

export default function ConferencesPage() {
  const sorted = [...conferences].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHeader title="Conferencias" intro="Compartimos lo que aprendemos: charlas en eventos del sector construcción, arquitectura y tecnología." />
      <section className="shell">
        <ol className="border-t border-line">
          {sorted.map((c, i) => (
            <Reveal as="li" key={c.title} delay={i * 0.06} className="grid gap-4 border-b border-line py-10 md:grid-cols-12">
              <time dateTime={c.date} className=" text-sm text-ink md:col-span-2">{fmt.format(new Date(c.date))}</time>
              <div className="md:col-span-6">
                <h2 className="display text-xl md:text-2xl">{c.title}</h2>
                <p className="mt-3 text-ink-soft">{c.summary}</p>
              </div>
              <p className="text-sm text-muted md:col-span-3 md:col-start-10 md:text-right">
                {c.event}
                <br />
                {c.city}
              </p>
            </Reveal>
          ))}
        </ol>
      </section>
    </>
  );
}
