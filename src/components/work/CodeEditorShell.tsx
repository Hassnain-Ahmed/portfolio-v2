import { useMemo, useState } from "react";
import FileTree from "./FileTree";
import ProjectPreview from "./ProjectPreview";
import { getProjectsByFolder } from "./projects";
import { useProjects } from "@/hooks/useProjects";

export default function CodeEditorShell() {
  const { data: projects = [], isLoading } = useProjects();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const grouped = useMemo(() => getProjectsByFolder(projects), [projects]);
  const activeId = selectedId ?? projects[0]?.id ?? "";
  const selected = projects.find((p) => p.id === activeId) ?? projects[0];

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-white/30 bg-white/40 shadow-xl shadow-black/5 backdrop-blur-xl md:min-h-[480px]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-purple-500" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/30 bg-white/40 shadow-xl shadow-black/5 backdrop-blur-xl">
      {/* Title bar */}
      <div className="flex h-10 items-center border-b border-white/30 bg-gray-200/50 px-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: "#FF5F57" }} />
          <span className="h-3 w-3 rounded-full" style={{ background: "#FEBC2E" }} />
          <span className="h-3 w-3 rounded-full" style={{ background: "#28C840" }} />
        </div>
        <span className="flex-1 text-center font-mono text-xs text-neutral-500">
          ~/projects
        </span>
        <div className="w-14" />
      </div>

      {/* Body */}
      <div className="flex flex-col md:flex-row min-h-[400px] md:min-h-[480px]">
        {/* Sidebar — hidden on mobile */}
        <div className="hidden w-[250px] shrink-0 border-r border-white/20 bg-white/30 md:block">
          <FileTree grouped={grouped} selectedId={activeId} onSelect={setSelectedId} />
        </div>

        {/* Mobile file selector */}
        <div className="flex gap-2 overflow-x-auto border-b border-white/20 bg-white/30 px-3 py-2 md:hidden">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`shrink-0 rounded-full px-3 py-1 font-mono text-xs transition-colors ${activeId === p.id
                ? "bg-purple-100/60 text-neutral-900"
                : "text-neutral-500 hover:bg-neutral-100/50"
                }`}
            >
              {p.fileName}
            </button>
          ))}
        </div>

        {/* Preview */}
        {selected && <ProjectPreview project={selected} />}
      </div>
    </div>
  );
}
