import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageUpload from "@/components/admin/ImageUpload";
import SortableList, { DragHandle } from "@/components/admin/SortableList";
import { getProjectsByFolder } from "@/components/work/projects";
import { useProjects } from "@/hooks/useProjects";
import { supabase } from "@/lib/supabase";
import { queryClient } from "@/lib/queryClient";
import { FolderPlus, Pencil, Plus, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

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
  const [isCustomFolder, setIsCustomFolder] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const knownFolders = useMemo(
    () => [...new Set(projects.map(p => p.folder))],
    [projects]
  );

  const openNew = () => { setEditing({ ...EMPTY, sort_order: projects.length }); setTechInput(""); setIsCustomFolder(false); };
  const openEdit = (p: typeof projects[0]) => {
    const isCustom = !knownFolders.includes(p.folder) && p.folder !== "";
    setEditing({
      id: p.id, title: p.title, file_name: p.fileName, folder: p.folder,
      description: p.description, image_url: p.image, tech_stack: p.techStack,
      url: p.url, year: p.year, sort_order: 0,
    });
    setTechInput(p.techStack.join(", "));
    setIsCustomFolder(isCustom);
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

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from("projects").delete().eq("id", deleteTarget.id);
    await queryClient.invalidateQueries({ queryKey: ["projects"] });
    setDeleteTarget(null);
  };

  const grouped = useMemo(() => getProjectsByFolder(projects), [projects]);
  const folderNames = useMemo(() => [...grouped.keys()], [grouped]);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);

  /** Rebuild flat array from folder groups, update cache + DB */
  const persistOrder = (newGrouped: Map<string, typeof projects>) => {
    const flat = [...newGrouped.values()].flat();
    queryClient.setQueryData(["projects"], flat);
    Promise.all(flat.map((p, i) =>
      supabase.from("projects").update({ sort_order: i, folder: p.folder }).eq("id", p.id)
    )).then(() => queryClient.invalidateQueries({ queryKey: ["projects"] }));
  };

  const reorderWithinFolder = (folder: string, reordered: typeof projects) => {
    const newGrouped = new Map(grouped);
    newGrouped.set(folder, reordered);
    persistOrder(newGrouped);
  };

  const reorderFolders = (reorderedNames: string[]) => {
    const newGrouped = new Map<string, typeof projects>();
    for (const name of reorderedNames) {
      newGrouped.set(name, grouped.get(name) ?? []);
    }
    persistOrder(newGrouped);
  };

  const moveToFolder = (projectId: string, targetFolder: string) => {
    const newGrouped = new Map<string, typeof projects>();
    let movedProject: typeof projects[0] | null = null;

    // Remove from current folder
    for (const [folder, items] of grouped) {
      const filtered = items.filter(p => {
        if (p.id === projectId) { movedProject = { ...p, folder: targetFolder }; return false; }
        return true;
      });
      if (filtered.length > 0) newGrouped.set(folder, filtered);
    }

    // Add to target folder
    if (movedProject) {
      const targetItems = newGrouped.get(targetFolder) ?? [];
      targetItems.push(movedProject);
      newGrouped.set(targetFolder, targetItems);
    }

    persistOrder(newGrouped);
  };

  const createFolder = () => {
    const name = newFolderName.trim();
    if (!name || knownFolders.includes(name)) return;
    // Just close the input — folder will appear once a project is moved into it
    setNewFolderName("");
    setShowNewFolder(false);
    // Create an empty placeholder project so the folder appears immediately,
    // or better: just move an existing project. For now, we add it to knownFolders
    // by inserting a temporary empty entry that gets cleaned up.
    // Simplest: just make it available in the folder dropdown by forcing a re-render.
    // We'll store custom folders in local state.
    setCustomFolders(prev => [...prev, name]);
  };

  const [customFolders, setCustomFolders] = useState<string[]>([]);
  const allFolders = useMemo(
    () => [...new Set([...knownFolders, ...customFolders])],
    [knownFolders, customFolders]
  );

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">{editing.id ? "Edit" : "New"} Project</h1>
          <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-200"><X size={20} /></button>
        </div>
        <div className="mt-6 max-w-2xl space-y-4">
          <Field label="Title" value={editing.title} onChange={v => setEditing({ ...editing, title: v })} />
          <Field label="File Name" value={editing.file_name} onChange={v => setEditing({ ...editing, file_name: v })} placeholder="e.g. devflow.ts" />
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Folder</label>
            <select
              value={isCustomFolder ? "__other__" : editing.folder}
              onChange={e => {
                if (e.target.value === "__other__") {
                  setIsCustomFolder(true);
                  setEditing({ ...editing, folder: "" });
                } else {
                  setIsCustomFolder(false);
                  setEditing({ ...editing, folder: e.target.value });
                }
              }}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            >
              {allFolders.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
              <option value="__other__">Other...</option>
            </select>
            {isCustomFolder && (
              <input
                value={editing.folder}
                onChange={e => setEditing({ ...editing, folder: e.target.value })}
                placeholder="Enter new folder name"
                autoFocus
                className="mt-1.5 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
          </div>
          <Field label="Tech Stack (comma-separated)" value={techInput} onChange={setTechInput} placeholder="React, TypeScript, Tailwind" />
          <Field label="URL" value={editing.url} onChange={v => setEditing({ ...editing, url: v })} />
          <Field label="Year" value={editing.year} onChange={v => setEditing({ ...editing, year: v })} />
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Image</label>
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Projects</h1>
          <p className="text-sm text-gray-500">{projects.length} projects</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button onClick={() => setShowNewFolder(true)} className="flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800">
            <FolderPlus size={16} /> New Folder
          </button>
          <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
            <Plus size={16} /> Add Project
          </button>
        </div>
      </div>

      {showNewFolder && (
        <div className="mt-4 flex items-center gap-2">
          <input
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && createFolder()}
            placeholder="Folder name..."
            autoFocus
            className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-purple-500"
          />
          <button onClick={createFolder} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">Create</button>
          <button onClick={() => { setShowNewFolder(false); setNewFolderName(""); }} className="rounded-lg px-3 py-2 text-sm text-gray-400 hover:text-gray-200">Cancel</button>
        </div>
      )}

      <div className="mt-6 space-y-8">
        <SortableList items={folderNames} getId={f => f} onReorder={reorderFolders} renderItem={(folder, _fi, folderDragHandle) => {
          const folderProjects = grouped.get(folder) ?? [];
          return (
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <div className="mb-3 flex items-center gap-2">
                <DragHandle dragHandle={folderDragHandle} />
                <h2 className="text-sm font-medium text-gray-400">{folder} <span className="text-gray-600">({folderProjects.length})</span></h2>
              </div>
              <div className="space-y-3">
                <SortableList items={folderProjects} getId={p => p.id} onReorder={reordered => reorderWithinFolder(folder, reordered)} renderItem={(p, _i, dragHandle) => (
                  <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <DragHandle dragHandle={dragHandle} />
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      {p.image && <img src={p.image} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />}
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">{p.title}</p>
                        <p className="text-xs text-gray-500">{p.year}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {allFolders.length > 1 && (
                        <select
                          value={p.folder}
                          onChange={e => moveToFolder(p.id, e.target.value)}
                          className="rounded-lg border border-gray-700 bg-gray-800 px-2 py-1.5 text-xs text-gray-400 outline-none hover:border-gray-600"
                        >
                          {allFolders.map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      )}
                      <button onClick={() => openEdit(p)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-gray-200"><Pencil size={16} /></button>
                      <button onClick={() => setDeleteTarget({ id: p.id, title: p.title })} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/15 hover:text-red-400"><Trash2 size={16} /></button>
                    </div>
                  </div>
                )} />
              </div>
            </div>
          );
        }} />
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
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
