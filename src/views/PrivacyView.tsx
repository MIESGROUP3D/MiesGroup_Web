import { PageHeader } from "@/components/PageHeader";
import { privacy, privacyUpdated } from "@/content/privacy";
import { site, siteText } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { pageMeta } from "./meta";

export const privacyMeta = (lang: Locale) => pageMeta(lang, "privacy", { title: privacy[lang].metaTitle, description: privacy[lang].description });

/**
 * Política de privacidad (contenido en src/content/privacy.ts, en los dos idiomas).
 * Cubre: responsable, datos recogidos, finalidad, uso de IA, terceros,
 * derechos del titular y cómo pedir el borrado.
 */
export function PrivacyView({ lang }: { lang: Locale }) {
  const c = privacy[lang];
  const hq = siteText(lang).locations.find((l) => "hq" in l && l.hq) ?? siteText(lang).locations[0];
  const updated = new Intl.DateTimeFormat(c.dateLocale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(privacyUpdated));
  const [company, hqText] = c.hq(site.legalName, hq.city, hq.country);
  const deleteHref = `mailto:${site.email}?subject=${encodeURIComponent(c.deleteSubject)}&body=${encodeURIComponent(c.deleteBody)}`;
  const mail = (
    <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-4">
      {site.email}
    </a>
  );

  return (
    <div lang={lang}>
      <PageHeader title={c.title} intro={c.intro} />

      <div className="shell max-w-3xl space-y-12 text-ink-soft">
        <p className="border border-dashed border-ink/50 p-4 text-sm text-ink">{c.draft(site.legalName, updated)}</p>

        <Section title={c.s1}>
          <p>
            <strong className="font-medium text-ink">{company}</strong>
            {hqText}
            {mail} · {site.phones[0]}.
          </p>
        </Section>

        <Section title={c.s2}>
          <dl className="space-y-3">
            {c.collected.map((d) => (
              <div key={d.what}>
                <dt className="font-medium text-ink">{d.what}</dt>
                <dd>{d.detail}</dd>
              </div>
            ))}
          </dl>
          <p>{c.onlyNeeded}</p>
        </Section>

        <Section title={c.s3}>
          <ul className="list-disc space-y-1 pl-5">
            {c.purposes.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p>
            {c.retention} <span className="text-ink">{c.retentionPending}</span>
          </p>
        </Section>

        <Section title={c.s4}>
          <p>
            {c.aiBefore(site.name)}
            <strong className="font-medium text-ink">{c.aiStrong}</strong>
            {c.aiAfter}
          </p>
        </Section>

        <Section title={c.s5}>
          <p>{c.thirdIntro}</p>
          <ul className="divide-y divide-line border-y border-line">
            {c.thirdParties.map((tp) => (
              <li key={tp.name} className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
                <p className="font-medium text-ink">{tp.name}</p>
                <div>
                  <p>{tp.use}</p>
                  <p className="text-sm text-muted">{tp.when}</p>
                  <a href={tp.policy} target="_blank" rel="noopener noreferrer" className="text-sm text-ink underline underline-offset-4">
                    {c.theirPolicy}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={c.s6}>
          <ul className="list-disc space-y-1 pl-5">
            {c.rights.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p>
            {c.writeUs} {mail}
            {c.deadlines}
          </p>
        </Section>

        <Section title={c.s7}>
          <p>
            {c.deleteBefore}
            <strong className="font-medium text-ink">{c.deleteStrong}</strong>
            {c.deleteAfter}
          </p>
          <a href={deleteHref} className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-sm text-paper transition-colors hover:bg-ink-soft">
            {c.deleteCta}
          </a>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 border-t border-line pt-6">
      <h2 className="text-xl font-medium tracking-[-0.02em] text-ink">{title}</h2>
      {children}
    </section>
  );
}
