"use client";

import { siteText, whatsappHref } from "@/content/site";
import { t } from "@/content/ui";
import { usePathname } from "next/navigation";
import { route } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";
import { WhatsappIcon } from "./icons";
import { LangSwitch } from "./LangSwitch";

/**
 * Esquina inferior derecha: selector de idioma (banderas, solo en el inicio;
 * en las demás páginas está dentro del menú) y, debajo, el botón
 * flotante de WhatsApp. El mensaje va en el idioma de la página, codificado con
 * encodeURIComponent (sin caracteres rotos).
 */
export function WhatsAppFab() {
  const lang = useLang();
  // el selector de idioma va aquí solo en el inicio; en el resto de páginas, dentro del menú
  const onHome = (usePathname().replace(/\/$/, "") || "/") === route(lang, "home");
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {onHome && <LangSwitch compact />}
      <a
        href={whatsappHref(siteText(lang).whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t(lang).common.whatsappCta}
        className="group flex items-center gap-3 rounded-full bg-ink py-3 pl-3 pr-3 text-paper ring-1 ring-paper/25 shadow-[0_8px_30px_-12px_rgba(0,0,0,.5)] transition-colors hover:bg-ink-soft sm:pr-5"
      >
        <WhatsappIcon className="size-6" />
        <span className="hidden text-xs sm:inline">WhatsApp</span>
      </a>
    </div>
  );
}
