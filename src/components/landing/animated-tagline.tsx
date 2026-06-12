"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type AnimatedTaglineProps = {
  taglines: string[];
  intervalMs?: number;
  className?: string;
};

export function AnimatedTagline({ taglines, intervalMs = 3400, className }: AnimatedTaglineProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((prev) => (prev + 1) % taglines.length), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, taglines.length]);

  return (
    <div className={className} aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="wait">
        <motion.p
          key={taglines[index]}
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
          transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
          className="text-balance text-xl font-medium tracking-[-0.02em] text-[#D6F5EC] sm:text-[1.7rem]"
        >
          {taglines[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
