import type { ReactNode } from "react";
import SmoothScroll from "./SmoothScroll";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-bg-void text-text-primary">
        {children}
      </div>
    </SmoothScroll>
  );
}
