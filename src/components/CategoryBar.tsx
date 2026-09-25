"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";

export type CategoryOption<T extends string> = { value: T; label: string };

const ease = [0.39, 0.14, 0.26, 1] as const;

/**
 * Barra de categorías "que respira" (ref. Framer "Breathing Navbar"), en B/N:
 * - Píldora de vidrio esmerilado que flota fija al bajar (sticky) y desenfoca
 *   lo que pasa por detrás.
 * - Un brillo tenue recorre lentamente la superficie de lado a lado
 *   (.breathing-glow en globals.css; quieto con movimiento reducido).
 * - La categoría activa lleva una píldora blanca que se desliza (layoutId).
 * - Los enlaces entran escalonados la primera vez que la barra aparece.
 * - Móvil: píldora compacta con la categoría actual que se expande en lista.
 */
export function CategoryBar<T extends string>({
  options,
  value,
  onChange,
  label = "Categorías",
}: {
  options: CategoryOption<T>[];
  value: T;
  onChange: (v: T) => void;
  label?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const pillId = useId();
  const listId = useId();
  const current = options.find((o) => o.value === value) ?? options[0];

  const glass = "relative overflow-hidden border border-paper/15 bg-paper/[0.07] shadow-[0_10px_40px_-12px_rgba(0,0,0,.6)] backdrop-blur-xl";

  return (
    <div className="sticky top-16 z-30 flex justify-center pb-8">
      {/* Escritorio */}
      <motion.div
        role="group"
        aria-label={label}
        className={cn(glass, "hidden items-center gap-1 rounded-full p-1.5 md:flex")}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true }}
        variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.05 } } }}
      >
        <span aria-hidden className="breathing-glow" />
        {options.map((o) => {
          const on = o.value === value;
          return (
            <motion.button
              key={o.value}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o.value)}
              variants={{ hidden: { opacity: 0, y: 8 }, shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm transition-colors duration-300",
                on ? "text-ink" : "text-paper/75 hover:text-paper",
              )}
            >
              {on && <motion.span layoutId={pillId} className="absolute inset-0 rounded-full bg-paper" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
              <span className="relative">{o.label}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Móvil: se expande de forma fluida */}
      <motion.div layout className={cn(glass, "w-full max-w-sm md:hidden")} style={{ borderRadius: expanded ? 24 : 999 }} transition={{ duration: 0.45, ease }}>
        <span aria-hidden className="breathing-glow" />
        <motion.button
          layout="position"
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((e) => !e)}
          className="relative flex w-full items-center justify-between gap-3 px-5 py-3 text-sm text-paper"
        >
          <span>
            <span className="text-paper/50">{label}: </span>
            {current.label}
          </span>
          <span aria-hidden className={cn("text-paper/60 transition-transform duration-300", expanded && "rotate-180")}>
            ▾
          </span>
        </motion.button>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.ul
              id={listId}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease }}
              className="relative px-2 pb-2"
            >
              {options.map((o) => {
                const on = o.value === value;
                return (
                  <li key={o.value}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        onChange(o.value);
                        setExpanded(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-full px-3 py-2 text-left text-sm transition-colors",
                        on ? "bg-paper text-ink" : "text-paper/80 hover:bg-paper/10",
                      )}
                    >
                      {o.label}
                    </button>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
