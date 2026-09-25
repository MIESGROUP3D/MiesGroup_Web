/**
 * Banderas del selector de idioma, en SVG (los emojis de bandera no se ven en
 * Windows: muestran "CO" / "US"). Proporción 3:2 (en un contenedor de otra
 * proporción, p. ej. un círculo, se recortan centradas); decorativas (aria-hidden):
 * el nombre del idioma lo da el enlace que las contiene.
 * Español → Colombia (sede principal); inglés → Estados Unidos (sede Los Ángeles).
 */

type P = { className?: string };

export function FlagCO({ className }: P) {
  return (
    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden className={className}>
      <rect width="30" height="10" fill="#FCD116" />
      <rect y="10" width="30" height="5" fill="#003893" />
      <rect y="15" width="30" height="5" fill="#CE1126" />
    </svg>
  );
}

export function FlagUS({ className }: P) {
  // 13 franjas; el cantón azul lleva una grilla de puntos (a este tamaño las estrellas se leen así)
  const stripes = Array.from({ length: 13 }, (_, i) => i);
  const stars = Array.from({ length: 12 }, (_, i) => ({ x: 1.6 + (i % 4) * 2.7, y: 1.5 + Math.floor(i / 4) * 2.9 }));
  return (
    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden className={className}>
      {stripes.map((i) => (
        <rect key={i} y={(i * 20) / 13} width="30" height={20 / 13 + 0.02} fill={i % 2 === 0 ? "#B22234" : "#FFFFFF"} />
      ))}
      <rect width="12" height={(20 / 13) * 7} fill="#3C3B6E" />
      {stars.map((s) => (
        <circle key={`${s.x}-${s.y}`} cx={s.x} cy={s.y} r="0.55" fill="#FFFFFF" />
      ))}
    </svg>
  );
}
