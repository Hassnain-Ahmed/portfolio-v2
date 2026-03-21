import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageUpload from "@/components/admin/ImageUpload";
import { supabase } from "@/lib/supabase";
import { queryClient } from "@/lib/queryClient";
import { useTestimonials } from "@/hooks/useTestimonials";
import { Check, Plus, Save, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface TestimonialItem {
  id?: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar_url: string;
  rating: number;
  featured: boolean;
  approved: boolean;
  sort_order: number;
}

const emptyItem = (): TestimonialItem => ({
  name: "",
  role: "",
  company: "",
  content: "",
  avatar_url: "",
  rating: 5,
  featured: false,
  approved: true,
  sort_order: 0,
});

export default function TestimonialsPage() {
  const { data: testimonials } = useTestimonials();
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [savingIdx, setSavingIdx] = useState<number | null>(null);
  const [savedIdx, setSavedIdx] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  useEffect(() => {
    if (!testimonials) return;
    const dbItems: TestimonialItem[] = testimonials.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      company: t.company,
      content: t.content,
      avatar_url: t.avatar_url,
      rating: t.rating,
      featured: t.featured,
      approved: t.approved,
      sort_order: t.sort_order,
    }));
    // Preserve unsaved new items (no id) when DB data refreshes
    setItems((prev) => {
      const unsaved = prev.filter((item) => !item.id);
      return [...dbItems, ...unsaved];
    });
  }, [testimonials]);

  const add = () => {
    setItems((prev) => [...prev, { ...emptyItem(), sort_order: prev.length }]);
  };

  const update = (i: number, key: string, value: string | number | boolean) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[i] = { ...updated[i], [key]: value };
      return updated;
    });
  };

  const saveOne = async (i: number) => {
    setSavingIdx(i);
    const item = items[i];
    const row = {
      name: item.name,
      role: item.role,
      company: item.company,
      content: item.content,
      avatar_url: item.avatar_url,
      rating: item.rating,
      featured: item.featured,
      approved: item.approved,
      sort_order: i,
    };

    if (item.id) {
      await supabase.from("testimonials").update(row).eq("id", item.id);
    } else {
      const { data } = await supabase
        .from("testimonials")
        .insert(row)
        .select("id")
        .single();
      if (data) {
        setItems((prev) => {
          const updated = [...prev];
          updated[i] = { ...updated[i], id: data.id };
          return updated;
        });
      }
    }
    await queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    setSavingIdx(null);
    setSavedIdx(i);
    setTimeout(() => setSavedIdx(null), 2000);
  };

  const approveOne = async (i: number) => {
    const item = items[i];
    if (!item.id) return;
    setSavingIdx(i);
    await supabase.from("testimonials").update({ approved: true }).eq("id", item.id);
    setItems((prev) => {
      const updated = [...prev];
      updated[i] = { ...updated[i], approved: true };
      return updated;
    });
    await queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    setSavingIdx(null);
    setSavedIdx(i);
    setTimeout(() => setSavedIdx(null), 2000);
  };

  const confirmDelete = async () => {
    if (deleteTarget === null) return;
    const item = items[deleteTarget];
    if (item.id) {
      await supabase.from("testimonials").delete().eq("id", item.id);
    }
    setItems((prev) => prev.filter((_, idx) => idx !== deleteTarget));
    await queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Testimonials</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage client testimonials shown on your portfolio.
          </p>
        </div>
        <button
          onClick={add}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
        >
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={item.id ?? `new-${i}`}
            className={`rounded-xl border p-5 ${
              item.approved
                ? "border-gray-800 bg-gray-900"
                : "border-yellow-500/30 bg-gray-900"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Avatar */}
              <div className="shrink-0">
                <ImageUpload
                  folder="testimonials"
                  value={item.avatar_url}
                  onChange={(url) => update(i, "avatar_url", url)}
                />
              </div>

              {/* Fields */}
              <div className="flex-1 space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <input
                    value={item.name}
                    onChange={(e) => update(i, "name", e.target.value)}
                    placeholder="Name"
                    className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-purple-500"
                  />
                  <input
                    value={item.role}
                    onChange={(e) => update(i, "role", e.target.value)}
                    placeholder="Role / Title"
                    className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-purple-500"
                  />
                  <input
                    value={item.company}
                    onChange={(e) => update(i, "company", e.target.value)}
                    placeholder="Company"
                    className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-purple-500"
                  />
                </div>

                <textarea
                  value={item.content}
                  onChange={(e) => update(i, "content", e.target.value)}
                  placeholder="Testimonial content..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-purple-500 resize-none"
                />

                <div className="flex flex-wrap items-center gap-4">
                  {/* Star rating */}
                  <div className="flex items-center gap-1">
                    <span className="mr-1 text-xs text-gray-500">Rating:</span>
                    {Array.from({ length: 5 }, (_, s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => update(i, "rating", s + 1)}
                        className="cursor-pointer transition-colors"
                      >
                        <Star
                          size={18}
                          className={
                            s < item.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-none text-gray-600 hover:text-yellow-400"
                          }
                        />
                      </button>
                    ))}
                  </div>

                  {/* Approval status */}
                  {item.approved ? (
                    <span className="rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-medium text-green-400">
                      Approved
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => approveOne(i)}
                      disabled={savingIdx === i}
                      className="flex items-center gap-1 rounded-full bg-yellow-500/15 px-2.5 py-0.5 text-xs font-medium text-yellow-400 transition-colors hover:bg-green-500/15 hover:text-green-400"
                    >
                      <Check size={12} />
                      {savingIdx === i ? "Approving..." : "Approve"}
                    </button>
                  )}

                  {/* Featured */}
                  <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.featured}
                      onChange={(e) => update(i, "featured", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500"
                    />
                    Featured
                  </label>

                  <div className="ml-auto flex items-center gap-2">
                    {/* Save */}
                    <button
                      onClick={() => saveOne(i)}
                      disabled={savingIdx === i || !item.name || !item.content}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50 ${
                        savedIdx === i
                          ? "bg-green-600"
                          : "bg-purple-600 hover:bg-purple-700"
                      }`}
                    >
                      <Save size={14} />
                      {savingIdx === i
                        ? "Saving..."
                        : savedIdx === i
                          ? "Saved!"
                          : "Save"}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteTarget(i)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-500/15 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-600">
            No testimonials yet. Click &quot;Add Testimonial&quot; to get started.
          </p>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Testimonial"
        message={
          deleteTarget !== null
            ? `Are you sure you want to delete the testimonial from "${items[deleteTarget]?.name || "this person"}"? This action cannot be undone.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
