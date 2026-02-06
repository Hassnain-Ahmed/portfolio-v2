import { useRef } from "react";
import { motion, useInView } from "motion/react";
import GlassCard from "./GlassCard";
import { useGitHub } from "./GitHubContext";
import { generateFallbackContributions } from "./aboutData";

const LEVELS = [
  "bg-white/20",
  "bg-green-300/60",
  "bg-green-400/70",
  "bg-green-500/80",
  "bg-green-600",
];

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 8) return 3;
  return 4;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const CELL = 10;
const GAP = 2;
const COL_W = CELL + GAP;
const LABEL_W = 28;

export default function ContributionGraph() {
  const { data } = useGitHub();
  const contributions = data?.contributions ?? generateFallbackContributions();
  const totalContributions = data?.totalContributions ?? 0;

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Calculate month label positions
  const monthPositions: { label: string; col: number }[] = [];
  let lastMonth = -1;
  contributions.forEach((week, i) => {
    const firstDay = week[0];
    if (!firstDay) return;
    const month = new Date(firstDay.date).getMonth();
    if (month !== lastMonth) {
      monthPositions.push({ label: MONTHS[month], col: i });
      lastMonth = month;
    }
  });

  const gridWidth = contributions.length * COL_W;

  return (
    <GlassCard className="min-w-0 p-4 md:p-5">
      <h4 className="mb-3 font-mono text-[11px] font-medium text-neutral-600 md:mb-4 md:text-xs">
        {totalContributions.toLocaleString()} contributions in the last year
      </h4>

      <div ref={ref} className="-mx-1 overflow-x-auto px-1 pb-2">
        <div style={{ minWidth: `${gridWidth + LABEL_W}px` }}>
          {/* Month labels */}
          <div className="mb-1 flex" style={{ paddingLeft: `${LABEL_W}px` }}>
            {monthPositions.map((m, i) => {
              const nextCol = monthPositions[i + 1]?.col ?? contributions.length;
              const span = nextCol - m.col;
              return (
                <span
                  key={`${m.label}-${m.col}`}
                  className="font-mono text-[10px] text-neutral-400"
                  style={{ width: `${span * COL_W}px`, flexShrink: 0 }}
                >
                  {m.label}
                </span>
              );
            })}
          </div>

          {/* Grid */}
          <div className="flex" style={{ gap: `${GAP}px` }}>
            {/* Day labels */}
            <div
              className="flex flex-col shrink-0"
              style={{ width: `${LABEL_W - GAP}px`, gap: `${GAP}px` }}
            >
              {DAY_LABELS.map((label, i) => (
                <span
                  key={i}
                  className="flex items-center justify-end pr-1 font-mono text-[9px] text-neutral-400"
                  style={{ height: `${CELL}px` }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Weeks */}
            {contributions.map((week, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap: `${GAP}px` }}>
                {week.map((day, di) => {
                  const flatIndex = wi * 7 + di;
                  return (
                    <motion.div
                      key={day.date}
                      className={`rounded-sm ${LEVELS[getLevel(day.count)]}`}
                      style={{ width: `${CELL}px`, height: `${CELL}px` }}
                      title={`${day.date}: ${day.count} contributions`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={
                        isInView
                          ? { scale: 1, opacity: 1 }
                          : { scale: 0, opacity: 0 }
                      }
                      transition={{
                        delay: flatIndex * 0.001,
                        duration: 0.2,
                        ease: "easeOut",
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[10px] text-neutral-400">
        <span>Less</span>
        {LEVELS.map((cls, i) => (
          <div
            key={i}
            className={`rounded-sm ${cls}`}
            style={{ width: `${CELL}px`, height: `${CELL}px` }}
          />
        ))}
        <span>More</span>
      </div>
    </GlassCard>
  );
}
