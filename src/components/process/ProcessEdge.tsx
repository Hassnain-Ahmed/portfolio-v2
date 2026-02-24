import { getSmoothStepPath, type EdgeProps } from "@xyflow/react";
import { useEffect, useRef } from "react";

interface EdgeData {
  isVisible: boolean;
  isDrawing: boolean;
  drawProgress: number;
  isHighlighted: boolean;
}

export default function ProcessEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const mainPathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);

  const { isVisible, isDrawing, drawProgress, isHighlighted } =
    (data as unknown as EdgeData) ?? {};

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 24,
  });

  // Stroke-dashoffset animation driven by scroll
  useEffect(() => {
    const mainPath = mainPathRef.current;
    const glowPath = glowPathRef.current;
    if (!mainPath || !glowPath) return;

    const length = mainPath.getTotalLength();
    mainPath.style.strokeDasharray = `${length}`;
    glowPath.style.strokeDasharray = `${length}`;

    if (isVisible) {
      mainPath.style.strokeDashoffset = "0";
      mainPath.style.transition = "stroke-dashoffset 0.4s ease";
      glowPath.style.strokeDashoffset = "0";
      glowPath.style.transition = "stroke-dashoffset 0.4s ease";
    } else if (isDrawing) {
      const offset = String(length * (1 - drawProgress));
      mainPath.style.strokeDashoffset = offset;
      mainPath.style.transition = "none";
      glowPath.style.strokeDashoffset = offset;
      glowPath.style.transition = "none";
    } else {
      mainPath.style.strokeDashoffset = String(length);
      mainPath.style.transition = "none";
      glowPath.style.strokeDashoffset = String(length);
      glowPath.style.transition = "none";
    }
  }, [isVisible, isDrawing, drawProgress]);

  if (!isVisible && !isDrawing) return null;

  const strokeColor = isHighlighted
    ? "#8B5CF6"
    : isVisible
      ? "rgba(139, 92, 246, 0.5)"
      : "rgba(139, 92, 246, 0.3)";

  const glowFilter =
    isHighlighted || isVisible
      ? "drop-shadow(0 0 4px rgba(139, 92, 246, 0.6))"
      : "none";

  const showParticles = isVisible || (isDrawing && drawProgress > 0.5);

  return (
    <>
      {/* Glow layer */}
      <path
        ref={glowPathRef}
        d={edgePath}
        fill="none"
        stroke="rgba(139, 92, 246, 0.2)"
        strokeWidth={6}
        style={{ filter: "blur(4px)", pointerEvents: "none" }}
      />

      {/* Main stroke */}
      <path
        ref={mainPathRef}
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.5}
        style={{
          filter: glowFilter,
          transition: "stroke 0.3s ease, filter 0.3s ease",
          pointerEvents: "none",
        }}
      />

      {/* Particles via SVG animateMotion */}
      {showParticles && (
        <g style={{ pointerEvents: "none" }}>
          {/* Particle 1 */}
          <circle r={2.5} fill="#A78BFA" opacity={0.9}>
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              begin="0s"
              path={edgePath}
            />
          </circle>
          {/* Particle 1 glow */}
          <circle r={5} fill="rgba(167, 139, 250, 0.3)">
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              begin="0s"
              path={edgePath}
            />
          </circle>
          {/* Particle 2 (staggered) */}
          <circle r={2.5} fill="#A78BFA" opacity={0.9}>
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              begin="-1.2s"
              path={edgePath}
            />
          </circle>
          {/* Particle 2 glow */}
          <circle r={5} fill="rgba(167, 139, 250, 0.3)">
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              begin="-1.2s"
              path={edgePath}
            />
          </circle>
        </g>
      )}
    </>
  );
}
