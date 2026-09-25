"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { LOCALES, localeFromPath, switchLocalePath, type Locale } from "@/lib/i18n";
import { t } from "@/content/ui";
import { FlagCO, FlagUS } from "./Flags";

const NAMES = { es: "Español", en: "English" } as const;
const FLAGS = { es: FlagCO, en: FlagUS } as const;

/**
 * Selector de idioma con banderas (Colombia = español, EE. UU. = inglés).
 * Lleva a la MISMA página en el otro idioma
 * (/proyectos/torre-aurora ↔ /en/projects/torre-aurora), conservando el
 * filtro (?servicio=…) y la sección (#…).
 *
 * - Normal (dentro del menú): píldora con las dos banderas.
 * - `compact` (inicio, sobre WhatsApp): discreto. Solo la bandera actual, en un
 *   círculo pequeño y semitransparente, sin recuadro; al pasar el mouse, con
 *   foco de teclado o al tocarla, se ilumina y aparece la del otro idioma.
 */
export function LangSwitch({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const lang = localeFromPath(pathname);
  const ui = t(lang).lang;
  const [expanded, setExpanded] = useState(false);

  const go = (e: React.MouseEvent, l: Locale) => {
    e.preventDefault();
    if (l === lang) return;
    router.push(switchLocalePath(pathname, l) + window.location.search + window.location.hash);
  };

  if (compact) {
    const other = LOCALES.find((l) => l !== lang)!;
    const Current = FLAGS[lang];
    const Other = FLAGS[other];
    return (
      <div role="group" aria-label={ui.switchTo} className="group/lang flex items-center gap-1.5" onMouseLeave={() => setExpanded(false)}>
        {/* la del otro idioma: oculta hasta pasar el mouse / foco / toque */}
        <Link
          href={switchLocalePath(pathname, other)}
          hrefLang={other}
          lang={other}
          aria-label={NAMES[other]}
          title={NAMES[other]}
          onClick={(e) => go(e, other)}
          className={cn(
            "size-7 overflow-hidden rounded-full ring-1 ring-paper/40 transition-all duration-300",
            expanded
              ? "translate-x-0 opacity-100"
              : "pointer-events-none translate-x-2 opacity-0 focus-visible:pointer-events-auto focus-visible:translate-x-0 focus-visible:opacity-100 group-hover/lang:pointer-events-auto group-hover/lang:translate-x-0 group-hover/lang:opacity-100",
          )}
        >
          <Other className="size-full" />
        </Link>
        {/* la actual: pequeña y semitransparente; tocarla despliega la otra */}
        <button
          type="button"
          aria-label={`${ui.label}: ${NAMES[lang]}`}
          aria-expanded={expanded}
          title={NAMES[lang]}
          onClick={() => setExpanded((x) => !x)}
          className="size-7 overflow-hidden rounded-full opacity-55 ring-1 ring-paper/40 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 group-hover/lang:opacity-100"
        >
          <Current className="size-full" />
        </button>
      </div>
    );
  }

  return (
    <div role="group" aria-label={ui.switchTo} className="flex h-10 items-center gap-1 rounded-full bg-ink px-2 ring-1 ring-paper/25 shadow-[0_8px_30px_-12px_rgba(0,0,0,.5)]">
      {LOCALES.map((l) => {
        const on = l === lang;
        const Flag = FLAGS[l];
        return (
          <Link
            key={l}
            href={switchLocalePath(pathname, l)}
            hrefLang={l}
            lang={l}
            aria-label={NAMES[l]}
            title={NAMES[l]}
            aria-current={on ? "true" : undefined}
            onClick={(e) => go(e, l)}
            className={cn(
              "grid place-items-center rounded-[3px] p-1 transition-[opacity,filter]",
              on ? "opacity-100" : "opacity-45 grayscale-[35%] hover:opacity-100 hover:grayscale-0",
            )}
          >
            {/* la bandera activa lleva un borde claro fino */}
            <Flag className={cn("h-3.5 w-[1.3125rem] rounded-[2px]", on && "ring-1 ring-paper/70 ring-offset-1 ring-offset-ink")} />
          </Link>
        );
      })}
    </div>
  );
}
