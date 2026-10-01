import { TalksHero } from "@/components/TalksHero";
import { VideoFacade } from "@/components/VideoFacade";
import { getTalks, getTalksCopy } from "@/content/conferences";
import { whatsappHref } from "@/content/site";
import { t } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { pageMeta } from "./meta";

export const talksMeta = (lang: Locale) => pageMeta(lang, "talks", { title: t(lang).studio.conferences, description: getTalksCopy(lang).body[0] });

/**
 * Talks / Conferencias como "escenario": la conferencia de fondo en bucle con el
 * titular encima (TalksHero); debajo, el texto, los videos y el llamado a WhatsApp.
 * Contenido de la página anterior (miesgroup3d.com/conferencias). Se abre desde Studio.
 */
export function TalksView({ lang }: { lang: Locale }) {
  const ui = t(lang);
  const copy = getTalksCopy(lang);
  const [featured, ...more] = getTalks(lang);

  return (
    <div lang={lang}>
      {featured.video.provider === "vimeo" && featured.poster && (
        <TalksHero
          video={featured.video}
          poster={featured.poster}
          label={ui.studio.conferences}
          headline={copy.headline}
          cta={copy.heroCta}
        />
      )}

      <div className="shell">
        {/* Texto */}
        <section className="grid gap-6 py-16 md:grid-cols-12 md:py-24">
          <p className="text-2xl leading-snug md:col-span-6 md:text-3xl">{copy.body[0]}</p>
          <div className="space-y-4 leading-relaxed text-ink-soft md:col-span-5 md:col-start-8 md:pt-2 md:text-lg">
            {copy.body.slice(1).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        {/* Videos */}
        <section aria-labelledby="h-videos" className="border-t border-line pt-6">
          <h2 id="h-videos" className="text-xs uppercase tracking-[0.14em] text-muted">
            {copy.videosTitle}
          </h2>
          <ul className="mt-6 grid gap-10 md:grid-cols-2 md:gap-6">
            {[featured, ...more].map((talk) => (
              <li key={talk.title}>
                <VideoFacade video={talk.video} fallbackPoster={talk.poster} sizes="(min-width: 768px) 50vw, 100vw" />
                <p className="mt-3 text-sm text-muted">{talk.event}</p>
                <h3 className="mt-0.5 text-lg font-medium leading-snug md:text-xl">{talk.title}</h3>
              </li>
            ))}
          </ul>
        </section>

        {/* Llamado a la acción */}
        <section className="mt-20 grid gap-6 border-t border-line pt-8 md:mt-24 md:grid-cols-12 md:items-end">
          <p className="text-xl leading-snug md:col-span-8 md:text-2xl">{copy.cta}</p>
          <div className="md:col-span-4 md:text-right">
            <a
              href={whatsappHref(copy.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-paper transition-colors hover:bg-ink-soft"
            >
              {copy.ctaButton} <span aria-hidden>→</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
