"use client";

import { motion } from "framer-motion";
import { panelTransition } from "@/styles/animations";
import { cn } from "@/utils/cn";

type AnimatedBadgeProps = {
  label: string;
  tone?: "emerald" | "beige";
  className?: string;
};

export function AnimatedBadge({ label, tone = "emerald", className }: AnimatedBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={panelTransition}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] backdrop-blur",
        tone === "emerald"
          ? "border-[#14B8A6]/24 bg-[#14B8A6]/10 text-[#F8FAF8]"
          : "border-white/[0.08] bg-white/[0.03] text-[#F8FAF8]",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          tone === "emerald" ? "bg-[#14B8A6]" : "bg-[#8FE3CF]"
        )}
      />
      {label}
    </motion.span>
  );
}
