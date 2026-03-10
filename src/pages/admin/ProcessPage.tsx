import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageUpload from "@/components/admin/ImageUpload";
import SortableList, { DragHandle } from "@/components/admin/SortableList";
import { useProcessSteps } from "@/hooks/useProcessSteps";
import { supabase } from "@/lib/supabase";
import { queryClient } from "@/lib/queryClient";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import {
  IconBulb,
  IconSearch,
  IconLayersIntersect,
  IconPalette,
  IconCode,
  IconTestPipe,
  IconRocket,
  IconBrain,
  IconDatabase,
  IconServer,
  IconDevices,
  IconBug,
  IconGitBranch,
  IconTerminal,
  IconCloudComputing,
  IconApi,
  IconLock,
  IconChartBar,
  IconRefresh,
  IconSettings,
} from "@tabler/icons-react";
import { useState } from "react";

const AVAILABLE_ICONS = [
  { name: "IconBulb", icon: IconBulb, label: "Bulb" },
  { name: "IconSearch", icon: IconSearch, label: "Search" },
  { name: "IconLayersIntersect", icon: IconLayersIntersect, label: "Layers" },
  { name: "IconPalette", icon: IconPalette, label: "Palette" },
  { name: "IconCode", icon: IconCode, label: "Code" },
  { name: "IconTestPipe", icon: IconTestPipe, label: "Test" },
  { name: "IconRocket", icon: IconRocket, label: "Rocket" },
  { name: "IconBrain", icon: IconBrain, label: "Brain" },
  { name: "IconDatabase", icon: IconDatabase, label: "Database" },
  { name: "IconServer", icon: IconServer, label: "Server" },
  { name: "IconDevices", icon: IconDevices, label: "Devices" },
  { name: "IconBug", icon: IconBug, label: "Bug" },
  { name: "IconGitBranch", icon: IconGitBranch, label: "Git" },
  { name: "IconTerminal", icon: IconTerminal, label: "Terminal" },
  { name: "IconCloudComputing", icon: IconCloudComputing, label: "Cloud" },
  { name: "IconApi", icon: IconApi, label: "API" },
  { name: "IconLock", icon: IconLock, label: "Lock" },
  { name: "IconChartBar", icon: IconChartBar, label: "Chart" },
  { name: "IconRefresh", icon: IconRefresh, label: "Refresh" },
  { name: "IconSettings", icon: IconSettings, label: "Settings" },
];

interface StepForm {
  id?: string;
  step_number: number;
  label: string;
  icon_name: string;
  image_url: string;
  description: string;
  bullets: [string, string, string];
}

const EMPTY_STEP: StepForm = {
  step_number: 0, label: "", icon_name: "IconBulb", image_url: "",
  description: "", bullets: ["", "", ""],
};

