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
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-bone py-3 pl-3 pr-3 text-ink shadow-[0_10px_40px_-10px_rgba(0,0,0,.8)] transition-all duration-500 hover:bg-bronze sm:pr-5"
    >
      <WhatsappIcon className="size-6" />
      <span className="hidden text-xs font-semibold uppercase tracking-[0.14em] sm:inline">WhatsApp</span>
    </a>
  );
}
