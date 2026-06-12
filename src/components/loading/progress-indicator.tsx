"use client";

import { motion } from "framer-motion";

type ProgressIndicatorProps = {
  activeIndex: number;
  messages: readonly string[];
};

export function ProgressIndicator({
  activeIndex,
  messages
}: ProgressIndicatorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {messages.map((message, index) => {
        const active = index === activeIndex;
        const complete = index < activeIndex;

        return (
          <div
            key={message}
            className="rounded-[1.25rem] border border-white/[0.08] bg-white/[0.04] px-4 py-3"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm text-[#F8FAF8]/82">{message}</p>
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">
                {active ? "Active" : complete ? "Complete" : "Queued"}
              </span>
            </div>
            <div
              className="h-1.5 rounded-full bg-white/[0.08]"
              role="progressbar"
              aria-label={message}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={active || complete ? 100 : 22}
            >
              <motion.div
                initial={false}
                animate={{
                  width: active || complete ? "100%" : "22%",
                  opacity: active || complete ? 1 : 0.45
                }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="h-full rounded-full bg-[#14B8A6]"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
