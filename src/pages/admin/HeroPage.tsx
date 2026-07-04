import { optimizedImageUrl } from "@/lib/imageUrl";
import { supabase } from "@/lib/supabase";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, EyeOff, GripVertical, Loader2, Rocket, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface Project {
  id: string;
  title: string;
  image: string;
  hidden: boolean;
}

const AVAILABLE = "available";
const FEATURED = "featured";
type ContainerId = typeof AVAILABLE | typeof FEATURED;

/** A draggable project card (used in both columns and the drag overlay). */
function ProjectCard({
  project,
  index,
  container,
  overlay = false,
}: {
  project: Project;
  index?: number;
  container?: ContainerId;
  overlay?: boolean;
}) {
  const sortable = useSortable({
    id: project.id,
    data: { container },
    disabled: overlay,
  });
  const style = overlay
    ? undefined
    : {
        transform: CSS.Translate.toString(sortable.transform),
        transition: sortable.transition,
      };

  return (
    <div
      ref={overlay ? undefined : sortable.setNodeRef}
      style={style}
      className={`group flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 p-2 pr-3 transition-colors ${
        sortable.isDragging ? "opacity-40" : "hover:border-gray-700"
      } ${overlay ? "w-72 border-purple-500/50 shadow-2xl shadow-black/50 ring-1 ring-purple-500/30" : ""}`}
    >
      <button
        type="button"
        className="shrink-0 cursor-grab touch-none rounded-md p-1 text-gray-600 hover:text-gray-300 active:cursor-grabbing"
        aria-label="Drag"
        {...(overlay ? {} : sortable.attributes)}
        {...(overlay ? {} : sortable.listeners)}
      >
        <GripVertical size={16} />
      </button>

      {typeof index === "number" && (
        <span className="w-5 shrink-0 text-center font-mono text-xs font-medium text-purple-400">
          {index + 1}
        </span>
      )}

      <div className="h-10 w-16 shrink-0 overflow-hidden rounded-md bg-gray-800">
        {project.image ? (
          <img
            src={optimizedImageUrl(project.image, { width: 160, resize: "cover" })}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>

      <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-200">
        {project.title}
      </span>

      {project.hidden && (
        <span
          className="flex shrink-0 items-center gap-1 rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-500"
          title="Hidden from the Work section"
        >
          <EyeOff size={10} /> hidden
        </span>
      )}
    </div>
  );
}

function Column({
  id,
  ids,
  byId,
  title,
  hint,
  accent,
}: {
  id: ContainerId;
  ids: string[];
  byId: Record<string, Project>;
  title: string;
  hint: string;
  accent?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
          {accent && <Sparkles size={15} className="text-purple-400" />}
          {title}
        </h2>
        <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
          {ids.length}
        </span>
      </div>
      <SortableContext id={id} items={ids} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex min-h-[220px] flex-1 flex-col gap-2 rounded-2xl border border-dashed p-3 transition-colors ${
            isOver
              ? "border-purple-500/60 bg-purple-500/5"
              : accent
                ? "border-gray-700 bg-gray-900/40"
                : "border-gray-800 bg-gray-900/20"
          }`}
        >
          {ids.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-1 py-8 text-center">
              <p className="text-sm text-gray-500">{hint}</p>
            </div>
          ) : (
            ids.map((pid, i) => (
              <ProjectCard
                key={pid}
                project={byId[pid]}
                container={id}
                index={id === FEATURED ? i : undefined}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function HeroPage() {
  const [byId, setById] = useState<Record<string, Project>>({});
  const [items, setItems] = useState<Record<ContainerId, string[]>>({
    available: [],
    featured: [],
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error: e } = await supabase
        .from("projects")
        .select("id,title,image_url,hidden,hero_order,sort_order")
        .order("sort_order");
      if (e) {
        setError(e.message);
        setLoading(false);
        return;
      }
      const rows = data ?? [];
      const map: Record<string, Project> = {};
      rows.forEach((r) => {
        map[r.id] = {
          id: r.id,
          title: r.title,
          image: r.image_url ?? "",
          hidden: r.hidden ?? false,
        };
      });
      const featured = rows
        .filter((r) => r.hero_order !== null && r.hero_order !== undefined)
        .sort((a, b) => (a.hero_order ?? 0) - (b.hero_order ?? 0))
        .map((r) => r.id);
      const available = rows
        .filter((r) => r.hero_order === null || r.hero_order === undefined)
        .map((r) => r.id);
      setById(map);
      setItems({ available, featured });
      setLoading(false);
    })();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainer = (id: string): ContainerId | null => {
    if (id === AVAILABLE || id === FEATURED) return id;
    if (items.available.includes(id)) return AVAILABLE;
    if (items.featured.includes(id)) return FEATURED;
    return null;
  };

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function onDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;
    const activeC = findContainer(String(active.id));
    const overC = findContainer(String(over.id));
    if (!activeC || !overC || activeC === overC) return;

    setItems((prev) => {
      const activeItems = prev[activeC];
      const overItems = prev[overC];
      const overIndex = overItems.indexOf(String(over.id));
      const insertAt = overIndex >= 0 ? overIndex : overItems.length;
      return {
        ...prev,
        [activeC]: activeItems.filter((id) => id !== String(active.id)),
        [overC]: [
          ...overItems.slice(0, insertAt),
          String(active.id),
          ...overItems.slice(insertAt),
        ],
      };
    });
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;
    const c = findContainer(String(active.id));
    const overC = findContainer(String(over.id));
    if (!c || c !== overC) return;
    if (active.id !== over.id) {
      setItems((prev) => {
        const list = prev[c];
        return {
          ...prev,
          [c]: arrayMove(list, list.indexOf(String(active.id)), list.indexOf(String(over.id))),
        };
      });
    }
  }

  async function save() {
    setSaving(true);
    setError("");
    const updates = [
      ...items.featured.map((id, i) => ({ id, hero_order: i })),
      ...items.available.map((id) => ({ id, hero_order: null as number | null })),
    ];
    const results = await Promise.all(
      updates.map((u) =>
        supabase.from("projects").update({ hero_order: u.hero_order }).eq("id", u.id)
      )
    );
    const failed = results.find((r) => r.error);
    setSaving(false);
    if (failed?.error) {
      setError(failed.error.message);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const activeProject = useMemo(
    () => (activeId ? byId[activeId] : null),
    [activeId, byId]
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Hero Slider</h1>
          <p className="mt-1 max-w-xl text-sm text-gray-500">
            Drag projects into the <span className="text-purple-400">Hero Slider</span> and
            order them — these are the cards that fly in on the homepage hero. Drag back to
            remove.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : saved ? (
            <Check size={16} />
          ) : null}
          {saving ? "Saving…" : saved ? "Saved" : "Save order"}
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
      )}

      <div className="mb-6 flex items-start gap-2 rounded-lg border border-purple-500/20 bg-purple-500/5 px-3 py-2 text-xs text-gray-400">
        <Rocket size={14} className="mt-0.5 shrink-0 text-purple-400" />
        <span>
          Saved changes update the database instantly, but the public site is static — hit{" "}
          <span className="font-medium text-gray-200">Publish</span> (in the sidebar) to rebuild
          and see them live.
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Column
            id={AVAILABLE}
            ids={items.available}
            byId={byId}
            title="All Projects"
            hint="All featured — drag a card back here to remove it."
          />
          <Column
            id={FEATURED}
            ids={items.featured}
            byId={byId}
            title="Hero Slider"
            hint="Drag projects here to feature them in the hero."
            accent
          />
        </div>

        <DragOverlay>
          {activeProject ? <ProjectCard project={activeProject} overlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
