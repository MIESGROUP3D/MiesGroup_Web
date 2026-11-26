/**
 * Genera versiones WebP en varios anchos de cada imagen de /public (media y brand),
 * para que next/image sirva el tamaño justo en un sitio estático (sin servidor
 * de imágenes). Las usa el loader de src/lib/imageLoader.ts.
 *
 *   public/media/projects/sinara/01.jpg → public/_img/media/projects/sinara/01-{320,640,1080,1600,2400}.webp
 *
 * - Nunca agranda: si el original mide 1600 px, los archivos de 2400 quedan en 1600.
 * - Solo procesa lo que cambió (manifiesto con el hash de cada original), así que
 *   correrlo de nuevo tarda segundos.
 * - Borra las versiones de imágenes que ya no existen.
 *
 * Uso: npm run images   (también corre solo antes de `npm run build`)
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Mantener igual que WIDTHS en src/lib/imageLoader.ts
const WIDTHS = [320, 640, 1080, 1600, 2400];
const QUALITY = 78;
const SOURCES = ["public/media", "public/brand"];
const OUT = "public/_img";
const MANIFEST = path.join(OUT, ".manifest.json");

async function walk(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])));
  return files.flat();
}

const toPosix = (p) => p.split(path.sep).join("/");
const outBase = (file) => path.join(OUT, path.relative("public", file)).replace(/\.(jpe?g|png)$/i, "");

const manifest = existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, "utf8")) : {};
const next = {};
const files = (await Promise.all(SOURCES.map(walk))).flat().filter((f) => /\.(jpe?g|png)$/i.test(f));

let done = 0;
let skipped = 0;
let before = 0;
let after = 0;

// de a 4 en paralelo: rápido sin saturar la memoria
const queue = [...files];
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const file = queue.shift();
      const key = toPosix(path.relative("public", file));
      const buf = await readFile(file);
      const hash = createHash("sha1").update(buf).digest("hex");
      const base = outBase(file);
      const outputs = WIDTHS.map((w) => `${base}-${w}.webp`);
      next[key] = hash;
      if (manifest[key] === hash && outputs.every((o) => existsSync(o))) {
        skipped++;
        continue;
      }
      await mkdir(path.dirname(base), { recursive: true });
      for (const [i, w] of WIDTHS.entries()) {
        const info = await sharp(buf).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY, effort: 5 }).toFile(outputs[i]);
        if (w === 1600) after += info.size;
      }
      before += buf.length;
      done++;
    }
  }),
);

// quitar versiones de imágenes borradas
for (const key of Object.keys(manifest)) {
  if (next[key]) continue;
  const base = outBase(path.join("public", key));
  await Promise.all(WIDTHS.map((w) => rm(`${base}-${w}.webp`, { force: true })));
}

await mkdir(OUT, { recursive: true });
await writeFile(MANIFEST, JSON.stringify(next, null, 0));

const mb = (n) => (n / 1e6).toFixed(1) + " MB";
console.log(`Imágenes: ${done} procesadas, ${skipped} sin cambios (${files.length} en total).`);
if (done) console.log(`Originales procesados: ${mb(before)} → versión de 1600 px: ${mb(after)}`);
