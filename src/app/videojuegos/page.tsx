import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { VideoFacade } from "@/components/VideoFacade";
import { gameVideos, games } from "@/content/games";
import { img } from "@/content/media";

export const metadata: Metadata = {
  title: "Videojuegos",
  description: "Videojuegos y experiencias interactivas desarrolladas por MIES Group, jugables en el navegador.",
};

// pósteres placeholder para los videos de Vimeo (Vimeo no expone miniatura sin API)
const posters = [
  img("/media/projects/torre-aurora/02.jpg", ""),
  img("/media/projects/edificio-cumbre/03.jpg", ""),
  img("/media/projects/terrazas-del-valle/04.jpg", ""),
  img("/media/projects/casa-mirador/01.jpg", ""),
];

export default function GamesPage() {
  return (
    <>
      <PageHeader
       
        title="Videojuegos"
        intro="Experiencias interactivas que corren directamente en el navegador, sin instalar nada."
      />

      <section className="shell" aria-label="Juegos">
        <ul className="grid gap-8">
          {games.map((g) => (
            <li key={g.slug}>
              <Link href={`/videojuegos/${g.slug}`} className="group grid overflow-hidden border border-line bg-paper-2 md:grid-cols-12">
                <div className="relative aspect-video md:col-span-8">
                  <Image src={g.cover.src} alt={g.cover.alt} fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover transition duration-[1.2s] group-hover:scale-[1.03]" />
                </div>
                <div className="flex flex-col justify-between gap-8 p-6 md:col-span-4 md:p-10">
                  <div>
                    <p className="eyebrow text-ink">{g.status === "jugable" ? "Jugable" : "Próximamente"} · {g.engine.toUpperCase()}</p>
                    <h2 className="display mt-2 text-2xl transition-colors group-hover:text-ink">{g.title}</h2>
                    <p className="mt-4 text-ink-soft">{g.summary}</p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-3 bg-ink px-6 py-4 text-sm text-paper">
                    Jugar <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell mt-16" aria-labelledby="h-videos">
        <p className="eyebrow border-t border-line pt-6">Galería</p>
        <h2 id="h-videos" className="display mt-2 text-2xl md:text-3xl">Gameplay y trailers</h2>
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {gameVideos.map((v, i) => (
            <Reveal as="li" key={i} delay={(i % 2) * 0.1}>
              <VideoFacade video={v} fallbackPoster={posters[i % posters.length]} />
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
