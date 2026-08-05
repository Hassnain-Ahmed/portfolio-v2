"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

/**
 * Offset fed to the noise field when `animated` is false. Picked because it
 * yields a frame with visible wave separation — `nt = 0` renders nearly flat.
 */
const STATIC_FRAME_OFFSET = 0.35;

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  animated = true,
  ...props
}: {
  children?: any;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  /**
   * When false, a single frame is painted instead of running a requestAnimationFrame
   * loop. The result is visually a still of the animation; it repaints on resize only.
   */
  animated?: boolean;
  [key: string]: any;
}) => {
  const noiseRef = useRef(createNoise3D());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number>(0);
  const stateRef = useRef({ w: 0, h: 0, nt: 0, ctx: null as CanvasRenderingContext2D | null });

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ];

  const getSpeed = () => (speed === "fast" ? 0.002 : 0.001);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;
    s.ctx = ctx;
    s.nt = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      s.w = ctx.canvas.width = rect.width;
      s.h = ctx.canvas.height = rect.height;
      ctx.filter = `blur(${blur}px)`;
      // Immediately fill after resize to prevent flash from canvas clear
      ctx.globalAlpha = 1;
      ctx.fillStyle = backgroundFill || "black";
      ctx.fillRect(0, 0, s.w, s.h);
    };

    const drawWave = (n: number) => {
      if (animated) s.nt += getSpeed();
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth || 50;
        ctx.strokeStyle = waveColors[i % waveColors.length];
        for (let x = 0; x < s.w; x += 5) {
          const y = noiseRef.current(x / 800, 0.3 * i, s.nt) * 100;
          ctx.lineTo(x, y + s.h * 0.5);
        }
        ctx.stroke();
        ctx.closePath();
      }
    };

    const drawFrame = () => {
      ctx.fillStyle = backgroundFill || "black";
      ctx.globalAlpha = waveOpacity || 0.5;
      ctx.fillRect(0, 0, s.w, s.h);
      drawWave(5);
    };

    const render = () => {
      drawFrame();
      animationIdRef.current = requestAnimationFrame(render);
    };

    resize();
    if (animated) {
      render();
    } else {
      s.nt = STATIC_FRAME_OFFSET;
      drawFrame();
    }

    // A resize clears the canvas, so the still frame has to be repainted.
    const ro = new ResizeObserver(() => {
      resize();
      if (!animated) drawFrame();
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      ro.disconnect();
    };
  }, []);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0 h-full w-full"
        ref={canvasRef}
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      />
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
