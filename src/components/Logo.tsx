import { cn } from "@/lib/cn";

/**
 * LOGO PROVISIONAL (wordmark tipográfico). Reemplazar por el SVG oficial del
 * cliente en public/brand/logo.svg y usar <Image src="/brand/logo.svg" …/>.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span aria-hidden className="relative block h-7 w-9 border-2 border-bone">
        <span className="absolute inset-x-1 bottom-1 h-[3px] bg-bone" />
      </span>
      <span className="font-display text-xl font-extrabold uppercase leading-none tracking-wide">
        Mies<span className="font-normal text-bone-dim">Group</span>
      </span>
    </span>
  );
}
