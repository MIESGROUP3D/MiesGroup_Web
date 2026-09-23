/**
 * Íconos de redes dibujados como SVG simples (lucide-react ya no incluye logos
 * de marcas). Geométricos, heredan `currentColor`.
 */
type P = { className?: string; title?: string };

function Svg({ className, title, children }: P & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export const YoutubeIcon = (p: P) => (
  <Svg {...p}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
  </Svg>
);

export const InstagramIcon = (p: P) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </Svg>
);

export const LinkedinIcon = (p: P) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
    <path d="M8 10.5v6M8 7.6v.01M11.5 16.5v-6M11.5 13c0-1.6 1-2.6 2.4-2.6s2.1 1 2.1 2.6v3.5" />
  </Svg>
);

export const WhatsappIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 20l1.3-3.9A8.2 8.2 0 1 1 8 18.8z" />
    <path d="M9.2 8.6c.2-.5.6-.5.9-.5h.4c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .5-.1.6l-.5.6c-.1.1-.2.3 0 .5.3.6 1.4 1.8 2.6 2.3.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.4.7c.2.1.3.3.3.5 0 .5-.3 1.3-1 1.6-.6.3-1.6.4-3.3-.4-2-1-3.3-3-3.5-3.4-.2-.4-.8-1.6-.3-2.9z" fill="currentColor" stroke="none" />
  </Svg>
);
