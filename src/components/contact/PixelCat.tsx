import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

const CAT_PX = 72;
const Y_OVERLAP = 6;

const FRAMES = {
  idle: Array.from({ length: 12 }, (_, i) => `/cat/01_Idle/__Cat_Idle_${String(i).padStart(3, "0")}.png`),
  hurt: Array.from({ length: 6  }, (_, i) => `/cat/04_Hurt/__Cat_Hurt_${String(i).padStart(3, "0")}.png`),
};

type Anim = keyof typeof FRAMES;
const FPS: Record<Anim, number> = { idle: 8, hurt: 12 };

export interface CatHandle {
  say: (message: string, durationMs?: number) => void;
}

const PixelCat = forwardRef<CatHandle>((_, ref) => {
  const overlayRef  = useRef<HTMLDivElement>(null);
  // posRef — RAF sets translate(x, y) here
  const posRef      = useRef<HTMLDivElement>(null);
  const imgRef      = useRef<HTMLImageElement>(null);
  const [bubble, setBubble] = useState<string | null>(null);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cat = useRef({
    anim: "idle" as Anim,
    frame: 0,
    lastFrameMs: 0,
    x: 0, y: 0,
    hurtCooldown: 0,
    rafId: 0,
  });

  const nodePos = useCallback((): { x: number; y: number } => {
    const overlay = overlayRef.current;
    if (!overlay) return { x: 0, y: 0 };

    const section = overlay.parentElement;
    const el = section?.querySelector<HTMLElement>("[data-cat-node]");

    if (el) {
      const oBounds  = overlay.getBoundingClientRect();
      const elBounds = el.getBoundingClientRect();
      const xFrac    = parseFloat(el.dataset.catXfrac ?? "0.5");
      return {
        x: (elBounds.left - oBounds.left) + elBounds.width * xFrac - CAT_PX / 2,
        y: (elBounds.top  - oBounds.top)  - CAT_PX + Y_OVERLAP,
      };
    }

    const { width, height } = overlay.getBoundingClientRect();
    return { x: width * 0.62 - CAT_PX / 2, y: height * 0.42 - CAT_PX + Y_OVERLAP };
  }, []);

  // Only sets translate — entrance animation layer is a separate DOM node
  const flush = useCallback(() => {
    const pos = posRef.current;
    if (!pos) return;
    const c = cat.current;
    pos.style.transform = `translate(${c.x}px, ${c.y}px)`;
  }, []);

  const setAnim = useCallback((anim: Anim, now: number) => {
    const c = cat.current;
    c.anim = anim;
    c.frame = 0;
    c.lastFrameMs = now;
    if (imgRef.current) imgRef.current.src = FRAMES[anim][0];
  }, []);

  const hoverMessages = [
    "Psst… hire me 👀",
    "I don't bite, I promise 🐾",
    "Still reading? Just send it! ✉️",
    "meow.",
    "Your message = my next meal 🐟",
  ];
  const hoverIdx = useRef(0);

  const handleHover = useCallback(() => {
    const msg = hoverMessages[hoverIdx.current % hoverMessages.length];
    hoverIdx.current += 1;
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    setBubble(msg);
    bubbleTimer.current = setTimeout(() => setBubble(null), 2500);
  }, []);

  const hurt = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const c = cat.current;
    if (c.hurtCooldown > 0) return;
    c.hurtCooldown = 1;
    setAnim("hurt", performance.now());
  }, [setAnim]);

  useImperativeHandle(ref, () => ({
    say(message: string, durationMs = 4000) {
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
      setBubble(message);
      bubbleTimer.current = setTimeout(() => setBubble(null), durationMs);
    },
  }), []);

  const tick = useCallback((now: number) => {
    const c = cat.current;

    if (now - c.lastFrameMs >= 1000 / FPS[c.anim]) {
      c.lastFrameMs = now;
      const frames = FRAMES[c.anim];
      const next = c.frame + 1;
      if (next >= frames.length) {
        if (c.anim === "hurt") { setAnim("idle", now); c.hurtCooldown = 0; }
        else c.frame = 0;
      } else {
        c.frame = next;
      }
      if (imgRef.current) imgRef.current.src = FRAMES[c.anim][c.frame];
    }

    flush();
    c.rafId = requestAnimationFrame(tick);
  }, [flush, setAnim]);

  useEffect(() => {
    [...FRAMES.idle, ...FRAMES.hurt].forEach(src => { const img = new Image(); img.src = src; });

    const place = () => {
      const p = nodePos();
      cat.current.x = p.x;
      cat.current.y = p.y;
      flush();
    };

    place();
    const timer = setTimeout(place, 750);
    cat.current.rafId = requestAnimationFrame(tick);

    const onResize = () => place();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(cat.current.rafId);
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [tick, nodePos, flush]);

  return (
    <>
      {/* Portal entrance keyframes — not in global CSS to stay self-contained */}
      <style>{`
        @keyframes catPortalIn {
          0%   { opacity: 0; transform: scale(0) rotate(-200deg); }
          65%  { opacity: 1; transform: scale(1.18) rotate(12deg); }
          80%  { transform: scale(0.9) rotate(-5deg); }
          92%  { transform: scale(1.05) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        .cat-portal-in {
          animation: catPortalIn 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          animation-delay: 0.6s;
        }
      `}</style>

      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 overflow-visible"
      >
        {/* posRef: RAF controls translate only — no other transforms here */}
        <div
          ref={posRef}
          style={{ position: "absolute", left: 0, top: 0, width: CAT_PX, height: CAT_PX }}
        >
          {/* Entrance animation wrapper — separate from posRef so RAF translate doesn't conflict */}
          <div
            className="cat-portal-in"
            style={{
              width: CAT_PX,
              height: CAT_PX,
              transformOrigin: "center bottom",
              pointerEvents: "auto",
              cursor: "pointer",
            }}
            onMouseEnter={handleHover}
            onContextMenu={hurt}
          >
            {/* Speech bubble */}
            {bubble && (
              <div
                style={{
                  position: "absolute",
                  bottom: CAT_PX + 8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  zIndex: 10,
                }}
                className="rounded-xl bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-md border border-gray-200/80 animate-in fade-in slide-in-from-bottom-2 duration-200"
              >
                {bubble}
                <span
                  style={{
                    position: "absolute",
                    bottom: -6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: "6px solid white",
                  }}
                />
              </div>
            )}

            <img
              ref={imgRef}
              alt=""
              style={{
                width: CAT_PX,
                height: CAT_PX,
                imageRendering: "pixelated",
                display: "block",
                userSelect: "none",
              }}
              draggable={false}
            />
          </div>
        </div>
      </div>
    </>
  );
});

PixelCat.displayName = "PixelCat";
export default PixelCat;
