/** Cabecera de páginas internas: título discreto, intro opcional y un extra a la derecha. */
export function PageHeader({ title, intro, meta }: { title: React.ReactNode; intro?: string; meta?: React.ReactNode }) {
  return (
    <header className="shell grid gap-4 pb-10 pt-6 md:grid-cols-2 md:gap-6">
      <h1 className="display text-3xl md:text-4xl">{title}</h1>
      {(intro || meta) && (
        <div className="space-y-4 md:pt-1">
          {intro && <p className="max-w-xl text-ink-soft">{intro}</p>}
          {meta}
        </div>
      )}
    </header>
  );
}
