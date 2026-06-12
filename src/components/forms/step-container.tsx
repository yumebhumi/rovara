"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { panelTransition } from "@/styles/animations";

type StepContainerProps = {
  step: number;
  totalSteps: number;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function StepContainer({
  step,
  totalSteps,
  eyebrow,
  title,
  description,
  children
}: StepContainerProps) {
  return (
    <motion.section
      key={title}
      aria-labelledby={`trip-step-${step}-title`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={panelTransition}
      className="rounded-[1.8rem] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.026),rgba(255,255,255,0.012))] p-5 shadow-[0_16px_44px_rgba(0,0,0,0.14)] backdrop-blur-lg sm:p-6"
    >
      <div className="space-y-6">
        <div className="space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full border border-[#14B8A6]/14 bg-[#14B8A6]/8 px-3 py-1 text-[0.78rem] font-medium tracking-[0.01em] text-[#D6F5EC]">
              {eyebrow}
            </span>
            <span className="text-[0.8rem] tracking-[0.01em] text-[#64748B]">
              Step {step} of {totalSteps}
            </span>
          </div>
          <div className="space-y-2.5">
            <h2
              id={`trip-step-${step}-title`}
              className="max-w-xl text-balance text-[clamp(1.75rem,3.4vw,2.7rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-[#F8FAF8]"
            >
              {title}
            </h2>
            <p className="max-w-xl text-[0.98rem] leading-7 text-[#94A3B8]">
              {description}
            </p>
          </div>
        </div>

        {children}
      </div>
    </motion.section>
  );
}
