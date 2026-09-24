import Link from "next/link";
import { site, whatsappHref } from "@/content/site";

/** Footer mínimo: contacto directo, sedes, redes y legal. Sin CTA gigante ni columnas de enlaces. */
export function Footer() {
  const year = new Date().getFullYear();
  const social = [
    ["Instagram", site.social.instagram],
    ["YouTube", site.social.youtube],
    ["LinkedIn", site.social.linkedin],
    ["WhatsApp", whatsappHref()],
  ];
  return (
    <footer className="mt-40">
      <div className="shell grid gap-8 border-t border-line py-10 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <a href={`mailto:${site.email}`} className="link-underline">{site.email}</a>
          <ul className="mt-1 text-muted">
            {site.phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-ink">{p}</a>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-muted">{site.locations.map((l) => l.city).join(" · ")}</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-1">
          {social.map(([label, href]) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline">{label}</a>
            </li>
          ))}
        </ul>
        <p className="text-muted lg:text-right">
          © {year} {site.name} · <Link href="/privacidad" className="hover:text-ink">Privacidad</Link>
        </p>
      </div>
    </footer>
  );
}
