"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { AnimatedBadge } from "./animated-badge";

type Chip = { label: string };

type AIInsightCardProps = {
  icon: LucideIcon;
  title: string;
  message: string;
  chips?: readonly Chip[];
  badge?: string;
  showSignal?: boolean;
  className?: string;
};

function MiniGraph() {
  return (
    <svg viewBox="0 0 220 60" className="h-10 w-full">
      <defs>
        <linearGradient id="rovaraGraph" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(143,227,207,0.08)" />
          <stop offset="0.6" stopColor="rgba(20,184,166,0.7)" />
          <stop offset="1" stopColor="rgba(143,227,207,0.08)" />
        </linearGradient>
      </defs>
      <path
        d="M4 46 C 40 34, 58 50, 84 38 C 110 26, 128 36, 150 24 C 174 10, 192 26, 216 14"
        fill="none"
        stroke="url(#rovaraGraph)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M4 46 C 40 34, 58 50, 84 38 C 110 26, 128 36, 150 24 C 174 10, 192 26, 216 14 L216 60 L4 60 Z"
        fill="rgba(20,184,166,0.08)"
      />
      <circle cx="150" cy="24" r="4" fill="rgba(143,227,207,0.92)" />
    </svg>
  );
}

export function AIInsightCard({
  icon: Icon,
  title,
  message,
  chips = [],
  badge = "Live",
  showSignal = false,
  className
}: AIInsightCardProps) {
  return (
    <motion.article
      whileHover={{ y: -1.5 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_22px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl",
        "transform-gpu will-change-transform transition-[border-color,background-color,transform] duration-500",
        "hover:border-[#14B8A6]/18 hover:bg-white/[0.04]",
        className
      )}
    >
      <div className="relative z-10 flex h-full flex-col gap-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#14B8A6]/16 bg-[#14B8A6]/10 text-[#D6F5EC]">
              <Icon size={19} />
            </div>
            <div>
              <h3 className="rovara-card-title text-base">{title}</h3>
              <p className="mt-1 text-xs text-[#94A3B8]">AI insight · updated moments ago</p>
            </div>
          </div>
          <AnimatedBadge label={badge} tone="emerald" />
        </div>

        <p className="rovara-body-sm">{message}</p>

        {chips.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip.label}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] font-medium tracking-wide text-[#CBD5E1]"
              >
                {chip.label}
              </span>
            ))}
          </div>
        ) : null}

        {showSignal ? (
          <div className="mt-auto rounded-[1.5rem] border border-white/[0.08] bg-[#0f171b]/72 p-3">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#CBD5E1]">
              <span>Optimization signal</span>
              <span className="text-[#8FE3CF]">+12%</span>
            </div>
            <div className="mt-1.5">
              <MiniGraph />
            </div>
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}
