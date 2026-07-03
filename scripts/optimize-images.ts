/**
 * Batch-optimize every image in the "portfolio-images" Supabase Storage bucket
 * IN PLACE — same path, same filename, same format/content-type — so the live
 * site is unaffected (URLs don't change) but the images are smaller.
 *
 * For each raster image: respects EXIF orientation, resizes the longest edge
 * down to MAX_EDGE, and re-encodes in the SAME format with sensible quality.
 * Re-uploads (upsert) only when the result is actually smaller.
 *
 * Requires sharp (install first — this script does NOT install it):
 *   npm i -D sharp
 *
 * Requires the SERVICE ROLE key (the anon key cannot write — storage RLS
 * requires an authenticated role). Reads SUPABASE_URL / VITE_SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY from the environment, falling back to .env.
 *
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ... npx tsx scripts/optimize-images.ts
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadDotEnv() {
  const envPath = resolve(ROOT, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = trimmed.slice(eq + 1).trim();
  }
}
loadDotEnv();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing env. Set SUPABASE_SERVICE_ROLE_KEY (the service_role key, NOT the anon key) — " +
      "the anon key cannot write to storage. SUPABASE_URL falls back to VITE_SUPABASE_URL from .env."
  );
  process.exit(1);
}

const BUCKET = "portfolio-images";
const MAX_EDGE = 1600;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

interface StorageFile {
  name: string;
  id: string | null; // folders have a null id
}

async function listAllFiles(prefix = ""): Promise<string[]> {
  const paths: string[] = [];
  const pageSize = 100;
  let offset = 0;

  for (;;) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(prefix, { limit: pageSize, offset });
    if (error) throw new Error(`Failed to list "${prefix}": ${error.message}`);
    if (!data || data.length === 0) break;

    for (const entry of data as StorageFile[]) {
      const fullPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id === null) paths.push(...(await listAllFiles(fullPath)));
      else paths.push(fullPath);
    }

    if (data.length < pageSize) break;
    offset += pageSize;
  }
  return paths;
}

// Optimize in the SAME format so the content-type / extension stay valid.
// gif/svg are skipped (animation / vector).
function isOptimizable(path: string): boolean {
  return /\.(jpe?g|png|webp|avif|tiff?)$/i.test(path);
}

async function reencode(
  input: Buffer
): Promise<{ buffer: Buffer; contentType: string } | null> {
  const meta = await sharp(input).metadata();
  const base = sharp(input)
    .rotate()
    .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true });

  switch (meta.format) {
    case "jpeg":
      return { buffer: await base.jpeg({ quality: 80, mozjpeg: true }).toBuffer(), contentType: "image/jpeg" };
    case "png":
      return { buffer: await base.png({ compressionLevel: 9, palette: true }).toBuffer(), contentType: "image/png" };
    case "webp":
      return { buffer: await base.webp({ quality: 82 }).toBuffer(), contentType: "image/webp" };
    case "avif":
      return { buffer: await base.avif({ quality: 55 }).toBuffer(), contentType: "image/avif" };
    case "tiff":
      return { buffer: await base.tiff({ quality: 80 }).toBuffer(), contentType: "image/tiff" };
    default:
      return null;
  }
}

async function main() {
  console.log(`Optimizing images in bucket "${BUCKET}" (in place, same names)…`);

  const files = await listAllFiles();
  const images = files.filter(isOptimizable);
  console.log(`Found ${files.length} files, ${images.length} optimizable images.`);

  let optimized = 0;
  let skipped = 0;
  let bytesSaved = 0;

  for (const path of images) {
    const { data: blob, error: dlError } = await supabase.storage.from(BUCKET).download(path);
    if (dlError || !blob) {
      console.warn(`  skip ${path}: download failed (${dlError?.message ?? "no data"})`);
      skipped++;
      continue;
    }

    const original = Buffer.from(await blob.arrayBuffer());

    let out: { buffer: Buffer; contentType: string } | null;
    try {
      out = await reencode(original);
    } catch (err) {
      console.warn(`  skip ${path}: encode failed (${(err as Error).message})`);
      skipped++;
      continue;
    }
    if (!out) {
      skipped++;
      continue;
    }

    if (out.buffer.length >= original.length) {
      console.log(`  keep ${path}: already optimal (${(original.length / 1024).toFixed(1)} KB)`);
      skipped++;
      continue;
    }

    const { error: upError } = await supabase.storage
      .from(BUCKET)
      .upload(path, out.buffer, { upsert: true, contentType: out.contentType, cacheControl: "31536000" });

    if (upError) {
      console.warn(`  skip ${path}: upload failed (${upError.message})`);
      skipped++;
      continue;
    }

    const saved = original.length - out.buffer.length;
    bytesSaved += saved;
    optimized++;
    console.log(
      `  done ${path}: ${(original.length / 1024).toFixed(1)} -> ${(out.buffer.length / 1024).toFixed(1)} KB (-${(saved / 1024).toFixed(1)} KB)`
    );
  }

  console.log(
    `\nOptimized ${optimized}, skipped ${skipped}. Total saved: ${(bytesSaved / 1024 / 1024).toFixed(2)} MB.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
