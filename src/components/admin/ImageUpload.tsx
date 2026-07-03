import { supabase } from "@/lib/supabase";
import { optimizedImageUrl } from "@/lib/imageUrl";
import { Upload, X } from "lucide-react";
import { useCallback, useState } from "react";

interface ImageUploadProps {
  folder: string;
  value: string;
  onChange: (url: string) => void;
}

// Cap the longest edge of uploaded images so originals stay small regardless
// of the Supabase plan. Raster images are re-encoded to WebP; anything else
// (SVG/PDF) or a compression failure falls back to the original file.
const MAX_EDGE = 1600;
const WEBP_QUALITY = 0.82;

/**
 * Downscale + re-encode a raster image to WebP via a canvas.
 * Returns the original file untouched if it is not a compressible raster
 * image or if any step fails.
 */
async function compressImage(file: File): Promise<File> {
  // Only attempt raster formats. SVG/PDF/etc. pass through untouched.
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;

    const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
    const targetW = Math.round(width * scale);
    const targetH = Math.round(height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, targetW, targetH);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", WEBP_QUALITY)
    );
    if (!blob) return file;

    const baseName = file.name.replace(/\.[^./\\]+$/, "");
    return new File([blob], `${baseName}.webp`, { type: "image/webp" });
  } catch {
    // Decoding/encoding failed — upload the original untouched.
    return file;
  }
}

export default function ImageUpload({ folder, value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadFile = await compressImage(file);
    const ext = uploadFile.name.split(".").pop();
    const path = `${folder}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("portfolio-images")
      .upload(path, uploadFile, { upsert: true });

    if (!error) {
      const { data } = supabase.storage
        .from("portfolio-images")
        .getPublicUrl(path);
      onChange(data.publicUrl);
    }
    setUploading(false);
  }, [folder, onChange]);

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative inline-block">
          <img
            src={optimizedImageUrl(value, { width: 200, resize: "contain" })}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-24 w-auto rounded-lg border border-gray-700 object-cover"
          />
          <button
            onClick={() => onChange("")}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-600 px-4 py-3 text-sm text-gray-400 transition-colors hover:border-purple-400 hover:text-purple-400">
        <Upload size={16} />
        {uploading ? "Uploading..." : "Upload image"}
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>
    </div>
  );
}
