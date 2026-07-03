import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
// import ScrollProgress from "./ScrollProgress";
import Navbar from "./Navbar";
import WhatsAppButton from "./WhatsAppButton";

/**
 * react-router does not scroll to `#hash` targets on navigation. On landing at
 * `/#section` (e.g. from a nav click on another page), find the section and
 * scroll to it — retrying briefly since deferred section wrappers mount async.
 */
function useHashScroll() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    let tries = 0;
    let timer: number;
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior, block: "start" });
      else if (tries++ < 12) timer = window.setTimeout(tryScroll, 70);
    };
    timer = window.setTimeout(tryScroll, 70);
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);
}

export default function Layout({ children }: { children: ReactNode }) {
  useHashScroll();
  return (
    <div className="relative min-h-screen bg-bg-void text-text-primary">
      {/* <ScrollProgress /> */}
      {children}
      <Navbar />
      <WhatsAppButton />
    </div>
  );
}
