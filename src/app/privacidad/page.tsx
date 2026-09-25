import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { collectedData, privacyUpdated, purposes, rights, thirdParties } from "@/content/privacy";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Política de privacidad y datos",
  description: "Qué datos recoge el sitio de MIES Group, para qué, con qué servicios externos y cómo pedir que los borremos.",
};

const hq = site.locations.find((l) => "hq" in l && l.hq) ?? site.locations[0];
const deleteHref = `mailto:${site.email}?subject=${encodeURIComponent("Solicitud de eliminación de datos personales")}&body=${encodeURIComponent(
  "Hola MIES Group, solicito eliminar todos mis datos personales.\n\nNombre:\nCorreo o teléfono con el que los envié:\n",
)}`;

/**
 * Política de privacidad (contenido en src/content/privacy.ts).
 * Cubre: responsable, datos recogidos, finalidad, uso de IA, terceros,
 * derechos del titular y cómo pedir el borrado.
 */
export default function PrivacyPage() {
  const updated = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(privacyUpdated));

  return (
    <>
      <PageHeader title="Privacidad y datos" intro="Qué datos recoge este sitio, para qué los usamos, quién más los recibe y cómo pedir que los borremos." />

      <div className="shell max-w-3xl space-y-12 text-ink-soft">
        <p className="border border-dashed border-ink/50 p-4 text-sm text-ink">
          ⚠ Borrador provisional: debe revisarlo el asesor legal de {site.legalName} (Ley 1581 de 2012 y Decreto 1377 de 2013). Última actualización: {updated}.
        </p>

        <Section title="1. Responsable">
          <p>
            <strong className="font-medium text-ink">{site.legalName}</strong>, con sede principal en {hq.city}, {hq.country}. Contacto para temas de datos:{" "}
            <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-4">{site.email}</a> · {site.phones[0]}.
          </p>
        </Section>

        <Section title="2. Qué datos recogemos">
          <dl className="space-y-3">
            {collectedData.map((d) => (
              <div key={d.what}>
                <dt className="font-medium text-ink">{d.what}</dt>
                <dd>{d.detail}</dd>
              </div>
            ))}
          </dl>
          <p>Solo pedimos lo necesario para responderte. Los datos del formulario los recogemos únicamente con tu autorización (la casilla que marcas antes de enviar).</p>
        </Section>

        <Section title="3. Para qué los usamos">
          <ul className="list-disc space-y-1 pl-5">
            {purposes.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p>
            Los conservamos mientras dure la conversación o la relación comercial y luego los borramos.{" "}
            <span className="text-ink">⚠ Plazo exacto por confirmar con el cliente.</span>
          </p>
        </Section>

        <Section title="4. Inteligencia artificial">
          <p>
            {site.name} ofrece servicios de inteligencia artificial a sus clientes, pero <strong className="font-medium text-ink">este sitio no usa IA para procesar tus datos personales</strong>: lo
            que envías no se entrega a ningún modelo ni servicio de IA. Si eso cambia, lo indicaremos aquí y junto al formulario, con el nombre del proveedor.
          </p>
        </Section>

        <Section title="5. Servicios externos que reciben datos">
          <p>Estos terceros intervienen en el funcionamiento del sitio. Varios solo reciben datos si tú decides usarlos.</p>
          <ul className="divide-y divide-line border-y border-line">
            {thirdParties.map((t) => (
              <li key={t.name} className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
                <p className="font-medium text-ink">{t.name}</p>
                <div>
                  <p>{t.use}</p>
                  <p className="text-sm text-muted">{t.when}</p>
                  <a href={t.policy} target="_blank" rel="noopener noreferrer" className="text-sm text-ink underline underline-offset-4">
                    Su política de privacidad
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="6. Tus derechos">
          <ul className="list-disc space-y-1 pl-5">
            {rights.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p>
            Escríbenos a <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-4">{site.email}</a>. Respondemos consultas en máximo 10 días
            hábiles y reclamos en máximo 15 días hábiles.
          </p>
        </Section>

        <Section title="7. Borrar tus datos">
          <p>
            Este sitio no tiene cuentas de usuario: tus datos solo existen si nos escribiste. Puedes pedir que borremos <strong className="font-medium text-ink">todos</strong> tus
            datos cuando quieras, incluidos los que estén en los servicios anteriores cuando dependan de nosotros.
          </p>
          <a href={deleteHref} className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-sm text-paper transition-colors hover:bg-ink-soft">
            Pedir el borrado de mis datos →
          </a>
        </Section>
      </div>
    </>
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
