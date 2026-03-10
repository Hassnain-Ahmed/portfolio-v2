import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Folder, FolderOpen, FileCode } from "lucide-react";
import {
  TypescriptOriginal,
  JavascriptOriginal,
  ReactOriginal,
  PythonOriginal,
  Html5Original,
  Css3Original,
  PhpOriginal,
  RustOriginal,
  GoOriginal,
  SwiftOriginal,
  KotlinOriginal,
  CplusplusOriginal,
  CsharpOriginal,
} from "devicons-react";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import type { Project } from "./projects";

interface FileTreeProps {
  grouped: Map<string, Project[]>;
  selectedId: string;
  onSelect: (id: string) => void;
}

type IconComponent = ComponentType<{ size?: number | string; className?: string }>;

function ReactYellow({ size, className }: { size?: number | string; className?: string }) {
  return (
    <span className={className} style={{ filter: "hue-rotate(180deg) saturate(1.5) brightness(1.1)" }}>
      <ReactOriginal size={size} />
    </span>
  );
}

const EXT_ICONS: Record<string, IconComponent> = {
  tsx: ReactOriginal,
  jsx: ReactYellow,
  ts: TypescriptOriginal,
  js: JavascriptOriginal,
  py: PythonOriginal,
  rs: RustOriginal,
  go: GoOriginal,
  html: Html5Original,
  css: Css3Original,
  php: PhpOriginal,
  swift: SwiftOriginal,
  kt: KotlinOriginal,
  cpp: CplusplusOriginal,
  "c#": CsharpOriginal,
  cs: CsharpOriginal,
};

function getExtIcon(fileName: string): IconComponent {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return EXT_ICONS[ext] ?? FileCode;
}

export default function FileTree({ grouped, selectedId, onSelect }: FileTreeProps) {
  const [rootOpen, setRootOpen] = useState(true);
  const [openFolders, setOpenFolders] = useState<Set<string>>(
    () => new Set([grouped.keys().next().value ?? ""])
  );

  const toggleFolder = (folder: string) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folder)) next.delete(folder);
      else next.add(folder);
      return next;
    });
  };

  return (
      <nav className="w-full py-2 text-sm select-none">
        {/* Root folder */}
        <button
          onClick={() => setRootOpen(!rootOpen)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-neutral-800 hover:bg-neutral-100/50 transition-colors font-semibold"
        >
          <motion.span
            animate={{ rotate: rootOpen ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center"
          >
            <ChevronRight size={14} />
          </motion.span>
          {rootOpen ? (
            <FolderOpen size={14} className="text-amber-500" />
          ) : (
            <Folder size={14} className="text-amber-500" />
          )}
          <span>projects</span>
        </button>

        <AnimatePresence initial={false}>
          {rootOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
              className="overflow-hidden"
            >
              {[...grouped.keys()].map((folder) => {
                const files = grouped.get(folder) ?? [];
                const isOpen = openFolders.has(folder);

                return (
                  <div key={folder}>
                    <button
                      onClick={() => toggleFolder(folder)}
                      className="flex w-full items-center gap-1.5 pl-6 pr-3 py-1.5 text-neutral-700 hover:bg-neutral-100/50 transition-colors"
                    >
                      <motion.span
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center"
                      >
                        <ChevronRight size={12} />
                      </motion.span>
                      <Folder size={13} className="text-neutral-400" />
                      <span className="font-medium">{folder}</span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                          className="overflow-hidden"
                        >
                          {files.map((file) => (
                            <FileItem
                              key={file.id}
                              file={file}
                              isActive={selectedId === file.id}
                              onSelect={onSelect}
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
  );
}

function FileItem({
  file,
  isActive,
  onSelect,
}: {
  file: Project;
  isActive: boolean;
  onSelect: (id: string) => void;
}) {
  const Icon = getExtIcon(file.fileName);
  return (
    <button
      onClick={() => onSelect(file.id)}
      className={cn(
        "flex w-full items-center gap-2 pl-12 pr-3 py-1.5 font-mono text-xs transition-colors duration-200",
        isActive
          ? "bg-purple-100/60 text-neutral-900 shadow-[inset_2px_0_0_0_#a855f7]"
          : "text-neutral-500 hover:bg-neutral-100/50"
      )}
    >
      <Icon size={14} />
      <span>{file.fileName}</span>
    </button>
  );
}
