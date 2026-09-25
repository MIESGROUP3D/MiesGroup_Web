import Image from "next/image";
import { ProjectLink } from "@/components/ProjectLink";
import { TickerY } from "@/components/TickerY";
import { VideoFacade } from "@/components/VideoFacade";
import { getChannelVideos } from "@/content/channel";
import { getConferences } from "@/content/conferences";
import { img } from "@/content/media";
import { getSortedProjects } from "@/content/projects";
import { site, siteText } from "@/content/site";
import { t } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { pageMeta } from "./meta";

// pósteres placeholder para los videos de Vimeo (Vimeo no expone miniatura sin API)
const posters = ["torre-aurora/01", "pabellon-lago/03", "terrazas-del-valle/02", "centro-empresarial-norte/04"].map((p) => img(`/media/projects/${p}.jpg`, ""));

export const studioMeta = (lang: Locale) => pageMeta(lang, "studio", { title: t(lang).studio.title, description: t(lang).studio.description });

/**
 * Estudio = "About us" + Channel + Conferencias del sitio actual, en una sola
 * página con tres partes y accesos arriba (#estudio, #channel, #conferencias).
 */
export function StudioView({ lang }: { lang: Locale }) {
  const ui = t(lang);
  const text = siteText(lang);
  const [firstVideo, ...moreVideos] = getChannelVideos(lang);
  const talks = [...getConferences(lang)].sort((a, b) => b.date.localeCompare(a.date));
  const fmt = new Intl.DateTimeFormat(lang === "en" ? "en-US" : "es-CO", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
  const parts = [
    { id: "estudio", label: ui.studio.title },
    { id: "channel", label: ui.studio.channel },
    { id: "conferencias", label: ui.studio.conferences },
  ];

  return (
    <div lang={lang} className="shell pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h1 className="display text-3xl md:text-4xl">{ui.studio.title}</h1>
        <nav aria-label={ui.common.inPage} className="flex flex-wrap gap-2">
          {parts.map((p) => (
            <a key={p.id} href={`#${p.id}`} className="rounded-full border border-line-strong px-4 py-1.5 text-sm transition-colors hover:border-ink">
              {p.label}
            </a>
          ))}
        </nav>
      </div>

      {/* 1. Quiénes somos */}
      <section id="estudio" aria-label={ui.studio.about} className="mt-10 grid scroll-mt-20 gap-10 md:grid-cols-2 md:gap-6">
        <div>
          <div className="space-y-4 text-lg leading-relaxed md:max-w-xl md:text-xl">
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

      {/* 2. Channel */}
      <section id="channel" aria-labelledby="h-channel" className="mt-24 scroll-mt-20 border-t border-line pt-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="h-channel" className="display text-2xl md:text-3xl">{ui.studio.channel}</h2>
            <p className="mt-1 text-ink-soft">{ui.studio.channelIntro}</p>
          </div>
          <a href={site.social.youtube} target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4 hover:no-underline">
            {ui.studio.subscribe}
          </a>
        </div>
        <div className="mt-8">
          <VideoFacade video={firstVideo} fallbackPoster={posters[0]} sizes="100vw" />
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {moreVideos.map((v, i) => (
              <li key={"id" in v ? v.id : v.src}>
                <VideoFacade video={v} fallbackPoster={posters[(i + 1) % posters.length]} sizes="(min-width: 768px) 33vw, 100vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Conferencias */}
      <section id="conferencias" aria-labelledby="h-conferencias" className="mt-24 scroll-mt-20 border-t border-line pt-6">
        <h2 id="h-conferencias" className="display text-2xl md:text-3xl">{ui.studio.conferences}</h2>
        <p className="mt-1 text-ink-soft">{ui.studio.conferencesIntro}</p>
        <ol className="mt-8 border-t border-line">
          {talks.map((c) => (
            <li key={c.date} className="grid gap-2 border-b border-line py-6 md:grid-cols-12 md:gap-4">
              <time dateTime={c.date} className="text-sm text-muted md:col-span-2">{fmt.format(new Date(c.date))}</time>
              <div className="md:col-span-7">
                <h3 className="text-lg font-medium md:text-xl">{c.title}</h3>
                <p className="mt-1 text-ink-soft">{c.summary}</p>
              </div>
              <p className="text-sm text-muted md:col-span-3 md:text-right">
                {c.event}
                <br />
                {c.city}
              </p>
            </li>
          ))}
        </ol>
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
