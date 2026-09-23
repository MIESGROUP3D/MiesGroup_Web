"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Service } from "@/content/types";

/**
 * Lista editorial de servicios. En escritorio, el render del servicio activo
 * aparece en un panel fijo a la derecha (hover/foco). En móvil, cada fila
 * muestra su miniatura.
 */
export function ServicesList({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="grid gap-10 md:grid-cols-12">
      <ul className="md:col-span-7" onMouseLeave={() => undefined}>
        {services.map((s, i) => (
          <li key={s.slug} className="border-b border-line first:border-t">
            <Link
              href={`/servicios/${s.slug}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-6 md:py-7"
            >
              <span className={cn("font-mono text-xs transition-colors", active === i ? "text-bronze" : "text-muted")}>0{i + 1}</span>
              <span>
                <span className={cn("display block text-4xl transition-all duration-500 md:text-6xl", active === i ? "text-bone md:translate-x-3" : "text-bone/45")}>
                  {s.name}
                </span>
                <span className="mt-2 block text-sm text-muted md:hidden">{s.tagline}</span>
              </span>
              <ArrowUpRight className={cn("size-6 transition-all duration-500", active === i ? "text-bronze opacity-100" : "opacity-30")} />
            </Link>
          </li>
        ))}
      </ul>
      <div className="relative hidden md:col-span-5 md:block">
        <div className="sticky top-28">
          <div className="crosshair relative aspect-[4/5] overflow-hidden bg-ink-3">
            <AnimatePresence initial={false}>
              <motion.div
                key={services[active].slug}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.08, clipPath: "inset(0 0 100% 0)" }}
                animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0 0% 0)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image src={services[active].cover.src} alt={services[active].cover.alt} fill sizes="40vw" quality={75} className="object-cover" />
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="mt-5 max-w-sm text-bone-dim">{services[active].tagline}</p>
        </div>
      </div>
    </div>
  );
}
