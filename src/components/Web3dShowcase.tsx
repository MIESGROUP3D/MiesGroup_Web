"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { withBase } from "@/lib/basePath";
import { useLang } from "@/lib/useLang";
import { web3d } from "@/content/web3d";

/**
 * Categoría Web3D (sobre el fondo negro de Proyectos), con el contenido de la página
 * anterior: texto, video explicativo (con sonido, se reproduce al pulsar), ventajas en
 * filas alternadas con un clip cada una (en bucle y sin sonido al verse en pantalla)
 * y extras en tres columnas.
 */
export function Web3dShowcase() {
  const lang = useLang();
  const tx = (v: Record<string, string>) => v[lang];

  return (
    <div className="text-paper">
      {/* Texto + puntos clave */}
      <section className="grid gap-8 px-1 py-12 md:grid-cols-12 md:gap-6 md:px-4 md:py-16">
        <p className="text-2xl leading-snug md:col-span-6 md:text-3xl">{tx(web3d.intro[0])}</p>
        <ul className="space-y-4 md:col-span-5 md:col-start-8">
          {web3d.highlights.map((h) => (
            <li key={h.es} className="flex gap-3 border-t border-paper/15 pt-4 text-paper/80">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-paper" />
              {tx(h)}
            </li>
          ))}
        </ul>
      </section>

      {/* Video explicativo (con sonido: el visitante decide cuándo verlo) */}
      <video
        src={withBase(web3d.video.src)}
        poster={withBase(web3d.video.poster)}
        controls
        playsInline
        preload="none"
        className="aspect-video w-full bg-ink-soft object-cover"
      />

      {/* Tipologías */}
      <section className="grid items-center gap-6 py-12 md:grid-cols-12 md:py-16">
        <div className="md:col-span-7">
          <InViewVideo src={web3d.typologies.video} poster={web3d.typologies.poster} className="aspect-video" />
        </div>
        <p className="px-1 leading-relaxed text-paper/80 md:col-span-5 md:px-4 md:text-lg">{tx(web3d.intro[1])}</p>
      </section>

      {/* Ventajas: filas alternadas */}
      <section aria-labelledby="h-ventajas" className="border-t border-paper/15 pt-10 md:pt-14">
        <h2 id="h-ventajas" className="display px-1 text-3xl md:px-4 md:text-5xl">
          {tx(web3d.featuresTitle)}
        </h2>
        <ol className="mt-10 space-y-12 md:mt-14 md:space-y-16">
          {web3d.features.map((f, i) => (
            <li key={f.title.es} className="grid items-center gap-6 md:grid-cols-12">
              <div className={cn("md:col-span-7", i % 2 === 1 && "md:order-2 md:col-start-6")}>
                {f.video && <InViewVideo src={f.video} poster={f.poster} className="aspect-video" />}
              </div>
              <div className={cn("px-1 md:col-span-5 md:px-4", i % 2 === 1 && "md:order-1 md:col-start-1")}>
                <p className="text-sm tabular-nums text-paper/40">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-2xl font-medium leading-tight md:text-3xl">{tx(f.title)}</h3>
                <p className="mt-3 leading-relaxed text-paper/75">{tx(f.text)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Extras */}
      <section className="mt-16 grid gap-6 border-t border-paper/15 px-1 pt-8 md:mt-20 md:grid-cols-3 md:px-4">
        {web3d.extras.map((x) => (
          <div key={x.title.es}>
            <h3 className="text-lg font-medium">{tx(x.title)}</h3>
            <p className="mt-2 text-paper/70">{tx(x.text)}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

/**
 * Clip en bucle y sin sonido que arranca al verse en pantalla y se pausa al salir
 * (sigue donde iba). preload="none": un clip que nunca se ve no se descarga.
 */
function InViewVideo({ src, poster, className }: { src: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = setTimeout(() => setReduced(true));
      return () => clearTimeout(id);
    }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.4 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={reduced ? undefined : withBase(src)}
      poster={poster ? withBase(poster) : undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      className={cn("w-full bg-ink-soft object-cover", className)}
    />
  );
}
