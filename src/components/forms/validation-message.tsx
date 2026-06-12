"use client";

import { AnimatePresence, motion } from "framer-motion";

type ValidationMessageProps = {
  id?: string;
  message?: string;
};

export function ValidationMessage({ id, message }: ValidationMessageProps) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          id={id}
          role="alert"
          aria-live="polite"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-[0.82rem] leading-6 text-[#ffc6c6]"
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}
