import { getProcessIcon, type ProcessStep } from "@/components/process/processIcons";
import { processSteps } from "@/data";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

const EASE = [0.32, 0.72, 0, 1] as const;
const ACCENT = "#7c3aed";
const AUTO_MS = 3800;
const RING_R = 42; // radius as % of the ring box (viewBox is 0..100)

export default function ProcessSection() {
  const reduce = useReducedMotion();
  const steps = processSteps;
  const n = steps.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance around the loop; pauses on hover/focus and under reduced motion.
  useEffect(() => {
    if (reduce || paused || n === 0) return;
    const t = setInterval(() => setActive((a) => (a + 1) % n), AUTO_MS);
    return () => clearInterval(t);
  }, [reduce, paused, n]);

  // Static node positions around the ring (start at top, clockwise).
  const nodes = useMemo(
    () =>
      steps.map((s, i) => {
        const angle = (i / (n || 1)) * Math.PI * 2 - Math.PI / 2;
        return {
          step: s,
          i,
          x: 50 + RING_R * Math.cos(angle),
          y: 50 + RING_R * Math.sin(angle),
        };
      }),
    [steps, n]
  );

  if (n === 0) return null;

  const step = steps[active];
  const circumference = 2 * Math.PI * RING_R;
  const progress = active / n; // fraction of the loop filled up to the active node

  return (
    <section className="relative w-full overflow-hidden bg-neutral-50 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        {/* Header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-2xl"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em]"
            style={{ background: `${ACCENT}12`, color: ACCENT }}
          >
            <IterateGlyph /> The Process
          </span>
          <h2 className="mt-5 text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-tight text-neutral-900">
            How I build, end to end
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-neutral-500">
            It's a loop, not a line — every launch feeds the next idea. Hover the
            ring or tap a step to explore each stage.
          </p>
        </motion.div>

        <div className="mt-14 grid items-center gap-12 lg:mt-20 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* Active step detail */}
          <div className="relative min-h-[300px] lg:min-h-[360px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <StepDetail step={step} total={n} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive loop */}
          <div
            className="relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[500px]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            {/* Track + progress arc */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full -rotate-90"
              aria-hidden="true"
            >
              <circle
                cx="50"
                cy="50"
                r={RING_R}
                fill="none"
                stroke={`${ACCENT}20`}
                strokeWidth="0.4"
              />
              <motion.circle
                cx="50"
                cy="50"
                r={RING_R}
                fill="none"
                stroke={ACCENT}
                strokeWidth="0.9"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={false}
                animate={{ strokeDashoffset: circumference * (1 - progress) }}
                transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
              />
            </svg>

            {/* Center hub */}
            <div className="absolute left-1/2 top-1/2 flex h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-white shadow-[0_20px_50px_-20px_rgba(76,29,149,0.4)] ring-1 ring-black/5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  style={{ color: ACCENT }}
                  className="flex flex-col items-center"
                >
                  <ActiveIcon step={step} />
                  <span className="mt-1 font-mono text-[10px] font-medium tracking-widest text-neutral-400">
                    {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Step nodes */}
            {nodes.map(({ step: s, i, x, y }) => {
              const Icon = getProcessIcon(s.icon);
              const isActive = i === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  aria-label={`Step ${i + 1}: ${s.label}`}
                  aria-current={isActive}
                  className="group absolute flex h-11 w-11 items-center justify-center rounded-full outline-none transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 sm:h-[52px] sm:w-[52px]"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -50%) scale(${isActive ? 1.12 : 1})`,
                  }}
                >
                  <span
                    className="flex h-full w-full items-center justify-center rounded-full ring-1 ring-purple-200 transition-colors duration-300"
                    style={{
                      background: isActive ? ACCENT : "#ffffff",
                      color: isActive ? "#ffffff" : ACCENT,
                      boxShadow: isActive
                        ? "0 12px 30px -8px rgba(124,58,237,0.6)"
                        : "0 8px 20px -12px rgba(76,29,149,0.35)",
                    }}
                  >
                    <Icon size={20} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ActiveIcon({ step }: { step: ProcessStep }) {
  const Icon = getProcessIcon(step.icon);
  return <Icon size={30} />;
}

function StepDetail({ step, total }: { step: ProcessStep; total: number }) {
  const num = String(step.stepNumber).padStart(2, "0");
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm font-medium tracking-widest" style={{ color: ACCENT }}>
          STEP {num}
        </span>
        <span className="h-px w-8" style={{ background: `${ACCENT}40` }} />
        <span className="font-mono text-xs text-neutral-400">
          of {String(total).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
        {step.label}
      </h3>
      <p className="mt-3 max-w-md text-lg leading-relaxed text-neutral-500">
        {step.description}
      </p>

      {step.bullets.length > 0 && (
        <ul className="mt-5 grid max-w-md gap-2.5">
          {step.bullets.map((bullet, bi) => (
            <li key={bi} className="flex gap-3 text-sm leading-relaxed text-neutral-700">
              <span
                className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: ACCENT }}
                aria-hidden="true"
              />
              {bullet}
            </li>
          ))}
        </ul>
      )}

      {step.image && (
        <div className="mt-7 max-w-sm rounded-[1.4rem] bg-white/70 p-1.5 shadow-[0_24px_60px_-30px_rgba(76,29,149,0.5)] ring-1 ring-black/5">
          <img
            src={step.image}
            alt=""
            width={420}
            height={236}
            loading="lazy"
            decoding="async"
            className="aspect-video w-full rounded-[calc(1.4rem-0.375rem)] object-cover"
          />
        </div>
      )}
    </div>
  );
}

function IterateGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12a8 8 0 0 1 13.7-5.6M20 12A8 8 0 0 1 6.3 17.6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M17 3v4h-4M7 21v-4h4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
