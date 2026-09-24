import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[60svh] flex-col justify-center">
      <p className="text-muted">404</p>
      <h1 className="display mt-2 text-3xl md:text-4xl">Esta página aún no existe.</h1>
      <p className="mt-4 max-w-md text-ink-soft">Puede que la URL haya cambiado con el nuevo sitio.</p>
      <Link href="/" className="mt-6 w-fit underline underline-offset-4 hover:no-underline">
        Ver proyectos →
      </Link>
    </section>
  );
}
