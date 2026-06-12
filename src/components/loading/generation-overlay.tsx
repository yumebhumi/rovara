"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { LoadingMessageRotator } from "./loading-message-rotator";
import { ProgressIndicator } from "./progress-indicator";

type GenerationOverlayProps = {
  open: boolean;
  activeIndex: number;
  messages: readonly string[];
};

export function GenerationOverlay({
  open,
  activeIndex,
  messages
}: GenerationOverlayProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed inset-0 z-50 bg-[rgba(11,18,21,0.74)] backdrop-blur-xl"
          aria-live="polite"
          aria-modal="true"
          aria-labelledby="generation-overlay-title"
          aria-describedby="generation-overlay-description"
          role="dialog"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(20,184,166,0.18),transparent_28%),radial-gradient(circle_at_78%_80%,rgba(143,227,207,0.12),transparent_26%)]"
          />

          <div className="relative mx-auto flex min-h-screen max-w-5xl items-center px-6 py-10">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(18,27,31,0.96),rgba(11,18,21,0.98))] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.34)] sm:p-8"
            >
              <div className="mb-8 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#14B8A6]/24 bg-[#14B8A6]/12 text-[#8FE3CF]">
                  <Sparkles size={18} aria-hidden="true" />
                </span>
                <div>
                  <p
                    id="generation-overlay-title"
                    className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8FE3CF]"
                  >
                    AI generation in progress
                  </p>
                  <p
                    id="generation-overlay-description"
                    className="mt-1 text-sm leading-7 text-[#94A3B8]"
                  >
                    Rovara is shaping a premium route with calmer pacing, stronger local texture, and cleaner daily flow.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <LoadingMessageRotator activeIndex={activeIndex} messages={messages} />
                <p className="max-w-2xl text-sm leading-7 text-[#94A3B8]">
                  Building the itinerary day by day, balancing destination rhythm, spend, and experience quality before the journal view opens.
                </p>
                <ProgressIndicator activeIndex={activeIndex} messages={messages} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
