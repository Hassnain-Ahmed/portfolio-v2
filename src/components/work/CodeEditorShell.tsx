import { useState } from "react";
import FileTree from "./FileTree";
import ProjectPreview from "./ProjectPreview";
import { projects } from "./projects";

export default function CodeEditorShell() {
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const selected = projects.find((p) => p.id === selectedId) ?? projects[0];

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
          <FileTree selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        {/* Mobile file selector */}
        <div className="flex gap-2 overflow-x-auto border-b border-white/20 bg-white/30 px-3 py-2 md:hidden">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`shrink-0 rounded-full px-3 py-1 font-mono text-xs transition-colors ${selectedId === p.id
                ? "bg-purple-100/60 text-neutral-900"
                : "text-neutral-500 hover:bg-neutral-100/50"
                }`}
            >
              {p.fileName}
            </button>
          ))}
        </div>

        {/* Preview */}
        <ProjectPreview project={selected} />
      </div>
    </div>
  );
}
