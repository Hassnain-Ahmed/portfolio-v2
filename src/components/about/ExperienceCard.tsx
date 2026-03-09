import { Briefcase } from "lucide-react";
import GlassCard from "./GlassCard";
import type { Experience } from "./aboutData";

interface ExperienceCardProps {
  experience?: Experience[];
}

export default function ExperienceCard({ experience = [] }: ExperienceCardProps) {
  return (
    <GlassCard className="p-5">
      <h4 className="mb-4 flex items-center gap-2 font-mono text-xs font-medium text-neutral-600">
        <Briefcase size={14} className="text-purple-500" />
        Experience
      </h4>

      <div className="space-y-4">
        {experience.map((exp, i) => (
          <div
            key={i}
            className="relative pl-4 before:absolute before:left-0 before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-purple-400"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h5 className="text-sm font-semibold text-neutral-900">
                {exp.role}
              </h5>
              <span className="font-mono text-[10px] text-neutral-400">
                {exp.period}
              </span>
            </div>
            <p className="text-xs font-medium text-neutral-500">{exp.company}</p>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
