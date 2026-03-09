import { supabase } from "@/lib/supabase";
import { Upload, X } from "lucide-react";
import { useCallback, useState } from "react";

interface ImageUploadProps {
  folder: string;
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ folder, value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("portfolio-images")
      .upload(path, file, { upsert: true });

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
          <img src={value} alt="" className="h-24 w-auto rounded-lg border border-gray-200 object-cover" />
          <button
            onClick={() => onChange("")}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 transition-colors hover:border-purple-400 hover:text-purple-600">
        <Upload size={16} />
        {uploading ? "Uploading..." : "Upload image"}
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>
    </div>
  );
}
