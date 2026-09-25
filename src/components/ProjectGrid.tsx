"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { getServices } from "@/content/services";
import { t } from "@/content/ui";
import { useLang } from "@/lib/useLang";
import type { Project, ServiceSlug } from "@/content/types";
import { CategoryBar } from "./CategoryBar";
import { ProjectCard } from "./ProjectCard";
import { RenderGallery } from "./RenderGallery";

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

function writeService(value: ServiceSlug) {
  const params = new URLSearchParams(window.location.search);
  params.set("servicio", value);
  const qs = params.toString();
  window.history.replaceState(window.history.state, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  window.dispatchEvent(new Event(URL_EVENT));
}

/**
 * Portafolio (sección negra de la home): barra de categorías flotante que
 * "respira" (CategoryBar) y grilla uniforme de tarjetas (o galería de renders en 3D Rendering).
 * El filtro vive en la URL (?servicio=…).
 */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const lang = useLang();
  const ui = t(lang);
  const search = useSyncExternalStore(subscribe, readSearch, () => "");
  // al llegar navegando (/?servicio=…) Next actualiza la URL después de pintar:
  // se vuelve a leer un instante después
  useEffect(() => {
    const id = setTimeout(() => window.dispatchEvent(new Event(URL_EVENT)));
    return () => clearTimeout(id);
  }, []);
  const usedServices = useMemo(() => getServices(lang).filter((s) => projects.some((p) => p.services.includes(s.slug))), [projects, lang]);

  // sin categoría en la URL (o desconocida) → la primera (3D Rendering); no hay "Todos"
  const raw = new URLSearchParams(search).get("servicio");
  const service: ServiceSlug = usedServices.find((s) => s.slug === raw)?.slug ?? usedServices[0].slug;
  const filtered = projects.filter((p) => p.services.includes(service));
  // "Nuevo" = año más reciente del portafolio (no el reloj del navegador: el HTML es estático)
  const latestYear = Math.max(...projects.map((p) => p.year));

  const options: { value: ServiceSlug; label: string }[] = usedServices.map((s) => ({ value: s.slug, label: s.name }));

  return (
    <div>
      <CategoryBar options={options} value={service} onChange={writeService} label={ui.projects.categories} />
      <p className="sr-only" aria-live="polite">
        {ui.common.projectCount(filtered.length)}
      </p>

      {/* "3D Rendering" se muestra como galería de renders en filas de 3 y 4; el resto, como tarjetas */}
      <AnimatePresence mode="wait" initial={false}>
        {service === "3d-rendering" ? (
          <motion.div key="renders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <RenderGallery projects={filtered} />
          </motion.div>
        ) : (
          <motion.ul
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-3 md:grid-cols-2 min-[1800px]:grid-cols-3"
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
