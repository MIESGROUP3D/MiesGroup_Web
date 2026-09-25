"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { navigateWithCurtain } from "@/lib/curtain";
import type { MediaImage } from "@/content/types";

export type AccordionPanel = {
  key: string;
  title: string;
  description: string;
  /** etiqueta opcional arriba a la derecha, p. ej. "Desde 2015" */
  tag?: string;
  cta: string;
  href: string;
  image: MediaImage;
};

/**
 * Inicio a pantalla completa, sin scroll (ref. Framer "Hover Accordion").
 *
 * - Escritorio: paneles lado a lado; el señalado (mouse o teclado) se expande
 *   (flex-grow) y muestra título, descripción, etiqueta y "Ver →". Los demás
 *   quedan angostos con el nombre en vertical. Siempre hay uno abierto.
 * - Móvil: paneles apilados; el primer toque abre el panel y el segundo entra.
 * - Clic en un panel abierto → su página (servicio filtrado, Estudio, Contacto),
 *   con la cortina negra naciendo del panel (PageCurtain).
 * - Transiciones solo con CSS (flex-grow, opacidad); movimiento reducido las
 *   anula con la regla global.
 */
export function HomeAccordion({ panels, label }: { panels: AccordionPanel[]; label: string }) {
  const [active, setActive] = useState(0);
  const lastPointer = useRef<string>("mouse");

  return (
    <nav aria-label={label} className="flex h-[100svh] min-h-[520px] flex-col gap-px bg-ink md:flex-row">
      {panels.map((p, i) => {
        const open = i === active;
        return (
          <Link
            key={p.key}
            href={p.href}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
            onPointerDown={(e) => (lastPointer.current = e.pointerType)}
            onFocus={() => setActive(i)}
            onClick={(e) => {
              // en pantallas táctiles el primer toque solo abre el panel
              if (!open && lastPointer.current !== "mouse") {
                e.preventDefault();
                setActive(i);
                return;
              }
              // entrar: la cortina negra nace del panel tocado y cubre la pantalla
              navigateWithCurtain(e, p.href, e.currentTarget);
            }}
            aria-label={`${p.title}: ${p.description}`}
            className={cn(
              "group relative min-h-0 min-w-0 overflow-hidden text-paper outline-offset-[-4px]",
              "transition-[flex-grow] duration-700 ease-[cubic-bezier(.39,.14,.26,1)]",
              open ? "flex-[5_1_0%] md:flex-[6_1_0%]" : "flex-[1_1_0%]",
            )}
          >
            <Image
              src={p.image.src}
              alt=""
              fill
              priority={i < 3}
              quality={75}
              sizes="(min-width: 768px) 60vw, 100vw"
              className={cn(
                "object-cover transition-[transform,filter] duration-1000 ease-[cubic-bezier(.39,.14,.26,1)]",
                open ? "scale-100 brightness-100" : "scale-110 brightness-[0.55]",
              )}
            />
            {/* degradado oscuro para leer el texto */}
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/30" />

            {/* cerrado: nombre (vertical en escritorio) */}
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center gap-3 px-5 transition-opacity duration-300 md:flex-col md:items-start md:justify-end md:px-0 md:pb-8",
                open ? "opacity-0" : "opacity-100 delay-200",
              )}
            >
              <span className="text-base font-medium md:mx-auto md:rotate-180 md:text-lg md:[writing-mode:vertical-rl]">{p.title}</span>
            </span>

            {/* abierto: etiqueta, título, descripción y llamada a la acción */}
            <span
              className={cn(
                "pointer-events-none absolute inset-0 flex flex-col justify-end p-5 transition-all duration-500 md:p-10",
                open ? "translate-y-0 opacity-100 delay-300" : "translate-y-4 opacity-0",
              )}
            >
              {p.tag && (
                <span className="absolute right-5 top-20 rounded-full border border-paper/40 bg-ink/30 px-3 py-1 text-xs backdrop-blur md:right-10 md:top-24">
                  {p.tag}
                </span>
              )}
              <span className="text-3xl font-medium leading-none tracking-[-0.035em] md:text-6xl">{p.title}</span>
              <span className="mt-3 max-w-md text-sm text-paper/80 md:text-base">{p.description}</span>
              <span className="mt-5 inline-flex w-fit items-center gap-2 border-b border-paper/60 pb-1 text-sm font-medium">
                {p.cta} <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
