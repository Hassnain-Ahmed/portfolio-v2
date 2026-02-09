import { Wrench } from "lucide-react";
import GlassCard from "./GlassCard";
import { skills } from "./aboutData";

export default function SkillsCard() {
  return (
    <GlassCard className="p-5">
      <h4 className="mb-3 flex items-center gap-2 font-mono text-xs font-medium text-neutral-600">
        <Wrench size={14} className="text-purple-500" />
        Skills
      </h4>

      <div className="flex flex-wrap gap-1.5">
        {skills.map((item) => (
          <span
            key={item}
            className="rounded-md border border-neutral-200/60 bg-white/60 px-2 py-0.5 font-mono text-[11px] text-neutral-700"
          >
            {item}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}
