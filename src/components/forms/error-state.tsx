"use client";

import { AnimatePresence, motion } from "framer-motion";

type ErrorStateProps = {
  id?: string;
  message: string | null;
};

export function ErrorState({ id, message }: ErrorStateProps) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.div
          key="submit-error"
          id={id}
          role="alert"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="rounded-[1.35rem] border border-[#fca5a5]/16 bg-[#7f1d1d]/14 px-4 py-3.5 text-sm leading-7 text-[#fecaca]"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
