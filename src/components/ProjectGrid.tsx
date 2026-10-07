"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { getServices } from "@/content/services";
import { t } from "@/content/ui";
import Link from "next/link";
import { useLang } from "@/lib/useLang";
import { updateCurrent } from "@/lib/backstack";
import { BASE_PATH } from "@/lib/basePath";
import { route } from "@/lib/i18n";
import { navigateWithCurtain } from "@/lib/curtain";
import type { Project, ServiceSlug } from "@/content/types";
import { CategoryBar } from "./CategoryBar";
import { ProjectCard } from "./ProjectCard";
import { RenderGallery } from "./RenderGallery";
import { TourGallery } from "./TourGallery";
import { VideoBanner } from "./VideoBanner";
import { CgiGallery } from "./CgiGallery";
import { getCgiVideos } from "@/content/cgi";
import { getGameVideos } from "@/content/game-videos";
import { getAiVideos } from "@/content/ai-videos";
import { Web3dShowcase } from "./Web3dShowcase";
import { tours } from "@/content/tours";

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
  // la flecha "volver" de la cabecera regresa a esta misma categoría
  const path = window.location.pathname.slice(BASE_PATH.length).replace(/\/$/, "") || "/";
  updateCurrent(`${path}${qs ? `?${qs}` : ""}`);
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
  const tourService = usedServices.find((s) => s.slug === "360-virtual-tour");
  const cgiService = usedServices.find((s) => s.slug === "cgi-animation");
  const gamesService = usedServices.find((s) => s.slug === "vr-games");
  const aiService = usedServices.find((s) => s.slug === "ai");
  const web3dService = usedServices.find((s) => s.slug === "web3d");
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
        ) : service === "cgi-animation" ? (
          // animaciones CGI reales (Vimeo), con el banner de video de la página anterior
          <motion.div key="cgi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <VideoBanner
              src1080="/media/cgi/banner-cgi-1080.mp4"
              src720="/media/cgi/banner-cgi-720.mp4"
              poster="/media/cgi/banner-cgi.jpg"
              title={cgiService?.name ?? ""}
              text={cgiService?.tagline ?? ""}
            />
            <CgiGallery videos={getCgiVideos(lang)} />
          </motion.div>
        ) : service === "vr-games" ? (
          // videojuegos y VR (Vimeo), con el banner de video de la página anterior
          <motion.div key="games" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <VideoBanner
              src1080="/media/games/banner-games-1080.mp4"
              src720="/media/games/banner-games-720.mp4"
              poster="/media/games/banner-games.jpg"
              title={gamesService?.name ?? ""}
              text={gamesService?.tagline ?? ""}
            />
            <CgiGallery videos={getGameVideos(lang)} />
          </motion.div>
        ) : service === "ai" ? (
          // inteligencia artificial (Vimeo), con el banner de video de la página anterior
          <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <VideoBanner
              src1080="/media/ai/banner-ai-1080.mp4"
              src720="/media/ai/banner-ai-720.mp4"
              poster="/media/ai/banner-ai.jpg"
              title={aiService?.name ?? ""}
              text={aiService?.tagline ?? ""}
            />
            <CgiGallery videos={getAiVideos(lang)} />
          </motion.div>
        ) : service === "web3d" ? (
          // Web3D: contenido de la página anterior (texto, video explicativo y ventajas con clips)
          <motion.div key="web3d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <VideoBanner
              src1080="/media/web3d/banner-web3d-1080.mp4"
              src720="/media/web3d/banner-web3d-720.mp4"
              poster="/media/web3d/banner-web3d.jpg"
              title={web3dService?.name ?? ""}
              text={web3dService?.tagline ?? ""}
            />
            <Web3dShowcase />
          </motion.div>
        ) : service === "360-virtual-tour" ? (
          // tours 360° reales (3DVista): se recorren a pantalla completa dentro del sitio
          <motion.div key="tours" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {/* banner con video, como la portada de la página anterior de 360° */}
            <VideoBanner
              src1080="/media/tours/banner-360-1080.mp4"
              src720="/media/tours/banner-360-720.mp4"
              poster="/media/tours/banner-360.jpg"
              title={tourService?.name ?? ""}
              text={tourService?.tagline ?? ""}
            />
            <TourGallery tours={tours} />
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

      {/* VR/Juegos: debajo de las tarjetas, acceso a la página completa (recorridos VR + juegos jugables) */}
      {service === "vr-games" && (
        <div className="mt-10 flex justify-center md:mt-14">
          <Link
            href={`${route(lang, "vrGames")}/`}
            onClick={(e) => navigateWithCurtain(e, `${route(lang, "vrGames")}/`, e.currentTarget)}
            className="group inline-flex items-center gap-3 rounded-full border border-paper/30 px-7 py-3.5 text-sm text-paper transition-colors hover:bg-paper hover:text-ink"
          >
            {ui.home.vrGamesMore}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
