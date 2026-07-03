import { createNoise2D } from "simplex-noise";
import { useEffect, useRef } from "react";

/**
 * Warm generative flow field — the hero's living visual.
 *
 * Hundreds of lightweight particles stream along a simplex-noise vector field,
 * leaving fading warm trails, and swirl away from the pointer. It reads as
 * intentional generative art (not a blurred gradient blob) yet stays cheap:
 * pure 2D canvas, no WebGL, no scene download, paints on the first frame.
 *
 * Honors `prefers-reduced-motion` by settling into a static composition.
 */

// Warm terracotta world. Base is the section bg; particles glow warmer.
const BASE = "#a8432b";
const TRAIL_FADE = "rgba(150, 52, 30, 0.038)"; // lower alpha = longer, flowier trails
const PARTICLE_COLORS = [
  "255, 218, 170", // sand glow
  "255, 190, 140", // peach
  "247, 158, 108", // coral
  "255, 205, 110", // warm gold
];

type Particle = { x: number; y: number; px: number; py: number; color: string };

export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const noise = createNoise2D();
    const pointer = { x: -9999, y: -9999, active: false };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];

    const NOISE_SCALE = 0.0011; // lower frequency = longer, more coherent curves
    const SPEED = 1.05;
    const POINTER_RADIUS = 180;

    const seed = () => {
      const count = Math.min(
        750,
        Math.max(180, Math.round((width * height) / 3200))
      );
      particles = Array.from({ length: count }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x,
          y,
          px: x,
          py: y,
          color: PARTICLE_COLORS[(Math.random() * PARTICLE_COLORS.length) | 0],
        };
      });
    };

    const paintBase = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = BASE;
      ctx.fillRect(0, 0, width, height);
    };

    const resize = () => {
      // Render slightly under native resolution — trails hide the softness and
      // it keeps the fill-rect-per-frame cheap on high-DPI screens.
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintBase();
      seed();
    };

    const step = (t: number) => {
      // Fade the previous frame toward the base color → flowing trails.
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = TRAIL_FADE;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 1.1;

      for (const p of particles) {
        const angle =
          noise(p.x * NOISE_SCALE, p.y * NOISE_SCALE + t * 0.00004) *
          Math.PI *
          2;
        let vx = Math.cos(angle) * SPEED;
        let vy = Math.sin(angle) * SPEED;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < POINTER_RADIUS * POINTER_RADIUS && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = (1 - d / POINTER_RADIUS) * 2.4;
            // Repel + a little tangential swirl → playful eddies around cursor.
            vx += (dx / d) * f - (dy / d) * f * 0.6;
            vy += (dy / d) * f + (dx / d) * f * 0.6;
          }
        }

        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy;

        // Respawn when a particle drifts off-canvas so the field stays full.
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          p.x = Math.random() * width;
          p.y = Math.random() * height;
          p.px = p.x;
          p.py = p.y;
          continue;
        }

        ctx.strokeStyle = `rgba(${p.color}, 0.5)`;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    };

    let raf = 0;
    let running = true;
    let frames = 0;

    const loop = (now: number) => {
      if (!running) return;
      step(now);
      frames++;
      // Reduced motion: build a static composition, then stop moving.
      if (reduceMotion && frames > 160) return;
      raf = requestAnimationFrame(loop);
    };

    resize();
    raf = requestAnimationFrame(loop);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (running === false && !(reduceMotion && frames > 160)) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
