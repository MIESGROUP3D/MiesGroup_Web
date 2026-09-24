import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { VideoFacade } from "@/components/VideoFacade";
import { YoutubeIcon } from "@/components/icons";
import { channelVideos } from "@/content/channel";
import { img } from "@/content/media";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Channel", description: "Reels, making-of y recorridos del estudio MIES Group." };

const posters = ["torre-aurora/01", "pabellon-lago/03", "terrazas-del-valle/02", "centro-empresarial-norte/04"].map((p) => img(`/media/projects/${p}.jpg`, ""));

export default function ChannelPage() {
  const [first, ...rest] = channelVideos;
  return (
    <>
      <PageHeader
       
        title="Channel"
        intro="Reels, animaciones y making-of del estudio."
        meta={
          <a href={site.social.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 border border-line px-5 py-3 text-sm hover:border-ink hover:text-ink">
            <YoutubeIcon className="size-5" /> Suscribirse en YouTube <ArrowUpRight className="size-4" />
          </a>
        }
      />
      <section className="shell">
        <VideoFacade video={first} fallbackPoster={posters[0]} sizes="100vw" />
        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {rest.map((v, i) => (
            <Reveal as="li" key={i} delay={i * 0.08}>
              <VideoFacade video={v} fallbackPoster={posters[(i + 1) % posters.length]} sizes="(min-width: 768px) 33vw, 100vw" />
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
