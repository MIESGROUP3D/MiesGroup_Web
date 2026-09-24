import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { sortedProjects } from "@/content/projects";
import { services } from "@/content/services";
import { whatsappHref } from "@/content/site";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Renders 3D, animación CGI, tours 360°, realidad virtual, Web3D e IA para proyectos de arquitectura.",
};

/**
 * Los 6 servicios en una sola página (antes eran 6 páginas). Cada bloque tiene
 * un ancla (#3d-rendering…) a la que redirigen las URLs viejas (next.config.ts).
 */
export default function ServicesPage() {
  return (
    <div className="shell pt-6">
      <h1 className="display text-3xl md:text-4xl">Servicios</h1>

      <ol className="mt-10 space-y-20 md:space-y-28">
        {services.map((s, i) => {
          const count = sortedProjects.filter((p) => p.services.includes(s.slug)).length;
          return (
            <li key={s.slug} id={s.slug} className="grid scroll-mt-20 gap-6 md:grid-cols-2">
              <div className="relative aspect-[3/2] bg-paper-2">
                <Image src={s.cover.src} alt={s.cover.alt} fill quality={75} sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" priority={i === 0} />
              </div>
              <div className="flex flex-col md:max-w-lg">
                <p className="text-muted">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="display mt-1 text-2xl md:text-3xl">{s.name}</h2>
                <p className="mt-3 text-ink-soft">{s.tagline}</p>
                <p className="mt-4 text-sm text-muted">{s.deliverables.join(" · ")}</p>
                <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                  {count > 0 && (
                    <Link href={`/?servicio=${s.slug}`} className="underline underline-offset-4 hover:no-underline">
                      Ver {count} {count === 1 ? "proyecto" : "proyectos"} →
                    </Link>
                  )}
                  <a
                    href={whatsappHref(`Hola MIES Group, me interesa el servicio de ${s.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-ink"
                  >
                    Cotizar por WhatsApp
                  </a>
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
