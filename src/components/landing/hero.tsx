"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, CalendarRange, MapPinned, Sparkles, WalletCards } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { ROUTES } from "@/constants/routes";
import { pageTransition } from "@/styles/animations";
import { AnimatedTagline } from "./animated-tagline";
import { HeroCta } from "./hero-cta";

const HERO_TAGLINES = [
  "AI itineraries with clearer judgment",
  "Trips that move with calm precision",
  "Planning that feels intelligent, not busy",
  "A premium travel workflow for modern explorers"
];

export function HeroSection() {
  const router = useRouter();
  const [destination, setDestination] = useState("");

  function handlePlannerSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submittedDestination = String(formData.get("destination") ?? "").trim();

    const params = new URLSearchParams();
    if (submittedDestination) params.set("destination", submittedDestination);
    const href = params.toString() ? `${ROUTES.GENERATE}?${params.toString()}` : ROUTES.GENERATE;
    router.push(href);
  }

  return (
    <section className="relative isolate overflow-hidden pt-1 sm:pt-2">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_16%_18%,rgba(20,184,166,0.12),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(143,227,207,0.05),transparent_18%),linear-gradient(180deg,#0B1215_0%,#0D1519_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] [background-image:radial-gradient(rgba(248,250,248,0.7)_0.55px,transparent_0.55px)] [background-size:24px_24px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-[#14B8A6]/10 blur-[110px]"
      />

      <div className="mx-auto grid min-h-[calc(100svh-6rem)] max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 sm:py-14 md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] md:gap-16 md:py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={pageTransition}
          className="min-w-0 space-y-8 sm:space-y-10"
        >
          <div className="space-y-5">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="inline-flex rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-[12px] font-medium uppercase tracking-[0.22em] text-[#CBD5E1]"
            >
              Premium AI Travel App
            </motion.span>

            <div className="space-y-5">
              <div className="flex min-w-0 items-center gap-3 sm:gap-5">
                <BrandLogo
                  variant="mark"
                  className="w-16 shrink-0 rounded-[1.25rem] sm:w-24 sm:rounded-[1.5rem] lg:w-28"
                  priority
                  sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 112px"
                />
                <p className="min-w-0 text-[2.35rem] font-semibold tracking-[0.06em] text-[#8FE3CF] sm:text-[4.1rem] sm:tracking-[0.08em] lg:text-[4.7rem]">
                  ROVARA
                </p>
              </div>
              <h1 className="rovara-hero-title max-w-4xl text-balance">
                Travel plans with a calmer point of view.
              </h1>
            </div>

            <AnimatedTagline taglines={HERO_TAGLINES} className="min-h-10 sm:min-h-[3.25rem]" />

            <p className="rovara-body max-w-2xl text-pretty">
              Generate elegant itineraries, pace each day with better judgment, and keep budget, weather, and movement in one clear planning surface.
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-3.5 sm:flex-row sm:flex-wrap sm:items-center">
            <HeroCta href={ROUTES.GENERATE}>Start Planning</HeroCta>
            <HeroCta href={ROUTES.TRIPS} variant="glass">
              View Saved Trips
            </HeroCta>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Planning time", "Under 2 minutes"],
              ["Budget control", "Live cost alignment"],
              ["Trip pacing", "Weather-smart flow"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.6rem] border border-white/[0.08] bg-white/[0.03] px-4 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">{label}</p>
                <p className="mt-2 text-sm font-medium text-[#F8FAF8]">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...pageTransition, delay: 0.08 }}
          className="relative min-w-0 md:pl-4"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-4 -z-10 rounded-[2.2rem] bg-[#14B8A6]/7 blur-3xl"
          />

          <motion.form
            onSubmit={handlePlannerSubmit}
            className="space-y-5 rounded-[1.55rem] border border-white/[0.07] bg-[#10191d]/80 p-4 shadow-[0_24px_58px_rgba(0,0,0,0.24)] backdrop-blur-lg sm:rounded-[1.9rem] sm:p-6"
            aria-label="Live planner preview"
          >
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
                  Live planner
                </p>
                <h3 className="text-[1.25rem] font-semibold tracking-[-0.03em] text-[#F8FAF8] sm:text-[1.35rem]">
                  A calmer way to begin.
                </h3>
                <p className="max-w-md text-sm leading-7 text-[#94A3B8]">
                  Start with the destination. The full planner opens on the next screen.
                </p>
              </div>
              <span className="rounded-full border border-[#14B8A6]/18 bg-[#14B8A6]/8 px-2.5 py-1 text-[11px] font-medium tracking-[0.08em] text-[#D6F5EC]">
                Preview
              </span>
            </div>

            <label className="block">
              <span className="mb-2.5 block text-[0.82rem] font-medium tracking-[0.01em] text-[#CBD5E1]">
                Destination
              </span>
              <div className="flex min-h-[4.2rem] min-w-0 items-center gap-3 rounded-[1.35rem] border border-white/[0.08] bg-white/[0.025] px-4 transition-[border-color,background-color,box-shadow] duration-300 focus-within:border-[#14B8A6]/20 focus-within:bg-white/[0.04] focus-within:shadow-[0_0_0_1px_rgba(20,184,166,0.08),0_16px_36px_rgba(0,0,0,0.1)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-[#D6F5EC]">
                  <MapPinned size={15} />
                </span>
                <input
                  name="destination"
                  type="text"
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  placeholder="Where would you like to go?"
                  className="h-auto min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.98rem] text-[#F8FAF8] placeholder:text-[#94A3B8] outline-none"
                />
              </div>
            </label>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Travel window",
                  value: "Choose dates next",
                  icon: CalendarRange
                },
                {
                  label: "Budget",
                  value: "Set on planner",
                  icon: WalletCards
                },
                {
                  label: "Vibe",
                  value: "Relaxed, Luxury",
                  icon: Sparkles
                }
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-[1.2rem] border border-white/[0.07] bg-white/[0.025] px-4 py-3.5"
                  >
                    <div className="flex items-center gap-2 text-[#94A3B8]">
                      <Icon size={14} />
                      <p className="text-[0.76rem] font-medium tracking-[0.01em]">
                        {item.label}
                      </p>
                    </div>
                    <p className="mt-2 text-sm font-medium text-[#F8FAF8]">{item.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-[1.35rem] border border-white/[0.07] bg-[#0f171b]/70 px-4 py-4">
              <p className="text-[0.78rem] font-medium tracking-[0.01em] text-[#94A3B8]">
                Preview mood
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Relaxed", "Luxury", "Food & Cafes"].map((preference) => (
                  <span
                    key={preference}
                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[0.8rem] font-medium text-[#CBD5E1]"
                  >
                    {preference}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#14B8A6]/24 bg-[linear-gradient(180deg,#23cab9_0%,#14B8A6_100%)] text-sm font-semibold tracking-[0.01em] text-[#041311] shadow-[0_10px_24px_rgba(20,184,166,0.14),inset_0_1px_0_rgba(255,255,255,0.16)] transition-all duration-300 hover:-translate-y-px hover:shadow-[0_14px_30px_rgba(20,184,166,0.18),0_0_0_1px_rgba(143,227,207,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FE3CF]/35"
            >
              Continue to planner
              <ArrowRight size={15} />
            </button>

            <p className="text-center text-xs leading-6 text-[#94A3B8]">
              Destination first. Dates, budget, and full itinerary controls open in the dedicated planner.
            </p>
          </motion.form>
        </motion.aside>
      </div>
    </section>
  );
}

export function Hero() {
  return <HeroSection />;
}
