import { WavyBackground } from "@/components/ui/wavy-background";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import CodeEditorShell from "./CodeEditorShell";
import { useProjects } from "@/hooks/useProjects";

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { isLoading } = useProjects();

  return (
    <section
      id="work"
      ref={sectionRef}
      className={`relative bg-neutral-50 ${isLoading ? "min-h-dvh" : ""}`}
    >
      <WavyBackground
        containerClassName={isLoading ? "py-24 min-h-dvh" : "py-24"}
        className="mx-auto max-w-6xl px-6 w-full"
        backgroundFill="#fafafa"
        colors={["#f9a8d4", "#c4b5fd", "#93c5fd", "#fda4af", "#d8b4fe"]}
        waveOpacity={0.3}
        blur={12}
        speed="slow"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        >
          <h2 className="font-sans text-4xl font-semibold text-neutral-900 md:text-5xl">
            Selected Work
          </h2>
          <p className="mt-3 max-w-lg text-sm font-sans leading-relaxed text-neutral-600">
            A collection of projects spanning web applications, open-source
            tools, and creative experiments.
          </p>

          <div className="mt-10">
            <CodeEditorShell />
          </div>
        </motion.div>
      </WavyBackground>
    </section>
  );
}
