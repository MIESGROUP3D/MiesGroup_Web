import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Política de privacidad y datos" };

export default function PrivacyPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Privacidad" }]} title={<>Privacidad<br />y datos</>} />
      <section className="shell max-w-3xl space-y-6 text-bone-dim">
        <p className="border border-dashed border-bronze/60 p-4 font-mono text-xs uppercase tracking-widest text-bronze">
          ⚠ Texto provisional. Reemplazar por la política vigente del cliente (miesgroup3d.com/privacy-and-data-policy), revisada por su asesor legal (Ley 1581 de 2012, Colombia).
        </p>
        <p>{site.legalName} trata los datos personales que envías a través de este sitio (nombre, correo, teléfono y mensaje) únicamente para responder tu solicitud y dar seguimiento comercial.</p>
        <p>Puedes solicitar la consulta, actualización o eliminación de tus datos escribiendo a {site.email}.</p>
      </section>
    </>
  );
}
