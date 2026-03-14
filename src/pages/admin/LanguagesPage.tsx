import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { supabase } from "@/lib/supabase";
import { queryClient } from "@/lib/queryClient";
import { useLanguages } from "@/hooks/useLanguages";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface LangItem {
  id?: string;
  name: string;
  percentage: number;
  color: string;
  icon_url: string;
  sort_order: number;
}

export default function LanguagesPage() {
  const { data: languages } = useLanguages();
  const [items, setItems] = useState<LangItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("languages")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        setItems(
          (data ?? []).map((r) => ({
            id: r.id,
            name: r.name,
            percentage: r.percentage,
            color: r.color,
            icon_url: r.icon_url ?? "",
            sort_order: r.sort_order,
          }))
        );
      });
  }, [languages]);

  const add = () => {
    setItems([
      ...items,
      { name: "", percentage: 0, color: "#9CA3AF", icon_url: "", sort_order: items.length },
    ]);
  };

  const update = (i: number, key: string, value: string | number) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [key]: value };
    setItems(updated);
  };

  const remove = async (i: number) => {
    const item = items[i];
    if (item.id) {
      await supabase.from("languages").delete().eq("id", item.id);
    }
    setItems(prev => prev.filter((_, idx) => idx !== i));
    await queryClient.invalidateQueries({ queryKey: ["languages"] });
  };

  const confirmDelete = async () => {
    if (deleteTarget === null) return;
    await remove(deleteTarget);
    setDeleteTarget(null);
  };

  const saveAll = async () => {
    setSaving(true);

    // Build rows without icon_url (safe baseline that always works)
    const baseRows = items.map((item, i) => ({
      name: item.name,
      percentage: item.percentage,
      color: item.color,
      sort_order: i,
    }));

    // Probe whether icon_url column exists by trying a harmless select
    const { error: probeErr } = await supabase
      .from("languages")
      .select("icon_url")
      .limit(1);
    const hasIconCol = !probeErr;

    // Build full rows only if column exists
    const insertRows = hasIconCol
      ? items.map((item, i) => ({
          name: item.name,
          percentage: item.percentage,
          color: item.color,
          icon_url: item.icon_url,
          sort_order: i,
        }))
      : baseRows;

    // Delete old rows
    await supabase
      .from("languages")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (insertRows.length > 0) {
      const { error } = await supabase.from("languages").insert(insertRows);
      // Last-resort fallback: retry without icon_url
      if (error) {
        await supabase.from("languages").insert(baseRows);
      }
    }

    await queryClient.invalidateQueries({ queryKey: ["languages"] });
    const { data } = await supabase
      .from("languages")
      .select("*")
      .order("sort_order");
    setItems(
      (data ?? []).map((r) => ({
        id: r.id,
        name: r.name,
        percentage: r.percentage,
        color: r.color,
        icon_url: r.icon_url ?? "",
        sort_order: r.sort_order,
      }))
    );
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Languages</h1>
          <p className="mt-1 text-sm text-gray-500">Manage programming languages shown on your profile.</p>
        </div>
        <button
          onClick={add}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
        >
          <Plus size={16} /> Add Language
        </button>
      </div>

      <div className="space-y-3">
        {items.map((lang, i) => (
          <div
            key={i}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 p-4 sm:flex-nowrap"
          >
            {/* Color picker + hex input */}
            <div className="flex shrink-0 items-center gap-1.5">
              <input
                type="color"
                value={lang.color}
                onChange={(e) => update(i, "color", e.target.value)}
                className="h-8 w-8 shrink-0 cursor-pointer rounded border-0 bg-transparent"
                title="Language color"
              />
              <input
                value={lang.color}
                onChange={(e) => {
                  let v = e.target.value;
                  if (!v.startsWith("#")) v = "#" + v;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) update(i, "color", v);
                }}
                maxLength={7}
                className="w-20 rounded-lg border border-gray-700 bg-gray-800 px-2 py-1.5 font-mono text-xs text-gray-300 outline-none focus:border-purple-500"
                placeholder="#000000"
              />
            </div>

            {/* Icon upload */}
            <IconUpload
              value={lang.icon_url}
              onChange={(url) => update(i, "icon_url", url)}
            />

            {/* Name */}
            <input
              value={lang.name}
              onChange={(e) => update(i, "name", e.target.value)}
              placeholder="Language name"
              className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-purple-500"
            />

            {/* Percentage */}
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={100}
                value={lang.percentage}
                onChange={(e) => update(i, "percentage", parseInt(e.target.value) || 0)}
                className="w-16 rounded-lg border border-gray-700 bg-gray-800 px-2 py-2 text-center text-sm text-gray-100 outline-none focus:border-purple-500"
              />
              <span className="text-sm text-gray-500">%</span>
            </div>

            {/* Delete */}
            <button
              onClick={() => setDeleteTarget(i)}
              className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-red-500/15 hover:text-red-400"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-600">No languages added yet. Click "Add Language" to get started.</p>
        )}
      </div>

      {items.length > 0 && (
        <button
          onClick={saveAll}
          disabled={saving}
          className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Languages"}
        </button>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Language"
        message={
          deleteTarget !== null
            ? `Are you sure you want to delete "${items[deleteTarget]?.name || "this language"}"? This action cannot be undone.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

// --- Inline icon uploader (small, fits in a row) ---

function IconUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      const ext = file.name.split(".").pop();
      const path = `languages/${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from("portfolio-images")
        .upload(path, file, { upsert: true });

      if (!error) {
        const { data } = supabase.storage.from("portfolio-images").getPublicUrl(path);
        onChange(data.publicUrl);
      }
      setUploading(false);
    },
    [onChange]
  );

  if (value) {
    return (
      <div className="relative shrink-0">
        <img
          src={value}
          alt=""
          className="h-8 w-8 rounded border border-gray-700 object-contain bg-gray-800 p-0.5"
        />
        <button
          onClick={() => onChange("")}
          className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
        >
          <X size={10} />
        </button>
      </div>
    );
  }

  return (
    <label
      className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded border border-dashed border-gray-600 text-gray-500 transition-colors hover:border-purple-400 hover:text-purple-400"
      title="Upload icon (PNG or SVG)"
    >
      {uploading ? (
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-500 border-t-purple-400" />
      ) : (
        <Upload size={14} />
      )}
      <input
        type="file"
        accept="image/png,image/svg+xml"
        className="hidden"
        onChange={handleUpload}
        disabled={uploading}
      />
    </label>
  );
}
