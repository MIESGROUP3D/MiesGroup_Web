import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

/** Encabezado de sección con índice técnico: "02 — Proyectos" */
export function SectionHeading({
  index,
  label,
  title,
  intro,
  className,
  action,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  intro?: string;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("grid gap-6 border-t border-line pt-6 md:grid-cols-12", className)}>
      <p className="eyebrow md:col-span-3">
        <span className="text-bronze">{index}</span> — {label}
      </p>
      <div className="md:col-span-9">
        <Reveal>
          <h2 className="display text-[clamp(2.6rem,7vw,6.5rem)]">{title}</h2>
        </Reveal>
        {(intro || action) && (
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {intro && <p className="max-w-xl text-base leading-relaxed text-bone-dim md:text-lg">{intro}</p>}
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
