import React, { useId, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
  type MotionValue,
} from "motion/react";

const GridPattern = ({
  offsetX,
  offsetY,
  patternId,
  stroke,
}: {
  offsetX: ReturnType<typeof useMotionValue<number>>;
  offsetY: ReturnType<typeof useMotionValue<number>>;
  patternId: string;
  stroke: string;
}) => (
  <svg className="w-full h-full">
    <defs>
      <motion.pattern
        id={patternId}
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
        x={offsetX}
        y={offsetY}
      >
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke={stroke}
          strokeWidth="1"
        />
      </motion.pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${patternId})`} />
  </svg>
);

/**
 * Background-only export — fills its parent container.
 * Pass mouseX / mouseY (MotionValues relative to this element's top-left)
 * from the parent so the reveal works even when a child layer intercepts
 * pointer events.
 */
export function InfiniteGridBackground({
  className,
  mouseX: externalMouseX,
  mouseY: externalMouseY,
}: {
  className?: string;
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
}) {
  const uid = useId().replace(/:/g, "");
  const baseId = `grid-base-${uid}`;
  const revealId = `grid-reveal-${uid}`;

  const internalMouseX = useMotionValue(-9999);
  const internalMouseY = useMotionValue(-9999);
  const mouseX = externalMouseX ?? internalMouseX;
  const mouseY = externalMouseY ?? internalMouseY;

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + 0.3) % 40);
    gridOffsetY.set((gridOffsetY.get() + 0.3) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(380px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      className={cn("relative w-full h-full overflow-hidden bg-[#f7f7f8]", className)}
    >
      {/* Base grid — very faint */}
      <div className="absolute inset-0 opacity-[0.12]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} patternId={baseId} stroke="#1a1a2e" />
      </div>

      {/* Mouse-reveal grid layer — brighter on hover */}
      <motion.div
        className="absolute inset-0 opacity-70"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} patternId={revealId} stroke="#6d28d9" />
      </motion.div>

      {/* Ambient color blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-20%] top-[-20%] h-[40%] w-[40%] rounded-full bg-violet-300/25 blur-[140px]" />
        <div className="absolute left-[-10%] bottom-[-20%] h-[40%] w-[40%] rounded-full bg-indigo-300/20 blur-[140px]" />
        <div className="absolute right-[10%] bottom-[-10%] h-[20%] w-[20%] rounded-full bg-purple-300/15 blur-[100px]" />
      </div>
    </div>
  );
}

/** Full standalone demo component (as provided by 21st.dev) */
export const Component = () => {
  const [count, setCount] = React.useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + 0.5) % 40);
    gridOffsetY.set((gridOffsetY.get() + 0.5) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
      )}
    >
      <div className="absolute inset-0 z-0 opacity-[0.05]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} patternId="grid-demo-base" stroke="#1a1a2e" />
      </div>
      <motion.div
        className="absolute inset-0 z-0 opacity-40"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} patternId="grid-demo-reveal" stroke="#6d28d9" />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full bg-orange-500/40 dark:bg-orange-600/20 blur-[120px]" />
        <div className="absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full bg-primary/30 blur-[100px]" />
        <div className="absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full bg-blue-500/40 dark:bg-blue-600/20 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl mx-auto space-y-6 pointer-events-none">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
            The Infinite Grid
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Move your cursor to reveal the active grid layer.
          </p>
        </div>
        <div className="flex gap-4 pointer-events-auto">
          <button
            onClick={() => setCount(count + 1)}
            className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all shadow-md active:scale-95"
          >
            Interact ({count})
          </button>
        </div>
      </div>
    </div>
  );
};
