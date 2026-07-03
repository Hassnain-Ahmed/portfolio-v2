import { useEffect, useState } from "react";

/**
 * Tracks which section (by element id) is currently centered in the viewport.
 * Used to drive the nav's active-state on the one-page landing.
 */
export function useScrollSpy(ids: string[], enabled = true): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return;

    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Trigger around the vertical middle of the viewport.
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // key re-runs when the id set changes; enabled toggles landing vs standalone.
  }, [key, enabled, ids]);

  return active;
}
