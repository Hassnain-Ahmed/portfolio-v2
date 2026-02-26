import { InfiniteGridBackground } from "@/components/ui/the-infinite-grid";
import { motion, useMotionValue } from "motion/react";
import React, { useRef, useState } from "react";
import { NODE_DATA } from "./processData";
import ProcessFlow from "./ProcessFlow";
import { useProcessScroll } from "./useProcessScroll";

export default function ProcessSection() {
  const { outerRef, activeStep, edgeProgress } = useProcessScroll(
    NODE_DATA.length
  );
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // Track mouse at the sticky container level so the z-10 React Flow canvas
  // doesn't swallow the events before they reach the z-0 background.
  const stickyRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-9999);
    mouseY.set(-9999);
  };

  return (
    <div ref={outerRef} style={{ height: "500vh" }}>
      <div
        ref={stickyRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#f7f7f8]"
      >
        {/* Animated background */}
        <div className="absolute inset-0 z-0">
          <InfiniteGridBackground mouseX={mouseX} mouseY={mouseY} />
        </div>

        {/* Section header — fades out as scrolling begins */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex flex-col items-center justify-center pt-24">
          <motion.div
            animate={{
              opacity: activeStep >= 0 ? 0 : 1,
              y: activeStep >= 0 ? -20 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="text-center"
          >
            <h2
              className="text-4xl font-semibold md:text-5xl"
              style={{ color: "#1a1a2e", fontFamily: "var(--font-sans, sans-serif)" }}
            >
              The Process
            </h2>
            <p className="mt-3 text-sm" style={{ color: "#6b6b80" }}>
              Scroll to walk through the workflow
            </p>
          </motion.div>
        </div>

        {/* Step label above dots */}
        {activeStep >= 0 && activeStep < NODE_DATA.length && (
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute bottom-16 left-0 right-0 z-10 text-center"
          >
            <span
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: "#7c3aed" }}
            >
              {NODE_DATA[activeStep].data.label}
            </span>
          </motion.div>
        )}

        {/* Step progress dots */}
        <div className="pointer-events-none absolute bottom-8 left-0 right-0 z-10 flex items-center justify-center gap-2">
          {NODE_DATA.map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              animate={{
                width: i === activeStep ? 20 : 6,
                height: 6,
                background:
                  i === activeStep
                    ? "#7c3aed"
                    : i < activeStep
                      ? "rgba(124,58,237,0.4)"
                      : "rgba(0,0,0,0.12)",
              }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            />
          ))}
        </div>

        {/* React Flow canvas */}
        <div className="absolute inset-0 z-10">
          <ProcessFlow
            activeStep={activeStep}
            edgeProgress={edgeProgress}
            hoveredStep={hoveredStep}
            setHoveredStep={setHoveredStep}
          />
        </div>

        {/* End-state title — slides in after the fitView zoom-out settles */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col items-center mt-30"
          initial={false}
          animate={
            activeStep === NODE_DATA.length - 1
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: -14 }
          }
          transition={{
            duration: 0.7,
            ease: [0.25, 1, 0.5, 1],
            delay: activeStep === NODE_DATA.length - 1 ? 2.6 : 0,
          }}
        >
          <p
            className="font-mono text-[10px] tracking-[0.22em] uppercase mb-2"
            style={{ color: "#7c3aed" }}
          >
            End-to-end
          </p>
          <h2
            className="text-3xl font-semibold md:text-4xl"
            style={{ color: "#1a1a2e", fontFamily: "var(--font-sans, sans-serif)" }}
          >
            The Development Process
          </h2>
        </motion.div>
      </div>
    </div>
  );
}
