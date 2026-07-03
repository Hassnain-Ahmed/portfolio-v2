const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL ?? "";

/**
 * The Supabase Storage transforms feature (on-the-fly resize/quality/format)
 * requires a **Pro plan or higher**. On the Free plan the
 * `/storage/v1/render/image/public/...` endpoint returns an error, so this
 * helper is **safe-by-default OFF**: it only rewrites URLs when the env flag
 * `VITE_SUPABASE_IMAGE_TRANSFORMS === "true"` is explicitly set. When the flag
 * is off (the default), the original URL is returned untouched.
 *
 * Public storage URLs look like:
 *   https://<ref>.supabase.co/storage/v1/object/public/portfolio-images/...
 * The transform endpoint is:
 *   https://<ref>.supabase.co/storage/v1/render/image/public/portfolio-images/...?width=...&quality=...&resize=...
 *
 * @param url  The stored public storage URL (or any string).
 * @param opts Optional transform params: target width, quality (0-100),
 *             and resize mode ("cover" | "contain" | "fill").
 * @returns    A rewritten transform URL when eligible, otherwise the original
 *             url unchanged (empty/undefined and non-Supabase URLs such as
 *             GitHub avatars pass through untouched).
 */
export function optimizedImageUrl(
  url: string,
  opts?: { width?: number; quality?: number; resize?: "cover" | "contain" | "fill" }
): string {
  // Pass through empty/undefined values untouched.
  if (!url) return url;

  // Safe-by-default: only rewrite when transforms are explicitly enabled.
  if (import.meta.env.VITE_SUPABASE_IMAGE_TRANSFORMS !== "true") return url;

  const publicMarker = "/storage/v1/object/public/";

  // Only rewrite Supabase storage public URLs from this project's instance.
  // Non-Supabase URLs (e.g. GitHub avatars) pass through untouched.
  if (SUPABASE_URL && !url.startsWith(SUPABASE_URL)) return url;
  if (!url.includes(publicMarker)) return url;

  const transformed = url.replace(
    publicMarker,
    "/storage/v1/render/image/public/"
  );

  const params = new URLSearchParams();
  if (opts?.width != null) params.set("width", String(opts.width));
  if (opts?.quality != null) params.set("quality", String(opts.quality));
  if (opts?.resize != null) params.set("resize", opts.resize);

  const query = params.toString();
  if (!query) return transformed;

  // Preserve any pre-existing query params on the URL.
  const separator = transformed.includes("?") ? "&" : "?";
  return `${transformed}${separator}${query}`;
}
