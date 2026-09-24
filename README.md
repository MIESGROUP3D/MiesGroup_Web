# MIES Group — Sitio web (mockup funcional)

Rediseño de [miesgroup3d.com](https://miesgroup3d.com) en código propio. Es un mockup **navegable y funcional**: todas las páginas, filtros, galería, videos, formulario y el juego funcionan. Las imágenes, los textos de servicios, los proyectos y las conferencias son **de ejemplo** y se reemplazan con el material del cliente.

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack, SSG) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS 4 (tokens de marca en `src/app/globals.css`) |
| Animación | Motion 13 (antes Framer Motion) |
| Fuentes | Auto-alojadas con @fontsource (sin Google Fonts externo) |
| Formularios | Route Handler + Zod (mismo esquema en cliente y servidor) + Resend |
| Iconos | lucide-react + SVG propios para redes sociales |

## Requisitos

- Node.js **20.9 o superior** (recomendado 22 LTS): `node -v`
- npm

## Arranque

```bash
npm install
npm run dev          # http://localhost:3000
```

Producción local:

```bash
npm run build        # compila y valida tipos: si falta un dato obligatorio en el contenido, falla aquí
npm run start
```

## Estructura

```
src/
├── app/                      # Rutas (una carpeta = una URL)
│   ├── page.tsx              # Home = portafolio filtrable (ref. mir.no)
│   ├── servicios/            # Los 6 servicios en una página (anclas #slug)
│   ├── proyectos/[slug]/     # Detalle de proyecto (/proyectos redirige a /)
│   ├── videojuegos/          # Listado + página del juego [slug]
│   ├── estudio/  contacto/  channel/  conferencias/  privacidad/
│   ├── api/contact/route.ts  # POST del formulario
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

1. Copia los renders a `public/media/projects/<slug>/` (JPG/PNG en la mayor resolución disponible: el sitio genera AVIF/WebP en varios tamaños automáticamente).
2. En `src/content/projects.ts`, duplica un bloque y cambia los datos. Usa `img(src, alt, ancho, alto)` con las **dimensiones reales** de cada imagen.
3. `featured: true` lo muestra en la home. `order` controla la posición.
4. `npm run build`: si falta un campo obligatorio (por ejemplo el `alt`), falla antes de publicar.

**Videos**: se usan desde Vimeo o YouTube por ID (`{ provider: "vimeo", id: "949710062", title: "…" }`). El reproductor solo carga al hacer clic (patrón *facade*), y Vimeo entrega streaming adaptativo.

**Teléfonos, WhatsApp, redes y sedes**: se cambian en un solo lugar, `src/content/site.ts`.

**Branding**: reemplaza los tokens `--color-*` y `--font-*` en `src/app/globals.css`, y el logo provisional en `src/components/Logo.tsx`.

## Juego web

El juego de ejemplo (`public/games/torre-demo/`) es HTML5 Canvas y valida la integración completa: carga diferida, pantalla completa, reinicio y controles.

Para el juego real del cliente:

1. Copia la carpeta exportada completa a `public/games/<slug>/`, con `index.html` en la raíz.
2. Agrega su entrada en `src/content/games.ts` (`buildPath: "/games/<slug>/index.html"`).
3. Si es **Unity o Godot con multihilo**, descomenta los headers COOP/COEP en `next.config.ts`. Si el build de Unity viene comprimido (`.br`/`.gz`), descomenta también los headers `Content-Encoding`.
4. Opcional: el juego puede avisar su progreso de carga al sitio:
   ```js
   window.parent.postMessage({ type: "game:progress", value: 0.5 }, "*");
   window.parent.postMessage({ type: "game:ready" }, "*");
   ```

## Formulario de contacto

Sin configuración funciona en **modo mockup**: valida y responde OK, y el mensaje queda en la consola del servidor. Para enviar correos reales, copia `.env.example` a `.env.local` y configura Resend.

## Redirecciones SEO

Las URLs del WordPress actual (`/about-us`, `/3d-rendering`, `/video-juegos`, …) redirigen de forma permanente a las nuevas. La lista está en `next.config.ts` → `legacyRedirects`.

## Antes de producción

- [ ] Quitar `robots: { index: false }` en `src/app/layout.tsx` y actualizar `src/app/robots.ts` (hoy bloquean la indexación a propósito).
- [ ] Reemplazar placeholders: renders, textos de servicios, proyectos, conferencias, textos de "Estudio", política de privacidad.
- [ ] Logo SVG oficial, paleta y tipografías del cliente.
- [ ] Confirmar el número oficial de WhatsApp y el correo que recibe el formulario.
- [ ] Configurar Resend y Cloudflare Turnstile (anti-spam).
- [ ] Integrar el build real del juego.
- [ ] Decidir idioma: ES, EN o bilingüe.

## Regenerar las imágenes placeholder

```bash
pip install pillow numpy
python scripts/generate-placeholders.py
```
