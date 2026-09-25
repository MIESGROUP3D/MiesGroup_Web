"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { services } from "@/content/services";
import type { Project, ServiceSlug } from "@/content/types";
import { CategoryBar } from "./CategoryBar";
import { ProjectCard } from "./ProjectCard";
import { RenderMasonry } from "./RenderMasonry";

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

/**
 * Portafolio (sección negra de la home): barra de categorías flotante que
 * "respira" (CategoryBar) y grilla uniforme de tarjetas (o mosaico en 3D Rendering).
 * El filtro vive en la URL (?servicio=…).
 */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const search = useSyncExternalStore(subscribe, readSearch, () => "");
  // al llegar navegando (/?servicio=…) Next actualiza la URL después de pintar:
  // se vuelve a leer un instante después
  useEffect(() => {
    const id = setTimeout(() => window.dispatchEvent(new Event(URL_EVENT)));
    return () => clearTimeout(id);
  }, []);
  const usedServices = useMemo(() => services.filter((s) => projects.some((p) => p.services.includes(s.slug))), [projects]);

  // valores desconocidos en la URL se ignoran (→ "Todos")
  const raw = new URLSearchParams(search).get("servicio");
  const service: ServiceSlug | "all" = usedServices.find((s) => s.slug === raw)?.slug ?? "all";
  const filtered = service === "all" ? projects : projects.filter((p) => p.services.includes(service));
  // "Nuevo" = año más reciente del portafolio (no el reloj del navegador: el HTML es estático)
  const latestYear = Math.max(...projects.map((p) => p.year));

  const options: { value: ServiceSlug | "all"; label: string }[] = [{ value: "all", label: "Todos" }, ...usedServices.map((s) => ({ value: s.slug, label: s.name }))];

  return (
    <div>
      <CategoryBar options={options} value={service} onChange={writeService} />
      <p className="sr-only" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "proyecto" : "proyectos"}
      </p>

      {/* "3D Rendering" se muestra como galería de renders en mosaico; el resto, como tarjetas */}
      <AnimatePresence mode="wait" initial={false}>
        {service === "3d-rendering" ? (
          <motion.div key="renders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <RenderMasonry projects={filtered} />
          </motion.div>
        ) : (
          <motion.ul
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.li
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.6, ease: [0.39, 0.14, 0.26, 1], delay: (i % 3) * 0.05 }}
                >
                  <ProjectCard project={p} latestYear={latestYear} priority={i < 3} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
