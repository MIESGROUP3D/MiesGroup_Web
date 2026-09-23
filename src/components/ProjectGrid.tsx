"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { categoryLabels } from "@/content/projects";
import { services } from "@/content/services";
import type { Project, ProjectCategory, ServiceSlug } from "@/content/types";
import { ProjectCard } from "./ProjectCard";

/**
 * Portafolio filtrable por servicio y por tipología.
 * Las tarjetas se reacomodan con layout animations de Motion (sin saltos).
 * Grilla editorial asimétrica: filas 7/5 y 5/7 columnas alternadas.
 */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [service, setService] = useState<ServiceSlug | "all">("all");
  const [category, setCategory] = useState<ProjectCategory | "all">("all");

  const usedCategories = useMemo(() => [...new Set(projects.map((p) => p.category))], [projects]);
  const usedServices = useMemo(() => services.filter((s) => projects.some((p) => p.services.includes(s.slug))), [projects]);

  const filtered = projects.filter(
    (p) => (service === "all" || p.services.includes(service)) && (category === "all" || p.category === category),
  );

  return (
    <div>
      <div className="sticky top-18 z-30 -mx-[clamp(1rem,4vw,3rem)] mb-12 border-y border-line bg-ink/85 px-[clamp(1rem,4vw,3rem)] py-4 backdrop-blur-xl md:top-20">
        <div className="flex flex-col gap-2">
          <FilterRow
            label="Servicio"
            value={service}
            onChange={(v) => setService(v as ServiceSlug | "all")}
            options={[{ value: "all", label: "Todos" }, ...usedServices.map((s) => ({ value: s.slug, label: s.name }))]}
          />
          <FilterRow
            label="Tipología"
            value={category}
            onChange={(v) => setCategory(v as ProjectCategory | "all")}
            options={[{ value: "all", label: "Todas" }, ...usedCategories.map((c) => ({ value: c, label: categoryLabels[c] }))]}
          />
        </div>
        <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-widest text-muted" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "proyecto" : "proyectos"}
        </p>
      </div>

      <LayoutGroup>
        <motion.ul layout className="grid gap-x-8 gap-y-16 md:grid-cols-12">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => {
              const row = Math.floor(i / 2);
              const first = i % 2 === 0;
              const wide = (row % 2 === 0) === first;
              return (
                <motion.li
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(wide ? "md:col-span-7" : "md:col-span-5", !wide && "md:mt-24")}
                >
                  <ProjectCard project={p} index={projects.indexOf(p)} size={wide ? "lg" : "md"} priority={i < 2} />
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>

      {filtered.length === 0 && (
        <div className="border border-dashed border-line py-24 text-center">
          <p className="display text-4xl">Sin resultados</p>
          <button type="button" className="mt-4 text-sm text-bronze underline underline-offset-4" onClick={() => { setService("all"); setCategory("all"); }}>
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}

function FilterRow({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-3 overflow-x-auto [scrollbar-width:none]">
      <span className="eyebrow w-20 shrink-0">{label}</span>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "relative shrink-0 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] transition-colors",
            value === o.value ? "text-ink" : "text-bone-dim hover:text-bone",
          )}
        >
          {value === o.value && <motion.span layoutId={`pill-${label}`} className="absolute inset-0 bg-bone" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
