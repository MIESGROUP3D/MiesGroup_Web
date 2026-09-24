"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { services } from "@/content/services";
import type { Project, ServiceSlug } from "@/content/types";
import { ProjectCard } from "./ProjectCard";

/*
 * El filtro vive en la URL (?servicio=web3d) para que se pueda compartir y
 * enlazar desde la página de servicios. Se lee con useSyncExternalStore (no
 * useSearchParams) para que el HTML estático siga trayendo todos los proyectos;
 * el filtro se aplica al hidratar. Se escribe con history.replaceState: no es
 * una navegación, así que no dispara la transición de página.
 */
const URL_EVENT = "proyectos:filtro";
const subscribe = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  window.addEventListener(URL_EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(URL_EVENT, cb);
  };
};
const readSearch = () => window.location.search;

function writeService(value: ServiceSlug | "all") {
  const params = new URLSearchParams(window.location.search);
  if (value === "all") params.delete("servicio");
  else params.set("servicio", value);
  const qs = params.toString();
  window.history.replaceState(window.history.state, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  window.dispatchEvent(new Event(URL_EVENT));
}

/*
 * Patrón bento de 6 celdas que encaja exacto en 12 columnas × 4 filas:
 *   ┌────────────┬──────┐   ┌──────┬────────────┐
 *   │            │  B   │   │      │     E      │
 *   │     A      ├──────┤   │  D   ├────────────┤
 *   │            │  C   │   │      │     F      │
 *   └────────────┴──────┘   └──────┴────────────┘
 * En móvil todas las celdas son una columna 4:3.
 */
const bento = [
  { className: "md:col-span-8 md:row-span-2", sizes: "(min-width: 768px) 66vw, 100vw" },
  { className: "md:col-span-4", sizes: "(min-width: 768px) 33vw, 100vw" },
  { className: "md:col-span-4", sizes: "(min-width: 768px) 33vw, 100vw" },
  { className: "md:col-span-4 md:row-span-2", sizes: "(min-width: 768px) 33vw, 100vw" },
  { className: "md:col-span-8", sizes: "(min-width: 768px) 66vw, 100vw" },
  { className: "md:col-span-8", sizes: "(min-width: 768px) 66vw, 100vw" },
];

/** Portafolio: una línea de filtros en texto + grilla bento. */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const search = useSyncExternalStore(subscribe, readSearch, () => "");
  const usedServices = useMemo(() => services.filter((s) => projects.some((p) => p.services.includes(s.slug))), [projects]);

  // valores desconocidos en la URL se ignoran (→ "Todo")
  const raw = new URLSearchParams(search).get("servicio");
  const service: ServiceSlug | "all" = usedServices.find((s) => s.slug === raw)?.slug ?? "all";
  const filtered = service === "all" ? projects : projects.filter((p) => p.services.includes(service));

  const options: { value: ServiceSlug | "all"; label: string }[] = [{ value: "all", label: "Todo" }, ...usedServices.map((s) => ({ value: s.slug, label: s.name }))];

  return (
    <div>
      <div role="group" aria-label="Filtrar por servicio" className="flex flex-wrap gap-x-5 gap-y-1 pb-8">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={service === o.value}
            onClick={() => writeService(o.value)}
            className={cn("py-1 transition-colors hover:text-ink", service === o.value ? "text-ink underline underline-offset-4" : "text-muted")}
          >
            {o.label}
          </button>
        ))}
        <p className="sr-only" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "proyecto" : "proyectos"}
        </p>
      </div>

      {/* Bento (ref. Framer "Bento Gallery"): 12 columnas, filas de alto fijo.
          `grid-flow-dense` rellena huecos cuando el filtro deja listas cortas. */}
      <ul className="grid gap-3 md:grid-flow-dense md:auto-rows-[clamp(11rem,17vw,19rem)] md:grid-cols-12 md:gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => {
            const cell = bento[i % bento.length];
            return (
              <motion.li
                key={p.slug}
                layout
                className={cell.className}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.7, ease: [0.39, 0.14, 0.26, 1], delay: (i % 3) * 0.06 }}
              >
                <ProjectCard project={p} priority={i < 2} sizes={cell.sizes} />
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
