import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";

interface DeferredSectionProps {
  /** Anchor id used by the nav / hash links (lives on the wrapper so it exists before mount). */
  id: string;
  children: ReactNode;
  /** Reserved height before mount to prevent layout shift. Match the section's real height. */
  minHeight?: string;
  /** How far ahead of the viewport to mount. */
  rootMargin?: string;
}

/**
 * Renders a lightweight placeholder until the section approaches the viewport,
 * then mounts its (lazy) children. Keeps the one-page bundle small: heavy
 * section deps (xyflow, three.js, wavy/warp backgrounds) and their data fetches
 * only load when the user scrolls near.
 */
export default function DeferredSection({
  id,
  children,
  minHeight = "100vh",
  rootMargin = "300px",
}: DeferredSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, show]);

  return (
    <section id={id} ref={ref} style={show ? undefined : { minHeight }}>
      {show ? (
        <Suspense
          fallback={
            <div
              className="flex w-full items-center justify-center"
              style={{ minHeight }}
              role="status"
              aria-label="Loading section"
            >
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-purple-500" />
            </div>
          }
        >
          {children}
        </Suspense>
      ) : null}
    </section>
  );
}
