import {
  GitCommitHorizontal,
  FolderGit2,
  Calendar,
  Users,
  Code,
} from "lucide-react";
import type { Stat } from "./aboutData";

const ICON_MAP: Record<string, React.ElementType> = {
  "git-commit-horizontal": GitCommitHorizontal,
  "folder-git-2": FolderGit2,
  calendar: Calendar,
  code: Code,
  users: Users,
};

export default function StatsBadges({ stats }: { stats: Stat[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 md:gap-2">
      {stats.map((stat) => {
        const Icon = ICON_MAP[stat.icon] ?? Code;
        return (
          <div
            key={stat.label}
            className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/15 backdrop-blur-sm px-2.5 py-0.5 md:gap-1.5 md:px-3 md:py-1"
          >
            <Icon size={11} className="text-purple-500" />
            <span className="font-mono text-[11px] font-semibold text-neutral-900 md:text-xs">
              {stat.value.toLocaleString()}
              {stat.suffix ?? ""}
            </span>
            <span className="text-[10px] text-neutral-500 md:text-[11px]">{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
}
