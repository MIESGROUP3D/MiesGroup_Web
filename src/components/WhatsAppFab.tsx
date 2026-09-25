import { whatsappHref } from "@/content/site";
import { WhatsappIcon } from "./icons";

/** Botón flotante de WhatsApp. El mensaje se codifica con encodeURIComponent (sin caracteres rotos). */
export function WhatsAppFab() {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-ink py-3 pl-3 pr-3 text-paper ring-1 ring-paper/25 shadow-[0_8px_30px_-12px_rgba(0,0,0,.5)] transition-colors hover:bg-ink-soft sm:pr-5"
    >
      <WhatsappIcon className="size-6" />
      <span className="hidden text-xs sm:inline">WhatsApp</span>
    </a>
  );
}
