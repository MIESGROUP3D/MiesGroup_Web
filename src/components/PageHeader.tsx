import Image from "next/image";
import Link from "next/link";
import type { MediaImage } from "@/content/types";
import { Reveal } from "./Reveal";

/** Cabecera de páginas internas: migas, título gigante y (opcional) render de fondo. */
export function PageHeader({
  crumbs,
  title,
  intro,
  image,
  meta,
}: {
  crumbs: { label: string; href?: string }[];
  title: React.ReactNode;
  intro?: string;
  image?: MediaImage;
  meta?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden pt-36 md:pt-44">
      {image && (
        <>
          <Image src={image.src} alt="" fill priority quality={60} sizes="100vw" className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/70 to-ink" />
        </>
      )}
      <div className="blueprint pointer-events-none absolute inset-0 opacity-30" />
      <div className="shell relative pb-14 md:pb-20">
        <nav aria-label="Migas de pan" className="eyebrow">
          <ol className="flex flex-wrap gap-2">
            <li><Link href="/" className="hover:text-bone">Inicio</Link></li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex gap-2">
                <span aria-hidden>/</span>
                {c.href ? <Link href={c.href} className="hover:text-bone">{c.label}</Link> : <span aria-current="page" className="text-bone">{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <Reveal>
          <h1 className="display mt-8 text-[clamp(3.4rem,12vw,12rem)]">{title}</h1>
        </Reveal>
        {(intro || meta) && (
          <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-12">
            {intro && <p className="text-lg leading-relaxed text-bone-dim md:col-span-6 md:text-xl">{intro}</p>}
            {meta && <div className="md:col-span-5 md:col-start-8">{meta}</div>}
          </div>
        )}
      </div>
    </header>
  );
}
