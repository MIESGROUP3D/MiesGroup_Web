# MIES Group — Sitio web (mockup funcional)

Rediseño de [miesgroup3d.com](https://miesgroup3d.com) en código propio. Es un mockup **navegable**, publicado como sitio estático en GitHub Pages: páginas, filtros, modales, videos y el juego funcionan; el formulario solo simula el envío. Las imágenes, los textos de servicios, los proyectos y las conferencias son **de ejemplo** y se reemplazan con el material del cliente.

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack, exportación estática) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS 4 (tokens de marca en `src/app/globals.css`) |
| Animación | Motion 13 (antes Framer Motion) |
| Fuentes | Auto-alojadas con @fontsource (sin Google Fonts externo) |
| Formularios | Validación con Zod (envío simulado en el mockup) |
| Iconos | lucide-react + SVG propios para redes sociales |

## Requisitos

- Node.js **20.9 o superior** (recomendado 22 LTS): `node -v`
- npm

## Arranque

```bash
npm install
npm run dev          # http://localhost:3000
```

Build estático:

```bash
npm run build        # genera el sitio estático en out/; si falta un dato obligatorio en el contenido, falla aquí
```

## Estructura

```
src/
├── app/                      # Rutas (una carpeta = una URL)
│   ├── page.tsx              # Inicio: acordeón a pantalla completa (sin scroll)
│   ├── proyectos/            # Portafolio filtrable (?servicio=…)
│   ├── proyectos/[slug]/     # Proyecto a página completa (desde el sitio se abre en modal)
│   ├── vr-games/             # VR/Games: realidad virtual + juegos (y página del juego [slug])
│   ├── estudio/              # Quiénes somos + Channel + Conferencias (una página)
│   ├── contacto/  privacidad/
│   ├── sitemap.ts  robots.ts
│   └── layout.tsx            # Header, footer, fuentes, SEO global, JSON-LD
├── components/               # UI reutilizable (Header, ProjectGrid, GameEmbed, …)
├── content/                  # ← TODO EL CONTENIDO EDITABLE
│   ├── site.ts               # Teléfonos, WhatsApp, redes, sedes, hero, misión/visión
│   ├── services.ts           # Servicios
│   ├── projects.ts           # Portafolio
│   ├── games.ts              # Videojuegos + videos de la sección
│   ├── channel.ts            # Videos del canal
│   ├── conferences.ts        # Conferencias
│   ├── navigation.ts         # Menú principal
│   └── types.ts              # Tipos: definen qué campos son obligatorios
└── lib/                      # Utilidades (validación, hooks)
public/
├── media/                    # Renders (placeholders generados por script)
└── games/<slug>/             # Builds de los juegos (index.html en la raíz)
scripts/generate-placeholders.py
```

## Cómo cambiar contenido

Todo se edita en `src/content/`. Los componentes no tienen texto fijo.

**Agregar un proyecto**

1. Copia los renders a `public/media/projects/<slug>/` (JPG optimizados para web: en el sitio estático las imágenes se sirven tal cual, sin redimensionar).
2. En `src/content/projects.ts`, duplica un bloque y cambia los datos. Usa `img(src, alt, ancho, alto)` con las **dimensiones reales** de cada imagen.
3. `featured: true` lo muestra en la home. `order` controla la posición.
4. `npm run build`: si falta un campo obligatorio (por ejemplo el `alt`), falla antes de publicar.

**Videos**: se usan desde Vimeo o YouTube por ID (`{ provider: "vimeo", id: "949710062", title: "…" }`). El reproductor solo carga al hacer clic (patrón *facade*), y Vimeo entrega streaming adaptativo.

**Teléfonos, WhatsApp, redes y sedes**: se cambian en un solo lugar, `src/content/site.ts`.

**Branding**: reemplaza los tokens `--color-*` y `--font-*` en `src/app/globals.css`, y el logo provisional en `src/components/Logo.tsx`.

## Idiomas (español / inglés)

El español vive en las URLs de siempre (`/proyectos/`, `/estudio/`…) y el inglés bajo `/en/` (`/en/projects/`, `/en/studio/`…). El selector **ES / EN** (arriba a la derecha) lleva a la misma página en el otro idioma, conservando el filtro y la sección.

