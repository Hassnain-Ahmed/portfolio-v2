import { optimizedImageUrl } from "@/lib/imageUrl";
import { heroProjects, projects } from "@/data";
import { motion, useReducedMotion } from "motion/react";
import type { Project } from "@/components/work/projects";

const CYCLE = 11; // seconds for one card to travel the full L path
// Shared keyframe timing: descend the full height (0→0.5), then sweep right (0.5→1).
const TIMES = [0, 0.06, 0.5, 0.94, 1];

/** A single project preview styled like a live browser window. */
function PreviewCard({ project }: { project: Project }) {
  return (
    <div className="w-[clamp(320px,36vw,500px)] overflow-hidden rounded-2xl border border-white/20 bg-white shadow-[0_30px_80px_rgba(40,8,2,0.55)]">
      <div className="flex items-center gap-1.5 bg-neutral-100 px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate text-[11px] font-medium text-neutral-400">
          {project.title}
        </span>
      </div>
      <div className="aspect-video w-full bg-neutral-200">
        {project.image ? (
          <img
            src={optimizedImageUrl(project.image, { width: 480, resize: "cover" })}
            alt=""
            width={480}
            height={270}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center px-4 text-center text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #c65a3c, #e9843f)" }}
          >
            {project.title}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HeroProjectCards() {
  const reduceMotion = useReducedMotion();

  // Admin-selected featured projects; fall back to the first few if none set.
  const cards = heroProjects.length > 0 ? heroProjects : projects.slice(0, 4);
  if (cards.length === 0) return null;

  // Container-relative percentages — no JS measurement needed.
  const stagger = CYCLE / cards.length;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {reduceMotion
        ? // Reduced motion: a calm static arrangement, no travel.
          cards.slice(0, 3).map((project, i) => (
            <div
              key={project.id}
              className="absolute"
              style={{
                left: `${4 + i * 15}%`,
                top: `${8 + i * 26}%`,
                transform: `rotate(${i % 2 ? 3 : -3}deg)`,
              }}
            >
              <PreviewCard project={project} />
            </div>
          ))
        : cards.map((project, i) => (
            <motion.div
              key={project.id}
              className="absolute left-0 top-0 will-change-transform"
              initial={{ top: "-45%", left: "10%", opacity: 0, rotate: -3 }}
              animate={{
                // Enter above the screen, descend the full height, then sweep right off.
                top: ["-45%", "-18%", "58%", "58%", "58%"],
                left: ["10%", "10%", "10%", "70%", "120%"],
                rotate: [-3, -2, 0, 2, 3],
                opacity: [0, 1, 1, 1, 0],
              }}
              transition={{
                duration: CYCLE,
                repeat: Infinity,
                delay: i * stagger,
                ease: "linear",
                times: TIMES,
              }}
            >
              <PreviewCard project={project} />
            </motion.div>
          ))}
    </div>
  );
}
