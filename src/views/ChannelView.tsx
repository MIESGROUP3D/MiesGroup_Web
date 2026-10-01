import { ChannelReels } from "@/components/ChannelReels";
import { getChannelVideos } from "@/content/channel";
import { site } from "@/content/site";
import { t } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { pageMeta } from "./meta";

export const channelMeta = (lang: Locale) => pageMeta(lang, "channel", { title: t(lang).studio.channel, description: t(lang).studio.channelIntro });

/**
 * Channel: página negra con los videos del canal de YouTube como "Media Reels"
 * (ChannelReels). Variantes anteriores: ChannelCarousel (carrusel de cine) y ChannelPlayer (destacado + lista).
 * Se abre desde Studio.
 */
export function ChannelView({ lang }: { lang: Locale }) {
  const ui = t(lang);

  return (
    <div lang={lang}>
      <section className="bg-ink pb-8 text-paper md:pb-10" aria-labelledby="h-channel">
        <div className="shell pt-6">
          <div className="flex flex-col gap-3 pb-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 id="h-channel" className="display text-4xl md:text-6xl">
                {ui.studio.channel}
              </h1>
              <p className="mt-2 text-paper/70">{ui.studio.channelIntro}</p>
            </div>
            <a
              href={site.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit rounded-full border border-paper/30 px-5 py-2.5 text-sm transition-colors hover:bg-paper hover:text-ink"
            >
              {ui.studio.subscribe}
            </a>
          </div>
        </div>
        {/* reels de borde a borde: las tarjetas vecinas asoman por los lados */}
        <ChannelReels videos={getChannelVideos(lang)} />
      </section>
      <div aria-hidden className="fade-to-paper h-20 md:h-28" />
    </div>
  );
}
