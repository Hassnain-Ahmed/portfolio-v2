import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageUpload from "@/components/admin/ImageUpload";
import { useProfile } from "@/hooks/useProfile";

import { supabase } from "@/lib/supabase";
import { queryClient } from "@/lib/queryClient";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function AboutPage() {
  const { data } = useProfile();

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold text-white">About</h1>
      <ProfileSection profile={data?.profile} />
      <ExperienceSection experience={data?.experience ?? []} />
      <SkillsSection skills={data?.skills ?? []} />
    </div>
  );
}

// --- Profile Section ---
function ProfileSection({ profile }: { profile?: ReturnType<typeof useProfile>["data"] extends infer T ? T extends { profile: infer P } ? P : never : never }) {
  const [form, setForm] = useState({
    name: "", handle: "", title: "", bio: "", avatar_url: "",
    location: "", email: "", status_emoji: "", status_text: "",
    highlights: [] as string[],
  });
  const [highlightInput, setHighlightInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [dbId, setDbId] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    supabase.from("profile").select("id").single().then(({ data }) => setDbId(data?.id ?? null));
    setForm({
      name: profile.name, handle: profile.handle, title: profile.title, bio: profile.bio,
      avatar_url: profile.avatar, location: profile.location, email: profile.email,
      status_emoji: profile.status.emoji, status_text: profile.status.text,
      highlights: profile.highlights,
    });
    setHighlightInput(profile.highlights.join(", "));
  }, [profile]);

  const save = async () => {
    if (!dbId) return;
    setSaving(true);
    const highlights = highlightInput.split(",").map(s => s.trim()).filter(Boolean);
    await supabase.from("profile").update({ ...form, highlights }).eq("id", dbId);
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    setSaving(false);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-white">Profile</h2>
      <div className="mt-4 max-w-2xl space-y-4">
        <Field label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
        <Field label="Handle" value={form.handle} onChange={v => setForm({ ...form, handle: v })} />
        <Field label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} />
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Bio</label>
          <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
        </div>
        <Field label="Location" value={form.location} onChange={v => setForm({ ...form, location: v })} />
        <Field label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
        <Field label="Status Emoji" value={form.status_emoji} onChange={v => setForm({ ...form, status_emoji: v })} />
        <Field label="Status Text" value={form.status_text} onChange={v => setForm({ ...form, status_text: v })} />
        <Field label="Highlights (comma-separated)" value={highlightInput} onChange={setHighlightInput} />
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Avatar</label>
          <ImageUpload folder="about" value={form.avatar_url} onChange={v => setForm({ ...form, avatar_url: v })} />
        </div>
        <button onClick={save} disabled={saving} className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50">
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

// --- Experience Section ---
function ExperienceSection({ experience }: { experience: { role: string; company: string; period: string; description: string }[] }) {
  const [editing, setEditing] = useState<{ id?: string; role: string; company: string; period: string; description: string; sort_order: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ role: string; company: string } | null>(null);

  const openNew = () => setEditing({ role: "", company: "", period: "", description: "", sort_order: experience.length });
  const openEdit = async (exp: typeof experience[0], i: number) => {
    const { data } = await supabase.from("experience").select("id").eq("role", exp.role).eq("company", exp.company).single();
    setEditing({ id: data?.id, role: exp.role, company: exp.company, period: exp.period, description: exp.description, sort_order: i });
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const { id, ...row } = editing;
    if (id) {
      await supabase.from("experience").update(row).eq("id", id);
    } else {
      await supabase.from("experience").insert(row);
    }
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    setEditing(null);
    setSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from("experience").delete().eq("role", deleteTarget.role).eq("company", deleteTarget.company);
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    setDeleteTarget(null);
  };

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{editing.id ? "Edit" : "Add"} Experience</h2>
          <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-200"><X size={20} /></button>
        </div>
        <div className="mt-4 max-w-2xl space-y-4">
          <Field label="Role" value={editing.role} onChange={v => setEditing({ ...editing, role: v })} />
          <Field label="Company" value={editing.company} onChange={v => setEditing({ ...editing, company: v })} />
          <Field label="Period" value={editing.period} onChange={v => setEditing({ ...editing, period: v })} placeholder="e.g. Jan 2025 - Present" />
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
          </div>
          <button onClick={save} disabled={saving} className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Experience</h2>
        <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
          <Plus size={16} /> Add
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {experience.map((exp, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="min-w-0">
              <p className="font-medium text-white">{exp.role}</p>
              <p className="text-xs text-gray-500">{exp.company} · {exp.period}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => openEdit(exp, i)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-gray-200"><Pencil size={16} /></button>
              <button onClick={() => setDeleteTarget({ role: exp.role, company: exp.company })} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/15 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Experience"
        message={`Are you sure you want to delete "${deleteTarget?.role} at ${deleteTarget?.company}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

// --- Skills Section ---
function SkillsSection({ skills }: { skills: string[] }) {
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (!input.trim()) return;
    setSaving(true);
    await supabase.from("skills").insert({ name: input.trim(), sort_order: skills.length });
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    setInput("");
    setSaving(false);
  };

  const remove = async (name: string) => {
    await supabase.from("skills").delete().eq("name", name);
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-white">Skills</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map(s => (
          <span key={s} className="flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-sm text-gray-300">
            {s}
            <button onClick={() => remove(s)} className="text-gray-500 hover:text-red-400"><X size={14} /></button>
          </span>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="Add skill..." className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-purple-500" />
        <button onClick={add} disabled={saving} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50">
          {saving ? "..." : "Add"}
        </button>
      </div>
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
