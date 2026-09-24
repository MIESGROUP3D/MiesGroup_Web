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

/** Portafolio: una línea de filtros en texto + grilla de 2 columnas. */
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

      <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2">
        <AnimatePresence initial={false} mode="popLayout">
          {filtered.map((p, i) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <ProjectCard project={p} priority={i < 2} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
