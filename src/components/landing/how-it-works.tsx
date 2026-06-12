"use client";

import { motion } from "framer-motion";
import { LocateFixed, SlidersHorizontal, Sparkles } from "lucide-react";
import { StepCard } from "./step-card";

const steps = [
  {
    step: 1,
    icon: LocateFixed,
    title: "Enter destination",
    description: "Choose where you want to go and set your travel dates."
  },
  {
    step: 2,
    icon: SlidersHorizontal,
    title: "Customize your trip",
    description: "Select your budget, travel style, and preferences."
  },
  {
    step: 3,
    icon: Sparkles,
    title: "Generate AI itinerary",
    description: "Receive a personalized AI-powered travel experience instantly."
  }
] as const;

export function HowItWorks() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-12 top-24 h-56 w-56 rounded-full bg-[#14B8A6]/10 blur-3xl"
      />

      <div className="relative mb-18 text-center sm:mb-18">
        <p className="cinematic-label">Workflow</p>
        <h2 className="mt-4 rovara-section-title text-balance">
          How Rovara works
        </h2>
        <p className="mx-auto mt-5 rovara-body mx-auto max-w-3xl text-pretty">
          From destination to a fully optimized itinerary in a few deliberate steps.
        </p>
      </div>

      <div className="relative">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-6 right-6 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent md:block"
          initial={{ opacity: 0, scaleX: 0.85 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid gap-4 md:grid-cols-3 md:gap-6"
        >
          {steps.map((step) => (
            <motion.div
              key={step.step}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="relative h-full"
            >
              <div aria-hidden="true" className="pointer-events-none absolute -top-3 left-1/2 hidden h-2 w-2 -translate-x-1/2 rounded-full bg-[#14B8A6]/80 md:block" />
              <StepCard
                step={step.step}
                icon={step.icon}
                title={step.title}
                description={step.description}
                className="h-full min-h-[15.5rem]"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
