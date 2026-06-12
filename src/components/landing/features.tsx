"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  CloudRainWind,
  Lightbulb,
  MapPinned,
  Share2,
  Sparkles,
  WalletCards,
  type LucideIcon
} from "lucide-react";
import { FeatureCard } from "./feature-card";

function AIItineraryVisual() {
  return (
    <div className="relative flex h-[6.7rem] w-full max-w-[16.5rem] flex-col overflow-hidden rounded-[1.2rem] border border-white/[0.08] bg-[#0d1619] p-1.5">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(20,184,166,0.14),transparent_24%),radial-gradient(circle_at_78%_70%,rgba(143,227,207,0.08),transparent_28%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:30px_30px]"
      />

      <div className="relative z-10">
        <div className="inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.18em] text-[#CBD5E1] backdrop-blur">
          AI flow
        </div>
      </div>

      <div className="relative z-10 mt-1.5 grid flex-1 grid-cols-[0.8fr_auto_1.2fr] items-center gap-1">
        <div className="rounded-[0.85rem] border border-white/[0.08] bg-[#101b1f]/84 px-1.5 py-1.5 backdrop-blur">
          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">Inputs</p>
          <div className="mt-1 space-y-0.5">
            {["Dates", "Budget"].map((item) => (
              <div
                key={item}
                className="rounded-full border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-[8px] leading-3.5 text-[#CBD5E1]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="rounded-full border border-[#14B8A6]/16 bg-[#14B8A6]/10 px-2 py-0.5 text-center text-[7px] font-semibold uppercase tracking-[0.16em] text-[#8FE3CF]">
            AI
          </div>
        </div>

        <div className="rounded-[0.85rem] border border-[#14B8A6]/14 bg-[#14B8A6]/10 px-1.5 py-1.5 backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#8FE3CF]">Draft</p>
            <span className="text-[7px] font-medium uppercase tracking-[0.14em] text-[#8FE3CF]">Ready</span>
          </div>
          <div className="mt-1 space-y-0.5">
            <div className="flex items-center justify-between rounded-full border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-[8px] leading-3.5 text-[#F8FAF8]">
              <span>Day 1</span>
              <span className="text-[#8FE3CF]">Arrival</span>
            </div>
            <div className="flex items-center justify-between rounded-full border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-[8px] leading-3.5 text-[#F8FAF8]">
              <span>Day 2</span>
              <span className="text-[#8FE3CF]">Highlights</span>
            </div>
          </div>
          <div className="mt-1 rounded-full border border-white/[0.05] bg-black/10 px-1.5 py-0.5 text-[7px] uppercase tracking-[0.14em] text-[#94A3B8]">
            3 days aligned
          </div>
        </div>
      </div>
    </div>
  );
}

function MapPreviewVisual() {
  return (
    <div className="relative h-full min-h-[13.5rem] overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-[#0d1619]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(20,184,166,0.16),transparent_22%),radial-gradient(circle_at_78%_72%,rgba(143,227,207,0.08),transparent_24%)]"
      />
      <svg
        viewBox="0 0 420 240"
        className="absolute inset-0 h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M42 194C92 170 104 116 156 112C195 109 212 145 249 147C302 151 316 84 377 70"
          stroke="rgba(143,227,207,0.28)"
          strokeWidth="2"
          strokeDasharray="7 7"
        />
        <path
          d="M52 182C108 157 125 126 177 132C215 136 237 176 284 176C326 176 346 137 386 112"
          stroke="rgba(20,184,166,0.9)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="52" cy="182" r="8" fill="#8FE3CF" fillOpacity="0.18" />
        <circle cx="52" cy="182" r="4.5" fill="#8FE3CF" />
        <circle cx="177" cy="132" r="8" fill="#8FE3CF" fillOpacity="0.14" />
        <circle cx="177" cy="132" r="4.5" fill="#8FE3CF" />
        <circle cx="284" cy="176" r="8" fill="#8FE3CF" fillOpacity="0.14" />
        <circle cx="284" cy="176" r="4.5" fill="#8FE3CF" />
        <circle cx="386" cy="112" r="10" fill="#14B8A6" fillOpacity="0.22" />
        <circle cx="386" cy="112" r="5.5" fill="#14B8A6" />
      </svg>
      <div className="absolute left-4 top-4 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#CBD5E1] backdrop-blur">
        Live route preview
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
        <div className="max-w-[48%] rounded-[1.4rem] border border-white/[0.08] bg-[#101b1f]/84 px-3 py-2 backdrop-blur">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">Route logic</p>
          <p className="mt-1 text-[0.95rem] leading-5 font-medium text-[#F8FAF8]">4 stops · 22 min faster</p>
        </div>
        <div className="max-w-[48%] rounded-[1.4rem] border border-[#14B8A6]/16 bg-[#14B8A6]/10 px-3 py-2 backdrop-blur">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8FE3CF]">Clustered</p>
          <p className="mt-1 text-[0.95rem] leading-5 font-medium text-[#F8FAF8]">3 nearby essentials</p>
        </div>
      </div>
    </div>
  );
}

function RecommendationsVisual() {
  return (
    <div className="relative flex h-[4.8rem] w-full max-w-[13.75rem] flex-col overflow-hidden rounded-[1rem] border border-white/[0.08] bg-[#0d1619] p-1.25">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_22%_24%,rgba(20,184,166,0.14),transparent_24%),radial-gradient(circle_at_78%_74%,rgba(143,227,207,0.08),transparent_28%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:30px_30px]"
      />

      <div className="relative z-10 inline-flex w-fit rounded-full border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[6px] font-semibold uppercase tracking-[0.18em] text-[#CBD5E1] backdrop-blur">
        Live suggestions
      </div>

      <div className="relative z-10 mt-1">
        <div className="rounded-[0.75rem] border border-[#14B8A6]/14 bg-[#14B8A6]/10 px-1.5 py-1.25 backdrop-blur">
          <div className="flex items-center justify-between text-[6px] font-semibold uppercase tracking-[0.16em] text-[#8FE3CF]">
            <span>Timing</span>
            <span>High fit</span>
          </div>
          <p className="mt-1 text-[7px] leading-3 text-[#F8FAF8]">Visit Kyoto temples before 7 AM.</p>
          <div className="mt-1 flex flex-wrap gap-0.5">
            <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-1.25 py-0.5 text-[6px] uppercase tracking-[0.14em] text-[#94A3B8]">
              $38 lunch
            </span>
            <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-1.25 py-0.5 text-[6px] uppercase tracking-[0.14em] text-[#94A3B8]">
              River walk
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  visual?: ReactNode;
  className: string;
};

const features: Feature[] = [
  {
    icon: Sparkles,
    title: "AI itinerary generation",
    description: "Generate complete day-wise itineraries tailored to your dates, style, pace, and destination energy.",
    visual: <AIItineraryVisual />,
    className: "md:col-span-2 md:row-span-1"
  },
  {
    icon: MapPinned,
    title: "Interactive maps",
    description: "Live route previews, attraction clusters, and nearby essentials in one fluid map experience.",
    visual: <MapPreviewVisual />,
    className: "md:col-span-1 md:row-span-2"
  },
  {
    icon: CloudRainWind,
    title: "Weather intelligence",
    description: "Adaptive plans that react to forecast changes with smarter indoor and outdoor suggestions.",
    className: "md:col-span-1"
  },
  {
    icon: WalletCards,
    title: "Smart budget optimization",
    description: "Balance stays, transport, food, and activities with automatic budget-aware recommendations.",
    className: "md:col-span-1"
  },
  {
    icon: Share2,
    title: "Save & share trips",
    description: "Persist itineraries, create share links, and collaborate with friends before takeoff.",
    className: "md:col-span-1"
  },
  {
    icon: Lightbulb,
    title: "AI recommendations",
    description: "Get timing, cost, and hidden-gem suggestions that continuously improve your journey.",
    visual: <RecommendationsVisual />,
    className: "md:col-span-2"
  }
];

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-16 h-44 w-44 rounded-full bg-[#14B8A6]/10 blur-3xl"
      />

      <div className="relative mb-18 text-center sm:mb-18">
        <p className="cinematic-label">Capabilities</p>
        <h2 className="mt-4 rovara-section-title text-balance">
          Smart travel tools, reduced to what matters.
        </h2>
        <p className="mx-auto mt-5 rovara-body mx-auto max-w-3xl text-pretty">
          Rovara combines intelligent planning, live insights, and modern travel tools into one seamless experience.
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } }
        }}
        className="relative grid grid-cols-1 gap-4 sm:gap-5 md:auto-rows-[13rem] md:grid-cols-3 md:gap-6"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
            }}
            className={feature.className}
          >
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              visual={feature.visual}
              visualPosition={
                feature.title === "AI itinerary generation" || feature.title === "AI recommendations" ? "right" : "bottom"
              }
              className="h-full"
              iconClassName="group-hover:border-[#14B8A6]/24 group-hover:bg-[#14B8A6]/12"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
