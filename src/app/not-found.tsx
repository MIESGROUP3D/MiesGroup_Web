import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="shell blueprint flex min-h-[80svh] flex-col justify-center pt-32">
      <p className="eyebrow text-bronze">Error 404</p>
      <h1 className="display mt-6 text-[clamp(4rem,16vw,16rem)]">Aún no<br />existe</h1>
      <p className="mt-6 max-w-md text-bone-dim">Esta página no está en los planos. Puede que la URL haya cambiado con el nuevo sitio.</p>
      <Link href="/" className="mt-10 inline-flex w-fit items-center gap-3 bg-bronze px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink hover:bg-bone">
        Volver al inicio <ArrowUpRight className="size-4" />
      </Link>
    </section>
  );
}
