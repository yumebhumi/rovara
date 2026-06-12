"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

type StepCardProps = {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
};

export function StepCard({ step, icon: Icon, title, description, className }: StepCardProps) {
  return (
    <motion.article
      whileHover={{ y: -1.5 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-7 shadow-[0_18px_42px_rgba(0,0,0,0.14)] backdrop-blur-xl",
        "transform-gpu will-change-transform transition-[border-color,background-color,transform] duration-500",
        "hover:border-[#14B8A6]/18 hover:bg-white/[0.04]",
        className
      )}
    >
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#CBD5E1]">Step {step}</span>
          <span className="rounded-full border border-[#14B8A6]/18 bg-[#14B8A6]/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-[#D6F5EC]">
            ROVARA
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#14B8A6]/16 bg-[#14B8A6]/10 text-[#D6F5EC]">
            <Icon size={19} />
          </div>
          <h3 className="rovara-card-title">{title}</h3>
        </div>

        <p className="rovara-body-sm">{description}</p>
      </div>
    </motion.article>
  );
}