- **Rutas equivalentes**: `src/lib/i18n.ts` (`ROUTES`). Para una página nueva: agregar su ruta ahí y crear su archivo en `src/app/...` y `src/app/en/...` usando la misma vista de `src/views/` con `lang="es"` / `lang="en"`.
- **Textos de la interfaz** (menú, botones, formulario…): `src/content/ui.ts`.
- **Textos del contenido en inglés** (servicios, proyectos, juegos, conferencias, estudio): `src/content/en.ts`. Solo textos; imágenes, años y slugs salen del contenido en español. Si falta una traducción, se muestra el texto en español.
- **Privacidad**: `src/content/privacy.ts`, con los dos idiomas.
- Buscadores: cada página declara su equivalente en el otro idioma (`hreflang`) y el sitemap incluye ambos.

⚠ La traducción al inglés es un **borrador**: debe revisarla el cliente.

## Juego web

El juego de ejemplo (`public/games/torre-demo/`) es HTML5 Canvas y valida la integración completa: carga diferida, pantalla completa, reinicio y controles.

Para el juego real del cliente:

1. Copia la carpeta exportada completa a `public/games/<slug>/`, con `index.html` en la raíz.
2. Agrega su entrada en `src/content/games.ts` (`buildPath: "/games/<slug>/index.html"`).
3. Si es **Unity o Godot con multihilo** o viene comprimido (`.br`/`.gz`), necesita headers de servidor (COOP/COEP, `Content-Encoding`) que GitHub Pages no permite: habrá que publicarlo en un hosting con servidor.
4. Opcional: el juego puede avisar su progreso de carga al sitio:
   ```js
   window.parent.postMessage({ type: "game:progress", value: 0.5 }, "*");
   window.parent.postMessage({ type: "game:ready" }, "*");
   ```

## Formulario de contacto

En el mockup el formulario **valida pero no envía**: simula el envío (el sitio estático no tiene servidor). Para producción: hosting con servidor (ruta de API + Resend) o un servicio de formularios externo.

## Publicación (GitHub Pages)

Cada push a `main` ejecuta `.github/workflows/nextjs.yml`: compila el sitio estático y lo publica en GitHub Pages (`https://<usuario>.github.io/MiesGroup_Web/`).

- La primera vez hay que activarlo en el repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
- El sitio vive en la subcarpeta `/MiesGroup_Web`: el workflow la pasa en `NEXT_PUBLIC_BASE_PATH`. Las rutas a `public/` se escriben con `img()` (contenido) o `withBase()` (`src/lib/basePath.ts`); `next/link` la agrega solo.
- Probar el build tal como en GitHub (PowerShell): `$env:NEXT_PUBLIC_BASE_PATH="/MiesGroup_Web"; npx next build` → carpeta `out/`.

Al ser estático, el mockup **no tiene**: redirecciones 301 de las URLs viejas de WordPress, headers de seguridad, envío real del formulario, optimización de imágenes (AVIF/WebP) ni URL propia al abrir un proyecto en modal. Todo eso vuelve al pasar a un hosting con servidor (Vercel, Netlify o servidor Node). El historial de git conserva esa versión (commit `c84df99`).

## Antes de producción

- [ ] Pasar a un hosting con servidor y recuperar redirecciones 301, headers, optimización de imágenes y el envío del formulario (ver "Publicación").

- [ ] Quitar `robots: { index: false }` en `src/app/layout.tsx` y actualizar `src/app/robots.ts` (hoy bloquean la indexación a propósito).
- [ ] Reemplazar placeholders: renders, textos de servicios, proyectos, conferencias, textos de "Estudio".
- [ ] Proyectos reales (`src/content/projects-real.ts`, renders copiados de la NAS): confirmar el permiso de cada constructora para publicarlos, la ciudad de cada proyecto (hoy "Colombia") y los textos. Los 6 proyectos de ejemplo quedan solo para las categorías sin material real.
- [ ] Política de privacidad (`src/content/privacy.ts`): revisión legal, plazo de conservación de datos y lista de terceros al día (agregar el proveedor de correo y el hosting definitivo al salir del mockup).
- [ ] Logo SVG oficial, paleta y tipografías del cliente.
- [ ] Confirmar el número oficial de WhatsApp y el correo que recibe el formulario.
- [ ] Configurar Resend y Cloudflare Turnstile (anti-spam).
- [ ] Integrar el build real del juego.
- [ ] Revisar la traducción al inglés (`src/content/en.ts`, `src/content/ui.ts`, `src/content/privacy.ts`).

## Regenerar las imágenes placeholder

```bash
pip install pillow numpy
python scripts/generate-placeholders.py
```
