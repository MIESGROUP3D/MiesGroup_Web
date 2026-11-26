"use client";

import { useEffect, useState } from "react";

type Pill = { id: string; label: string; count?: number };

/**
 * Atajos a las secciones de la página. Marca la sección que se está viendo
 * (IntersectionObserver) para que el usuario sepa dónde está.
 */
export function SectionPills({ items, label }: { items: Pill[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((p) => document.getElementById(p.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label={label} className="flex flex-wrap gap-2">
      {items.map((p) => {
        const on = p.id === active;
        return (
          <a
            key={p.id}
            href={`#${p.id}`}
            aria-current={on ? "true" : undefined}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors ${
              on ? "border-ink bg-ink text-paper" : "border-line-strong hover:border-ink"
            }`}
          >
            {p.label}
            {p.count !== undefined && <span className="text-xs tabular-nums opacity-60">{p.count}</span>}
          </a>
        );
      })}
    </nav>
  );
}
