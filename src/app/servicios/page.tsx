import type { Metadata } from "next";
import { ServiceGrid } from "@/components/ServiceGrid";
import { sortedProjects } from "@/content/projects";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Renders 3D, animación CGI, tours 360°, realidad virtual, Web3D e IA para proyectos de arquitectura.",
};

/**
 * Los 6 servicios en una grilla; cada uno se abre en un modal con su detalle.
 * Las URLs viejas (/3d-rendering, /servicios/web3d…) llegan como /servicios#slug
 * y abren el modal correspondiente (next.config.ts).
 */
export default function ServicesPage() {
  const counts = Object.fromEntries(services.map((s) => [s.slug, sortedProjects.filter((p) => p.services.includes(s.slug)).length]));
  return (
    <div className="shell pt-6">
      <h1 className="display text-3xl md:text-4xl">Servicios</h1>
      <div className="mt-10">
        <ServiceGrid services={services} counts={counts} />
      </div>
    </div>
  );
}
