import type { ReactNode } from "react";
// import ScrollProgress from "./ScrollProgress";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-bg-void text-text-primary">
      {/* <ScrollProgress /> */}
      {children}
      <Navbar />
    </div>
  );
}
