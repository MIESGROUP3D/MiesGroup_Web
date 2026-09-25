"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site, siteText, whatsappHref } from "@/content/site";
import { t } from "@/content/ui";
import { localeFromPath, route } from "@/lib/i18n";

/** Footer mínimo: contacto directo, sedes, redes y legal. No aparece en el inicio (pantalla única, sin scroll). */
export function Footer() {
  const path = usePathname().replace(/\/$/, "") || "/";
  const lang = localeFromPath(path);
  if (path === route(lang, "home")) return null;
  const year = new Date().getFullYear();
  const social = [
    ["Instagram", site.social.instagram],
    ["YouTube", site.social.youtube],
    ["LinkedIn", site.social.linkedin],
    ["WhatsApp", whatsappHref(siteText(lang).whatsappMessage)],
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
          © {year} {site.name} · <Link href={route(lang, "privacy")} className="hover:text-ink">{t(lang).common.privacy}</Link>
        </p>
      </div>
    </footer>
  );
}