export default function ProcessPage() {
  const { data } = useProcessSteps();
  const nodes = data?.nodes ?? [];
  const [editing, setEditing] = useState<StepForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);

  const openNew = () => {
    setEditing({ ...EMPTY_STEP, step_number: nodes.length + 1 });
  };

  const openEdit = (n: typeof nodes[0]) => {
    supabase.from("process_steps").select("id").eq("step_number", n.data.stepNumber).single().then(({ data: row }) => {
      setEditing({
        id: row?.id,
        step_number: n.data.stepNumber,
        label: n.data.label,
        icon_name: n.data.icon,
        image_url: n.data.image,
        description: n.data.description,
        bullets: [...n.data.bullets] as [string, string, string],
      });
    });
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const { id, ...row } = editing;
    if (id) {
      await supabase.from("process_steps").update(row).eq("id", id);
    } else {
      await supabase.from("process_steps").insert(row);
    }
    await queryClient.invalidateQueries({ queryKey: ["processSteps"] });
    setEditing(null);
    setSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from("process_steps").delete().eq("id", deleteTarget.id);
    await queryClient.invalidateQueries({ queryKey: ["processSteps"] });
    setDeleteTarget(null);
  };

  const requestDelete = async (n: typeof nodes[0]) => {
    const { data: row } = await supabase.from("process_steps").select("id").eq("step_number", n.data.stepNumber).single();
    if (row) setDeleteTarget({ id: row.id, label: n.data.label });
  };

  const reorderSteps = (reordered: typeof nodes) => {
    // Optimistic: update cache immediately with new step numbers
    const optimisticNodes = reordered.map((n, i) => ({
      ...n,
      data: { ...n.data, stepNumber: i + 1 },
    }));
    const optimisticEdges = optimisticNodes.slice(0, -1).map((node, i) => ({
      id: `e${i}-${i + 1}`,
      source: node.id,
      target: optimisticNodes[i + 1].id,
    }));
    queryClient.setQueryData(["processSteps"], { nodes: optimisticNodes, edges: optimisticEdges });

    // Background: two-phase DB update to handle unique constraint
    const oldNumbers = reordered.map(n => n.data.stepNumber);
    Promise.all(oldNumbers.map((sn, i) =>
      supabase.from("process_steps").update({ step_number: -(i + 1) }).eq("step_number", sn)
    )).then(() =>
      Promise.all(reordered.map((_, i) =>
        supabase.from("process_steps").update({ step_number: i + 1 }).eq("step_number", -(i + 1))
      ))
    ).then(() => queryClient.invalidateQueries({ queryKey: ["processSteps"] }));
  };

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">{editing.id ? "Edit" : "New"} Step {editing.step_number}{editing.label ? `: ${editing.label}` : ""}</h1>
          <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-200"><X size={20} /></button>
        </div>
        <div className="mt-6 max-w-2xl space-y-4">
          <Field label="Label" value={editing.label} onChange={v => setEditing({ ...editing, label: v })} />
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Icon</label>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
              {AVAILABLE_ICONS.map(({ name, icon: Icon, label }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setEditing({ ...editing, icon_name: name })}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-2.5 text-xs transition-colors ${
                    editing.icon_name === name
                      ? "border-purple-500 bg-purple-500/15 text-purple-400"
                      : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600 hover:bg-gray-700"
                  }`}
                >
                  <Icon size={20} />
                  <span className="truncate w-full text-center text-[10px]">{label}</span>
                </button>
              ))}
            </div>
          </div>
          <Field label="Description" value={editing.description} onChange={v => setEditing({ ...editing, description: v })} />
          {editing.bullets.map((b, i) => (
            <Field key={i} label={`Bullet ${i + 1}`} value={b} onChange={v => {
              const bullets = [...editing.bullets] as [string, string, string];
              bullets[i] = v;
              setEditing({ ...editing, bullets });
            }} />
          ))}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Image</label>
            <ImageUpload folder="process" value={editing.image_url} onChange={v => setEditing({ ...editing, image_url: v })} />
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
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-white">Process Steps</h1>
          <p className="text-sm text-gray-500">{nodes.length} steps in your development workflow</p>
        </div>
        <button onClick={openNew} className="flex shrink-0 items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
          <Plus size={16} /> Add Step
        </button>
      </div>

      <div className="mt-6 space-y-3">
        <SortableList items={nodes} getId={n => n.id} onReorder={reorderSteps} renderItem={(n, i, dragHandle) => (
          <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 p-3 sm:gap-4 sm:p-4">
            <DragHandle dragHandle={dragHandle} />
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 text-sm font-bold text-purple-400 sm:h-10 sm:w-10">
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white truncate">{n.data.label}</p>
              <p className="text-xs text-gray-500 truncate">{n.data.description}</p>
            </div>
            <div className="flex shrink-0 gap-1 sm:gap-2">
              <button onClick={() => openEdit(n)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-700 hover:text-gray-200 sm:p-2">
                <Pencil size={16} />
              </button>
              <button onClick={() => requestDelete(n)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-500/15 hover:text-red-400 sm:p-2">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )} />
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Process Step"
        message={`Are you sure you want to delete "${deleteTarget?.label}"? This action cannot be undone.`}
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
