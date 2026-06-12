"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bookmark } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { AnimatedBadge } from "./animated-badge";
import { HeroCta } from "./hero-cta";

export function CTASection() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:py-36">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 rounded-[2.5rem] bg-[radial-gradient(circle_at_20%_24%,rgba(20,184,166,0.1),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-10 -z-10 h-64 w-64 rounded-full bg-[#14B8A6]/10 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-[#10191d]/82 p-8 backdrop-blur-2xl sm:p-12"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#14B8A6]/8 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <AnimatedBadge label="Ready to launch" tone="beige" />

          <h2 className="mt-6 rovara-section-title text-balance">
            Start planning smarter with AI.
          </h2>
          <p className="mt-4 text-pretty text-sm leading-8 text-[#94A3B8] sm:text-base">
            Generate personalized travel experiences, optimize budgets, and explore the world intelligently with Rovara.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
            <HeroCta href={ROUTES.GENERATE} className="w-full sm:w-auto">
              <span className="inline-flex items-center gap-2">
                Start Planning <ArrowRight size={16} />
              </span>
            </HeroCta>
            <HeroCta href={ROUTES.TRIPS} variant="glass" className="w-full sm:w-auto">
              <span className="inline-flex items-center gap-2">
                Revisit Saved Trips <Bookmark size={16} />
              </span>
            </HeroCta>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              "AI itinerary",
              "Weather-aware",
              "Budget optimized",
              "Maps & routes",
              "Shareable trips"
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] font-medium tracking-wide text-[#CBD5E1]"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
