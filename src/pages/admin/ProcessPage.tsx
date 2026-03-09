import ImageUpload from "@/components/admin/ImageUpload";
import { useProcessSteps } from "@/hooks/useProcessSteps";
import { supabase } from "@/lib/supabase";
import { queryClient } from "@/lib/queryClient";
import { Pencil, X } from "lucide-react";
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

export default function ProcessPage() {
  const { data } = useProcessSteps();
  const nodes = data?.nodes ?? [];
  const [editing, setEditing] = useState<StepForm | null>(null);
  const [saving, setSaving] = useState(false);

  const openEdit = (n: typeof nodes[0]) => {
    // Fetch the raw row to get the DB id
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
    if (!editing?.id) return;
    setSaving(true);
    const { id, ...row } = editing;
    await supabase.from("process_steps").update(row).eq("id", id);
    await queryClient.invalidateQueries({ queryKey: ["processSteps"] });
    setEditing(null);
    setSaving(false);
  };

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Edit Step {editing.step_number}: {editing.label}</h1>
          <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="mt-6 max-w-2xl space-y-4">
          <Field label="Label" value={editing.label} onChange={v => setEditing({ ...editing, label: v })} />
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {AVAILABLE_ICONS.map(({ name, icon: Icon, label }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setEditing({ ...editing, icon_name: name })}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-2.5 text-xs transition-colors ${
                    editing.icon_name === name
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
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
            <label className="text-sm font-medium text-gray-700">Image</label>
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
      <h1 className="text-2xl font-semibold">Process Steps</h1>
      <p className="text-sm text-gray-500">{nodes.length} steps in your development workflow</p>

      <div className="mt-6 space-y-3">
        {nodes.map(n => (
          <div key={n.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-sm font-bold text-purple-600">
                {n.data.stepNumber}
              </div>
              <div>
                <p className="font-medium text-gray-900">{n.data.label}</p>
                <p className="text-xs text-gray-500">{n.data.description}</p>
              </div>
            </div>
            <button onClick={() => openEdit(n)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <Pencil size={16} />
            </button>
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
