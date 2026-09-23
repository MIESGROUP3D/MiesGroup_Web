"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { useMounted } from "@/lib/useMounted";
import type { MediaImage } from "@/content/types";

/**
 * Galería de renders + lightbox a pantalla completa.
 * - Miniaturas optimizadas (srcset); el lightbox pide la versión grande (q=90)
 *   solo cuando se abre.
 * - Teclado: ← → navegar, Esc cerrar. Táctil: swipe (drag de Motion).
 * - Precarga la imagen siguiente y la anterior.
 */
export function Gallery({ images }: { images: MediaImage[] }) {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-4">
        {images.map((im, i) => {
          // patrón editorial: 1 grande + 2 medianas + …
          const span = i % 3 === 0 ? "col-span-2 md:col-span-12" : "col-span-1 md:col-span-6";
          return (
            <li key={im.src} className={span}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative block w-full overflow-hidden bg-ink-3"
                style={{ aspectRatio: i % 3 === 0 ? "21/9" : `${im.width}/${im.height}` }}
                aria-label={`Ampliar imagen ${i + 1} de ${images.length}: ${im.alt}`}
              >
                <Image
                  src={im.src}
                  alt={im.alt}
                  fill
                  quality={75}
                  sizes={i % 3 === 0 ? "100vw" : "(min-width: 768px) 50vw, 50vw"}
                  className="object-cover transition duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]"
                />
                <span className="absolute right-3 top-3 grid size-10 place-items-center bg-ink/60 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  <Maximize2 className="size-4" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <Lightbox images={images} index={index} setIndex={setIndex} />
    </>
  );
}

function Lightbox({ images, index, setIndex }: { images: MediaImage[]; index: number | null; setIndex: (i: number | null) => void }) {
  const mounted = useMounted();
  const [dir, setDir] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;

  const go = useCallback(
    (d: number) => {
      if (index === null) return;
      setDir(d);
      setIndex((index + d + images.length) % images.length);
    },
    [index, images.length, setIndex],
  );

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, go, setIndex]);

  if (!mounted) return null;
  const current = index !== null ? images[index] : null;

  return createPortal(
    <AnimatePresence>
      {current && index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Visor de imágenes"
          className="fixed inset-0 z-[70] bg-ink"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={current.src}
              custom={dir}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              initial={{ opacity: 0, x: dir * 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -80 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) go(1);
                else if (info.offset.x > 80) go(-1);
              }}
            >
              <Image src={current.src} alt={current.alt} fill quality={90} sizes="100vw" className="pointer-events-none select-none object-contain p-4 md:p-16" priority />
            </motion.div>
          </AnimatePresence>

          {/* precarga vecinas */}
          <div className="hidden" aria-hidden>
            {[1, -1].map((d) => {
              const n = images[(index + d + images.length) % images.length];
              return <Image key={d} src={n.src} alt="" width={16} height={10} sizes="100vw" quality={90} />;
            })}
          </div>

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <p className="font-mono text-xs uppercase tracking-widest text-bone-dim">
              {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </p>
            <button ref={closeRef} type="button" onClick={() => setIndex(null)} aria-label="Cerrar visor" className="grid size-12 place-items-center border border-line bg-ink/60 hover:border-bronze hover:text-bronze">
              <X className="size-6" />
            </button>
          </div>
          <p className="absolute inset-x-0 bottom-0 p-4 text-center text-sm text-bone-dim">{current.alt}</p>
          {[
            { d: -1, Icon: ChevronLeft, label: "Anterior", pos: "left-4" },
            { d: 1, Icon: ChevronRight, label: "Siguiente", pos: "right-4" },
          ].map(({ d, Icon, label, pos }) => (
            <button key={d} type="button" onClick={() => go(d)} aria-label={label} className={cn("absolute top-1/2 hidden size-14 -translate-y-1/2 place-items-center border border-line bg-ink/60 hover:border-bronze hover:text-bronze md:grid", pos)}>
              <Icon className="size-6" />
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
