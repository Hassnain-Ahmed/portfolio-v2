import { Handle, Position, type NodeProps } from "@xyflow/react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconBulb,
  IconSearch,
  IconLayersIntersect,
  IconPalette,
  IconCode,
  IconTestPipe,
  IconRocket,
  IconBrain,
  IconDatabase,
  IconServer,
  IconDevices,
  IconBug,
  IconGitBranch,
  IconTerminal,
  IconCloudComputing,
  IconApi,
  IconLock,
  IconChartBar,
  IconRefresh,
  IconSettings,
} from "@tabler/icons-react";
import type { ProcessNodeData } from "./processData";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  IconBulb,
  IconSearch,
  IconLayersIntersect,
  IconPalette,
  IconCode,
  IconTestPipe,
  IconRocket,
  IconBrain,
  IconDatabase,
  IconServer,
  IconDevices,
  IconBug,
  IconGitBranch,
  IconTerminal,
  IconCloudComputing,
  IconApi,
  IconLock,
  IconChartBar,
  IconRefresh,
  IconSettings,
};

interface NodeStateProps {
  isVisible: boolean;
  isActive: boolean;
  isCompleted: boolean;
  isHighlighted: boolean;
  stepIndex: number;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
}

export default function ProcessNode({ data }: NodeProps) {
  const {
    label,
    stepNumber,
    description,
    bullets,
    icon,
    image,
    isVisible,
    isActive,
    isHighlighted,
    onHoverEnter,
    onHoverLeave,
  } = data as unknown as ProcessNodeData & NodeStateProps;

  const IconComponent = ICON_MAP[icon as keyof typeof ICON_MAP];

  return (
    <>
      {/* Horizontal handles — edges flow left → right */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ opacity: 0, pointerEvents: "none" }}
      />

      <AnimatePresence>
        {isVisible && (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.85, filter: "blur(8px)" }}
            animate={{
              opacity: 1,
              scale: isActive ? 1.04 : 1,
              filter: "blur(0px)",
            }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            onMouseEnter={onHoverEnter}
            onMouseLeave={onHoverLeave}
            className="relative w-[220px] cursor-default"
          >
            {/* Light glassmorphism card */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                background: isHighlighted
                  ? "rgba(124, 58, 237, 0.06)"
                  : "rgba(255, 255, 255, 0.58)",
                borderColor: isActive
                  ? "rgba(124, 58, 237, 0.55)"
                  : isHighlighted
                    ? "rgba(124, 58, 237, 0.25)"
                    : "rgba(255, 255, 255, 0.9)",
                boxShadow: isActive
                  ? "0 0 28px rgba(124, 58, 237, 0.15), 0 4px 24px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.8)"
                  : isHighlighted
                    ? "0 0 14px rgba(124, 58, 237, 0.08), 0 4px 16px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)"
                    : "0 4px 16px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)",
                transition:
                  "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              {/* Image banner */}
              {image && (
                <div className="w-full h-24 overflow-hidden">
                  <img
                    src={image}
                    alt={label}
                    className="w-full h-full object-cover"
                    style={{
                      imageRendering: "pixelated",
                      filter: isActive ? "brightness(1.05)" : "brightness(0.95)",
                      transition: "filter 0.3s ease",
                    }}
                  />
                </div>
              )}

              {/* Card body */}
              <div className="p-4">
              {/* Step number + icon row */}
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="font-mono text-[10px]"
                  style={{ color: "#9090a0", fontFamily: "var(--font-mono, monospace)" }}
                >
                  {String(stepNumber).padStart(2, "0")}
                </span>
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{
                    background:
                      isActive || isHighlighted
                        ? "rgba(124, 58, 237, 0.15)"
                        : "rgba(124, 58, 237, 0.07)",
                    transition: "background 0.3s ease",
                  }}
                >
                  {IconComponent && (
                    <IconComponent
                      size={14}
                      color={isActive || isHighlighted ? "#7c3aed" : "#9090a0"}
                    />
                  )}
                </div>

                {/* Active pulsing dot */}
                {isActive && (
                  <motion.div
                    className="ml-auto h-2 w-2 rounded-full"
                    style={{ background: "#7c3aed" }}
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </div>

              {/* Title */}
              <h3
                className="mb-1 text-sm font-semibold leading-snug"
                style={{ color: "#1a1a2e", fontFamily: "var(--font-sans, sans-serif)" }}
              >
                {label}
              </h3>

              {/* Description */}
              <p className="mb-2 text-[11px] leading-relaxed" style={{ color: "#6b6b80" }}>
                {description}
              </p>

              {/* Bullets */}
              <ul className="space-y-1">
                {(bullets as string[]).map((bullet, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span
                      className="mt-[5px] h-1 w-1 shrink-0 rounded-full"
                      style={{ background: "#7c3aed" }}
                    />
                    <span
                      className="text-[10px] leading-relaxed"
                      style={{ color: "#4b4b60" }}
                    >
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
              </div>{/* end card body */}
            </div>

            {/* Glow ring on active */}
            {isActive && (
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(124,58,237,0.35), 0 0 36px rgba(124,58,237,0.12)",
                }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
