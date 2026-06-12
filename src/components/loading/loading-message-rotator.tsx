"use client";

import { AnimatePresence, motion } from "framer-motion";

type LoadingMessageRotatorProps = {
  activeIndex: number;
  messages: readonly string[];
};

export function LoadingMessageRotator({
  activeIndex,
  messages
}: LoadingMessageRotatorProps) {
  const activeMessage = messages[activeIndex] ?? messages[0];

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={activeMessage}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="text-balance text-[clamp(1.8rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-[#F8FAF8]"
      >
        {activeMessage}
      </motion.p>
    </AnimatePresence>
  );
}
