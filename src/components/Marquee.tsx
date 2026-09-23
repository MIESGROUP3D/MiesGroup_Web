/** Banda infinita de texto (CSS puro, se pausa con prefers-reduced-motion). */
export function Marquee({ items }: { items: string[] }) {
  const row = (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden>
      {items.map((t) => (
        <li key={t} className="flex items-center gap-10">
          <span className="display text-5xl text-bone/90 md:text-7xl">{t}</span>
          <span className="size-3 rotate-45 bg-bronze" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="relative flex overflow-hidden border-y border-line py-6 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <p className="sr-only">{items.join(", ")}</p>
      <div className="flex animate-[marquee_40s_linear_infinite] motion-reduce:animate-none">
        {row}
        {row}
      </div>
    </div>
  );
}
