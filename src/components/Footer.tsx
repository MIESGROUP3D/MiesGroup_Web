import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site, whatsappHref } from "@/content/site";
import { services } from "@/content/services";
import { InstagramIcon, LinkedinIcon, WhatsappIcon, YoutubeIcon } from "./icons";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-32 border-t border-line bg-ink-2">
      <div className="shell">
        {/* CTA gigante */}
        <Link href="/contacto" className="group block border-b border-line py-16 md:py-24">
          <p className="eyebrow mb-6">¿Tienes un proyecto?</p>
          <p className="display flex flex-wrap items-end gap-x-6 text-[clamp(3.2rem,11vw,11rem)] transition-colors group-hover:text-bronze">
            Hagámoslo existir
            <ArrowUpRight className="mb-[0.12em] size-[0.7em] transition-transform duration-500 group-hover:-translate-y-2 group-hover:translate-x-2" strokeWidth={1.2} />
          </p>
        </Link>

        <div className="grid gap-12 py-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">{site.description}</p>
            <div className="mt-8 flex gap-2">
              {[
                { href: site.social.youtube, label: "YouTube", Icon: YoutubeIcon },
                { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
                { href: site.social.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
                { href: whatsappHref(), label: "WhatsApp", Icon: WhatsappIcon },
              ].map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-11 place-items-center border border-line transition-colors hover:border-bronze hover:text-bronze">
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Servicios" className="md:col-span-3">
            <p className="eyebrow mb-5">Servicios</p>
            <ul className="space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/servicios/${s.slug}`} className="link-underline text-bone-dim hover:text-bone">{s.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Estudio" className="md:col-span-2">
            <p className="eyebrow mb-5">Estudio</p>
            <ul className="space-y-2.5 text-sm">
              {[
                ["Proyectos", "/proyectos"],
                ["Videojuegos", "/videojuegos"],
                ["Channel", "/channel"],
                ["Conferencias", "/conferencias"],
                ["Nosotros", "/nosotros"],
                ["Trabaja con nosotros", "/nosotros#trabaja"],
              ].map(([l, h]) => (
                <li key={h}>
                  <Link href={h} className="link-underline text-bone-dim hover:text-bone">{l}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="eyebrow mb-5">Sedes</p>
            <ul className="space-y-2.5 text-sm text-bone-dim">
              {site.locations.map((l) => (
                <li key={l.code} className="flex items-baseline justify-between gap-4 border-b border-line pb-2.5">
                  <span>{l.city}, {l.country}</span>
                  <span className="font-mono text-xs text-muted">{l.code}{"hq" in l && l.hq ? " · HQ" : ""}</span>
                </li>
              ))}
            </ul>
            <ul className="mt-6 space-y-1.5 font-mono text-sm">
              {site.phones.map((p) => (
                <li key={p}><a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-bronze">{p}</a></li>
              ))}
              <li><a href={`mailto:${site.email}`} className="hover:text-bronze">{site.email}</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-6 text-xs text-muted md:flex-row md:justify-between">
          <p>© {site.foundedYear}–{year} {site.legalName}. Todos los derechos reservados.</p>
          <p className="flex gap-6">
            <Link href="/privacidad" className="hover:text-bone">Política de privacidad y datos</Link>
            <span className="font-mono uppercase tracking-widest">{site.tagline}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
