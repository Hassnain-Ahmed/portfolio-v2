import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
  className?: string;
  children: ReactNode;
}

export default function GlassCard({ className, children }: GlassCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-gray-400/20 bg-white/15 shadow-lg shadow-black/5 backdrop-blur-md",
        className
      )}
    >
      {children}
    </div>
  );
}
