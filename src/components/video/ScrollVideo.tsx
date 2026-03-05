import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 31;

function framePath(index: number) {
  const num = String(index + 1).padStart(3, "0");
  return `/dev-journey/ezgif-frame-${num}.jpg`;
}

// Preload all images into browser cache
function preloadAllFrames(): Promise<void> {
  return new Promise((resolve) => {
    let loaded = 0;
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === FRAME_COUNT) resolve();
      };
    }
  });
}

export default function ScrollVideo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);

  // Preload all frames on mount
  useEffect(() => {
    preloadAllFrames().then(() => setReady(true));
  }, []);

  // Set up ScrollTrigger once images are cached
  useEffect(() => {
    if (!ready) return;

    const section = sectionRef.current;
    const img = imgRef.current;
    if (!section || !img) return;

    // Show first frame
    img.src = framePath(0);
    let currentFrame = 0;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.15,
      pin: img.parentElement!,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          FRAME_COUNT - 1,
          Math.floor(self.progress * FRAME_COUNT)
        );
        if (frameIndex !== currentFrame) {
          currentFrame = frameIndex;
          img.src = framePath(frameIndex);
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [ready]);

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-bg-void">
      <div className="h-screen w-full overflow-hidden">
        <img
          ref={imgRef}
          alt=""
          src={framePath(0)}
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
