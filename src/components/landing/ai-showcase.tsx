"use client";

import { motion } from "framer-motion";
import { CloudRainWind, Lightbulb, Sparkles, WalletCards } from "lucide-react";
import { AnimatedBadge } from "./animated-badge";
import { AIInsightCard } from "./ai-insight-card";

const insights = [
  {
    icon: Sparkles,
    title: "AI itinerary suggestions",
    message: "Your Tokyo itinerary has been optimized to reduce travel time by 2 hours.",
    chips: [{ label: "Route optimized" }, { label: "2h saved" }, { label: "Better pacing" }],
    badge: "Optimized",
    showSignal: true,
    className: "md:col-span-2"
  },
  {
    icon: CloudRainWind,
    title: "Weather-aware planning",
    message: "Rain expected Thursday. Indoor activities recommended.",
    chips: [{ label: "Rain alert" }, { label: "Indoor swaps" }],
    badge: "Forecast",
    showSignal: false,
    className: "md:col-span-1"
  },
  {
    icon: Lightbulb,
    title: "Smart travel recommendations",
    message: "Best time to visit Kyoto temples: 7AM to avoid crowds.",
    chips: [{ label: "Crowd prediction" }, { label: "7AM window" }],
    badge: "Timing",
    showSignal: false,
    className: "md:col-span-1"
  },
  {
    icon: WalletCards,
    title: "Budget optimization",
    message: "Switching hotels saves approximately $180.",
    chips: [{ label: "Hotel swap" }, { label: "$180 saved" }],
    badge: "Budget",
    showSignal: true,
    className: "md:col-span-2"
  }
] as const;

export function AIShowcase() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-20 h-56 w-56 rounded-full bg-[#14B8A6]/10 blur-3xl"
      />

      <div className="relative mb-18 flex flex-col items-center gap-4 text-center sm:mb-18">
        <AnimatedBadge label="AI Showcase" tone="beige" />
        <h2 className="rovara-section-title text-balance">
          AI intelligence that feels focused, not loud.
        </h2>
        <p className="rovara-body mx-auto max-w-3xl text-pretty">
          Rovara analyzes destinations, weather, budgets, and travel patterns to create smarter travel experiences.
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.09 } }
        }}
        className="relative grid grid-cols-1 gap-4 md:auto-rows-[17.75rem] md:grid-cols-3 md:gap-6"
      >
        {insights.map((insight) => (
          <motion.div
            key={insight.title}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
            }}
            className={insight.className}
          >
            <AIInsightCard
              icon={insight.icon}
              title={insight.title}
              message={insight.message}
              chips={insight.chips}
              badge={insight.badge}
              showSignal={insight.showSignal}
              className="h-full"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
