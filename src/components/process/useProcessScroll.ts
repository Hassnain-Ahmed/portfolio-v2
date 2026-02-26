import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";

export interface EdgeProgress {
  fromStep: number;
  progress: number;
}

export function useProcessScroll(nodeCount: number) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [edgeProgress, setEdgeProgress] = useState<EdgeProgress>({
    fromStep: -1,
    progress: 0,
  });

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const totalSlots = nodeCount + 0.5;
    const scaled = latest * totalSlots; // 0 → 7.5

    const step = Math.floor(scaled - 0.3); // node appears slightly before slot center
    const clampedStep = Math.max(-1, Math.min(step, nodeCount - 1));

    const slotFraction = scaled % 1;
    const edgeFromStep = Math.floor(scaled) - 1;
    const edgeProg =
      slotFraction > 0.3 ? Math.min((slotFraction - 0.3) / 0.7, 1) : 0;

    setActiveStep(clampedStep);
    setEdgeProgress({ fromStep: edgeFromStep, progress: edgeProg });
  });

  return { outerRef, activeStep, edgeProgress };
}
