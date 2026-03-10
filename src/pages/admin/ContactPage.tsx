import SortableList, { DragHandle } from "@/components/admin/SortableList";
import { useContactInfo, type Social } from "@/hooks/useContactInfo";
import { supabase } from "@/lib/supabase";
import { queryClient } from "@/lib/queryClient";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ContactPage() {
  const { data } = useContactInfo();
  const [form, setForm] = useState({ location: "", email: "", availability: "" });
  const [socials, setSocials] = useState<Social[]>([]);
  const [saving, setSaving] = useState(false);
  const [dbId, setDbId] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    supabase.from("contact_info").select("id").single().then(({ data: row }) => setDbId(row?.id ?? null));
    setForm({ location: data.location, email: data.email, availability: data.availability });
    setSocials(data.socials);
  }, [data]);

  const save = async () => {
    if (!dbId) return;
    setSaving(true);
    await supabase.from("contact_info").update({ ...form, socials }).eq("id", dbId);
    await queryClient.invalidateQueries({ queryKey: ["contactInfo"] });
    setSaving(false);
  };

  const addSocial = () => {
    setSocials([...socials, { icon: "Github", label: "", href: "", handle: "" }]);
  };

  const updateSocial = (i: number, key: keyof Social, value: string) => {
    const updated = [...socials];
    updated[i] = { ...updated[i], [key]: value };
    setSocials(updated);
  };

  const removeSocial = (i: number) => {
    setSocials(socials.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-white">Contact</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your contact info and social links</p>
      </div>

      {/* Contact Info */}
      <div>
        <h2 className="text-lg font-semibold text-white">Contact Info</h2>
        <div className="mt-4 max-w-2xl space-y-4">
          <Field label="Location" value={form.location} onChange={v => setForm({ ...form, location: v })} placeholder="e.g. Islamabad, Pakistan" />
          <Field label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="e.g. dev@example.com" />
          <Field label="Availability Status" value={form.availability} onChange={v => setForm({ ...form, availability: v })} placeholder="e.g. Available for freelance projects" />
        </div>
      </div>

      {/* Socials */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Socials</h2>
          <button onClick={addSocial} className="flex shrink-0 items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
            <Plus size={16} /> Add Social
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <SortableList items={socials} getId={(_s, i) => String(i)} onReorder={setSocials} renderItem={(s, i, dragHandle) => (
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DragHandle dragHandle={dragHandle} />
                  <span className="text-sm font-medium text-gray-300">Social #{i + 1}</span>
                </div>
                <button onClick={() => removeSocial(i)} className="rounded-lg p-1 text-gray-400 hover:bg-red-500/15 hover:text-red-400"><Trash2 size={16} /></button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Icon</label>
                  <select value={s.icon} onChange={e => updateSocial(i, "icon", e.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100">
                    <option value="Github">GitHub</option>
                    <option value="Linkedin">LinkedIn</option>
                    <option value="Mail">Email</option>
                    <option value="Twitter">Twitter / X</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Youtube">YouTube</option>
                    <option value="Globe">Website</option>
                  </select>
                </div>
                <Field label="Label" value={s.label} onChange={v => updateSocial(i, "label", v)} placeholder="e.g. GitHub" />
                <Field label="URL" value={s.href} onChange={v => updateSocial(i, "href", v)} placeholder="e.g. https://github.com/..." />
                <Field label="Handle" value={s.handle} onChange={v => updateSocial(i, "handle", v)} placeholder="e.g. @username" />
              </div>
            </div>
          )} />
        </div>
      </div>

      <button onClick={save} disabled={saving} className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50">
        {saving ? "Saving..." : "Save Contact Info"}
      </button>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
    </div>
  );
}
