import Link from "next/link";

/** 404 bilingüe: en un sitio estático hay una sola página 404 para los dos idiomas. */
export default function NotFound() {
  return (
    <section className="shell flex min-h-[60svh] flex-col justify-center">
      <p className="text-muted">404</p>
      <h1 className="display mt-2 text-3xl md:text-4xl">This page doesn&apos;t exist yet.</h1>
      <p lang="es" className="display mt-1 text-2xl text-muted md:text-3xl">
        Esta página aún no existe.
      </p>
      <p className="mt-4 max-w-md text-ink-soft">The URL may have changed with the new site.</p>
      <div className="mt-6 flex gap-6">
        <Link href="/" className="w-fit underline underline-offset-4 hover:no-underline">
          Go to home →
        </Link>
        <Link href="/es" lang="es" className="w-fit underline underline-offset-4 hover:no-underline">
          Ir al inicio →
        </Link>
      </div>
    </section>
  );
}
