import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useGitHub } from "./GitHubContext";
import { defaultLanguages } from "./aboutData";

export default function LanguageBar() {
  const { data } = useGitHub();
  const languages = data?.languages ?? defaultLanguages;

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="flex h-full flex-col gap-3 md:flex-row md:items-stretch">
      {/* Horizontal bar on mobile */}
      <div className="flex h-2.5 w-full overflow-hidden rounded-full md:hidden">
        {languages.map((lang, i) => (
          <motion.div
            key={lang.name}
            className="h-full"
            style={{ backgroundColor: lang.color }}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${lang.percentage}%` } : { width: 0 }}
            transition={{
              delay: 0.3 + i * 0.1,
              duration: 0.8,
              ease: [0.25, 1, 0.5, 1],
            }}
          />
        ))}
      </div>

      {/* Vertical bar on desktop */}
      <div className="hidden w-3 flex-col overflow-hidden rounded-full md:flex">
        {languages.map((lang, i) => (
          <motion.div
            key={lang.name}
            className="w-full flex-1"
            style={{ backgroundColor: lang.color }}
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{
              delay: 0.3 + i * 0.1,
              duration: 0.8,
              ease: [0.25, 1, 0.5, 1],
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 md:flex-col md:justify-center md:gap-1.5">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: lang.color }}
            />
            <span className="text-[10px] text-neutral-600">{lang.name}</span>
            <span className="font-mono text-[10px] text-neutral-400">
              {lang.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
