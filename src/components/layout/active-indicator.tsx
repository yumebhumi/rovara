"use client";

import { motion } from "framer-motion";
import { panelTransition } from "@/styles/animations";

export function ActiveIndicator() {
  return (
    <>
      <motion.span
        aria-hidden="true"
        layoutId="rovara-active-nav-pill"
        className="absolute inset-0 rounded-full border border-[#14B8A6]/18 bg-[linear-gradient(180deg,rgba(20,184,166,0.1),rgba(20,184,166,0.05))] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        transition={panelTransition}
      />
      <motion.span
        aria-hidden="true"
        layoutId="rovara-active-nav-line"
        className="pointer-events-none absolute inset-x-5 bottom-[0.38rem] h-px rounded-full bg-[linear-gradient(90deg,transparent,rgba(143,227,207,0.88),transparent)]"
        transition={panelTransition}
      />
    </>
  );
}
