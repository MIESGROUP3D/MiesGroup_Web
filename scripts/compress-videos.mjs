/**
 * Recomprime los videos de public/media para que el sitio pese menos.
 * NO corre en el build: se usa a mano cuando se agregan videos nuevos.
 *
 *   npm run videos          (necesita ffmpeg: winget install Gyan.FFmpeg)
 *
 * - Todos los MP4: H.264 (se ve en cualquier navegador), CRF 27, a lo sumo 30 fps,
 *   "faststart" (empieza a reproducirse antes de bajar completo) y sin pista de
 *   audio, salvo los de AUDIO (videos que el visitante reproduce con sonido).
 * - Banners (banner-*-1080 / -720): además una versión AV1 (…-av1.mp4), ~45 %
 *   más liviana que H.264; VideoBanner la ofrece primero y deja H.264 de respaldo.
 * - Marca cada video procesado (metadato "comment=mies-compressed"): correrlo de
 *   nuevo no lo recomprime (cada pasada perdería calidad). Para un video nuevo
 *   basta con dejar el original en public/media y correr el script.
 * - Solo reemplaza el original si el resultado pesa menos.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readdir, rename, rm, stat } from "node:fs/promises";
import path from "node:path";

const FFMPEG = process.env.FFMPEG ?? "ffmpeg";
const FFPROBE = process.env.FFPROBE ?? "ffprobe";
const MARK = "mies-compressed";
/** Videos con sonido que el visitante reproduce: conservan el audio. */
const AUDIO = new Set(["web3d/web3d-video.mp4"]);
const isBanner = (rel) => /\/banner-[^/]+-(1080|720)\.mp4$/.test(rel);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])));
  return files.flat();
}

const probe = (file, entries) =>
  execFileSync(FFPROBE, ["-v", "error", ...entries, "-of", "default=nw=1:nk=1", file], { encoding: "utf8" }).trim();
const ff = (args) => execFileSync(FFMPEG, ["-v", "error", "-y", ...args], { stdio: ["ignore", "ignore", "inherit"] });
const fpsOf = (file) => {
  const [n, d = 1] = probe(file, ["-select_streams", "v:0", "-show_entries", "stream=r_frame_rate"]).split("/").map(Number);
  return n / d;
};
const kb = (n) => `${Math.round(n / 1024)} KB`;

const root = "public/media";
const files = (await walk(root)).filter((f) => f.endsWith(".mp4") && !f.endsWith("-av1.mp4"));
let before = 0;
let after = 0;

for (const file of files) {
  const rel = path.relative(root, file).split(path.sep).join("/");
  if (probe(file, ["-show_entries", "format_tags=comment"]) === MARK) {
    console.log(`= ${rel} (ya procesado)`);
    continue;
  }
  const fps = fpsOf(file);
  const vf = fps > 31 ? ["-vf", "fps=30"] : [];
  const audio = AUDIO.has(rel) ? ["-c:a", "aac", "-b:a", "128k"] : ["-an"];
  const common = ["-metadata", `comment=${MARK}`, "-movflags", "+faststart", "-pix_fmt", "yuv420p"];
  const tmp = file.replace(/\.mp4$/, ".tmp.mp4");
  const size = (await stat(file)).size;

  // versión AV1 de los banners (desde el original, antes de reemplazarlo)
  if (isBanner(rel)) {
    const av1 = file.replace(/\.mp4$/, "-av1.mp4");
    ff(["-i", file, ...vf, "-an", "-c:v", "libsvtav1", "-preset", "5", "-crf", "36", "-svtav1-params", "tune=0", ...common, av1]);
    console.log(`+ ${rel.replace(/\.mp4$/, "-av1.mp4")}: ${kb((await stat(av1)).size)}`);
  }

  ff(["-i", file, ...vf, ...audio, "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-profile:v", "high", ...common, tmp]);
  const out = (await stat(tmp)).size;
  before += size;
  if (out < size) {
    await rm(file);
    await rename(tmp, file);
    after += out;
    console.log(`✓ ${rel}: ${kb(size)} → ${kb(out)}`);
  } else {
    await rm(tmp);
    after += size;
    console.log(`· ${rel}: se deja el original (la versión nueva no pesaba menos)`);
  }
}

if (before) console.log(`\nH.264: ${(before / 1e6).toFixed(1)} MB → ${(after / 1e6).toFixed(1)} MB`);
if (!existsSync(root)) console.log("No existe public/media");
