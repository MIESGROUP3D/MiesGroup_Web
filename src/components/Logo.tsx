import { cn } from "@/lib/cn";

/**
 * LOGO PROVISIONAL (wordmark tipográfico en negro). Reemplazar por el SVG
 * oficial del cliente en public/brand/logo.svg y usar <Image src="/brand/logo.svg" …/>.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("text-[1.05rem] font-semibold leading-none tracking-[-0.02em]", className)}>
      mies<span className="font-normal">group</span>
    </span>
  );
}
