import ImageUpload from "@/components/admin/ImageUpload";
import { useProjects } from "@/hooks/useProjects";
import { supabase } from "@/lib/supabase";
import { queryClient } from "@/lib/queryClient";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

interface ProjectForm {
  id?: string;
  title: string;
  file_name: string;
  folder: string;
  description: string;
  image_url: string;
  tech_stack: string[];
  url: string;
  year: string;
  sort_order: number;
}

const EMPTY: ProjectForm = {
  title: "", file_name: "", folder: "Websites", description: "",
  image_url: "", tech_stack: [], url: "", year: "", sort_order: 0,
};

export default function ProjectsPage() {
  const { data: projects = [] } = useProjects();
  const [editing, setEditing] = useState<ProjectForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState("");

  const openNew = () => { setEditing({ ...EMPTY }); setTechInput(""); };
  const openEdit = (p: typeof projects[0]) => {
    setEditing({
      id: p.id, title: p.title, file_name: p.fileName, folder: p.folder,
      description: p.description, image_url: p.image, tech_stack: p.techStack,
      url: p.url, year: p.year, sort_order: 0,
    });
    setTechInput(p.techStack.join(", "));
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const techStack = techInput.split(",").map(s => s.trim()).filter(Boolean);
    const row = { ...editing, tech_stack: techStack };
    delete (row as Record<string, unknown>).id;

    if (editing.id) {
      await supabase.from("projects").update(row).eq("id", editing.id);
    } else {
      await supabase.from("projects").insert(row);
    }
    await queryClient.invalidateQueries({ queryKey: ["projects"] });
    setEditing(null);
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    await queryClient.invalidateQueries({ queryKey: ["projects"] });
  };

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{editing.id ? "Edit" : "New"} Project</h1>
          <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="mt-6 max-w-2xl space-y-4">
          <Field label="Title" value={editing.title} onChange={v => setEditing({ ...editing, title: v })} />
          <Field label="File Name" value={editing.file_name} onChange={v => setEditing({ ...editing, file_name: v })} placeholder="e.g. devflow.ts" />
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Folder</label>
            <input
              list="folder-options"
              value={editing.folder}
              onChange={e => setEditing({ ...editing, folder: e.target.value })}
              placeholder="Select or type a new folder"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <datalist id="folder-options">
              {[...new Set(projects.map(p => p.folder))].map(f => (
                <option key={f} value={f} />
              ))}
            </datalist>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <Field label="Tech Stack (comma-separated)" value={techInput} onChange={setTechInput} placeholder="React, TypeScript, Tailwind" />
          <Field label="URL" value={editing.url} onChange={v => setEditing({ ...editing, url: v })} />
          <Field label="Year" value={editing.year} onChange={v => setEditing({ ...editing, year: v })} />
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Image</label>
            <ImageUpload folder="projects" value={editing.image_url} onChange={v => setEditing({ ...editing, image_url: v })} />
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
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-gray-500">{projects.length} projects</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
          <Plus size={16} /> Add Project
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {projects.map(p => (
          <div key={p.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-4">
              {p.image && <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" />}
              <div>
                <p className="font-medium text-gray-900">{p.title}</p>
                <p className="text-xs text-gray-500">{p.folder} · {p.year}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(p)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><Pencil size={16} /></button>
              <button onClick={() => remove(p.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
    </div>
  );
}
