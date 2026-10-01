import Image from "next/image";
import { ProjectLink } from "@/components/ProjectLink";
import { TickerY } from "@/components/TickerY";
import { CurtainLink } from "@/components/CurtainLink";
import { LinkedinIcon } from "@/components/icons";
import { getSortedProjects } from "@/content/projects";
import { getTeam, initials } from "@/content/team";
import { site, siteText } from "@/content/site";
import { t } from "@/content/ui";
import { cn } from "@/lib/cn";
import { route, type Locale } from "@/lib/i18n";
import { pageMeta } from "./meta";


export const studioMeta = (lang: Locale) => pageMeta(lang, "studio", { title: t(lang).studio.title, description: t(lang).studio.description });

/**
 * Estudio = "About us" + Equipo, con accesos arriba: #estudio y #equipo bajan en
 * la página; Channel y Talks abren su propia página (/channel, /talks).
 */
export function StudioView({ lang }: { lang: Locale }) {
  const ui = t(lang);
  const text = siteText(lang);
  // dos grupos: lo que baja en esta página (texto ↓) y lo que abre otra página (píldoras negras ↗)
  const inPage = [
    { href: "#estudio", label: ui.studio.about },
    { href: "#equipo", label: ui.studio.team },
  ];
  const pages = [
    { href: `${route(lang, "channel")}/`, label: ui.studio.channel },
    { href: `${route(lang, "talks")}/`, label: ui.studio.conferences },
  ];
  const team = getTeam(lang);
  const founders = team.filter((m) => m.founder);
  const crew = team.filter((m) => !m.founder);

  return (
    <div lang={lang} className="shell pt-6">
      {/* 1. Quiénes somos */}
      <section id="estudio" aria-label={ui.studio.about} className="grid scroll-mt-20 gap-10 md:grid-cols-2 md:gap-6">
        {/* título + accesos + texto, centrados en vertical respecto al carrusel de proyectos */}
        <div className="md:self-center md:pr-6">
          <h1 className="display text-4xl md:text-5xl">{ui.studio.title}</h1>
          <nav aria-label={ui.common.inPage} className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
            {inPage.map((p) => (
              <a key={p.href} href={p.href} className="group inline-flex items-center gap-1.5 text-ink-soft transition-colors hover:text-ink">
                {p.label}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
              </a>
            ))}
            <span aria-hidden className="h-5 w-px bg-line-strong" />
            {pages.map((p) => (
              <CurtainLink
                key={p.href}
                href={p.href}
                className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-paper transition-colors hover:bg-ink-soft"
              >
                {p.label}
                <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
              </CurtainLink>
            ))}
          </nav>
          <div className="mt-10 space-y-4 text-lg leading-relaxed md:max-w-xl md:text-xl">
            {text.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <dl className="mt-10 grid content-start gap-x-6 gap-y-1 sm:grid-cols-[8rem_1fr]">
            <dt className="text-muted">{ui.studio.founded}</dt>
            <dd>{site.foundedYear}, Córdoba (AR)</dd>
            <dt className="text-muted">{ui.studio.offices}</dt>
            <dd>{text.locations.map((l) => `${l.city} (${l.code})`).join(", ")}</dd>
            <dt className="text-muted">{ui.studio.contact}</dt>
            <dd>
              <a href={`mailto:${site.email}`} className="underline underline-offset-4 hover:no-underline">{site.email}</a>
            </dd>
          </dl>
        </div>

        {/* Ticker vertical: el trabajo del estudio pasando junto al texto */}
        <TickerY className="h-[30rem] md:h-[40rem]">
          {getSortedProjects(lang).map((p) => (
            <ProjectLink key={p.slug} slug={p.slug} className="group block pb-6">
              <div className="relative aspect-[3/2] bg-paper-2">
                <Image src={p.cover.src} alt={p.cover.alt} fill quality={70} sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
              <p className="mt-2 flex justify-between gap-4 text-sm">
                <span className="font-medium group-hover:underline group-hover:underline-offset-4">{p.title}</span>
                <span className="text-muted">{p.year}</span>
              </p>
            </ProjectLink>
          ))}
        </TickerY>
      </section>

      {/* 2. Equipo en marco circular: socios fundadores arriba, centrados y grandes; el resto del equipo debajo */}
      <section id="equipo" aria-labelledby="h-equipo" className="mt-24 scroll-mt-20 border-t border-line pt-6">
        <h2 id="h-equipo" className="display text-2xl md:text-3xl">{ui.studio.team}</h2>
        <p className="mt-1 text-ink-soft">{ui.studio.teamIntro}</p>
        <ul className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-12 md:gap-x-24">
          {founders.map((m) => (
            <TeamMember key={m.name} member={m} big />
          ))}
        </ul>
        <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {crew.map((m) => (
            <TeamMember key={m.name} member={m} />
          ))}
        </ul>
      </section>

      <section id="trabaja" className="mt-24 grid scroll-mt-20 gap-6 border-t border-line pt-6 md:grid-cols-2">
        <h2 className="text-muted">{ui.studio.join}</h2>
        <p className="md:max-w-xl">
          {ui.studio.joinText}{" "}
          <a href={`mailto:${site.email}?subject=${encodeURIComponent(ui.studio.joinSubject)}`} className="underline underline-offset-4 hover:no-underline">
            {ui.studio.joinCta}
          </a>
          .
        </p>
      </section>
    </div>
  );
}

/** Persona del equipo: foto circular (blanco y negro, color al pasar el mouse) o iniciales si aún no hay foto. */
function TeamMember({ member: m, big = false }: { member: ReturnType<typeof getTeam>[number]; big?: boolean }) {
  const body = (
    <>
      <div className={cn("relative grid place-items-center overflow-hidden rounded-full bg-paper-2 ring-1 ring-line transition-shadow", m.linkedin && "group-hover:ring-ink", big ? "size-36 sm:size-48 md:size-60" : "size-24 md:size-28")}>
        {m.photo ? (
          <Image
            src={m.photo.src}
            alt={m.photo.alt}
            fill
            quality={80}
            sizes={big ? "240px" : "112px"}
            className="object-cover object-top grayscale transition-[filter,transform] duration-500 group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <span aria-hidden className="text-lg font-medium tracking-[0.08em] text-muted md:text-xl">
            {initials(m.name)}
          </span>
        )}
      </div>
      <p className={cn("mt-4 inline-flex items-center gap-1.5 font-medium", big ? "text-lg md:text-xl" : "text-sm md:text-base", m.linkedin && "group-hover:underline group-hover:underline-offset-4")}>
        {m.name}
        {m.linkedin && <LinkedinIcon className="size-3.5 shrink-0 text-muted transition-colors group-hover:text-ink" />}
      </p>
      <p className={cn("text-muted", big ? "text-sm md:text-base" : "text-xs md:text-sm")}>{m.role}</p>
    </>
  );
  const align = "group flex flex-col items-center text-center";
  return (
    <li className={m.linkedin ? undefined : align}>
      {/* con LinkedIn: toda la persona (foto + nombre) es el enlace, en pestaña nueva */}
      {m.linkedin ? (
        <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} — LinkedIn`} className={align}>
          {body}
        </a>
      ) : (
        body
      )}
    </li>
  );
}
