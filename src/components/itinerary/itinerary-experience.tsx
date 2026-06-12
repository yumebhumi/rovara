"use client";

import { motion } from "framer-motion";
import type { PublicPersistedTrip } from "@/types";
import { pageTransition } from "@/styles/animations";
import { ItineraryHero } from "./itinerary-hero";
import { ItineraryTimeline } from "./itinerary-timeline";
import { BudgetSummary } from "./budget-summary";
import { RecommendationCard } from "./recommendation-card";
import { WeatherInsightSection } from "./weather-insight";
import { buildFinalTravelNotes } from "./render-utils";

export function ItineraryExperience({ trip }: { trip: PublicPersistedTrip }) {
  const notes = buildFinalTravelNotes(trip);

  return (
    <div className="relative mx-auto max-w-6xl space-y-16 sm:space-y-24 lg:space-y-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-48 -z-10 h-80 bg-[radial-gradient(circle,rgba(143,227,207,0.14),transparent_62%)] blur-3xl"
      />

      <ItineraryHero trip={trip} />
      <ItineraryTimeline trip={trip} />
      <WeatherInsightSection trip={trip} />
      <BudgetSummary trip={trip} />

      {trip.recommendations.length ? (
        <section aria-labelledby="recommendations-title" className="space-y-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8FE3CF]">
              Recommendations
            </p>
            <h2
              id="recommendations-title"
            className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-[#F8FAF8] sm:text-[2.8rem] sm:tracking-[-0.05em]"
            >
              Extra cues that make the itinerary feel local.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[#94A3B8]">
              Guidance for timing, atmosphere, and quieter choices that help the trip feel more intentional than generic.
            </p>
          </div>

          <div className="grid min-w-0 gap-5 lg:grid-cols-3">
            {trip.recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
              />
            ))}
          </div>
        </section>
      ) : null}

      {notes.length ? (
        <section aria-labelledby="notes-title" className="space-y-10 pb-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8FE3CF]">
              Final travel notes
            </p>
            <h2
              id="notes-title"
              className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-[#F8FAF8] sm:text-[2.8rem] sm:tracking-[-0.05em]"
            >
              Small details that keep the journey graceful.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {notes.map((note, index) => (
              <motion.article
                key={`${note}-${index}`}
                className="rounded-[1.35rem] border border-white/[0.08] bg-white/[0.035] p-5 shadow-[0_18px_52px_rgba(0,0,0,0.16)] backdrop-blur-xl"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={pageTransition}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#14B8A6]/18 bg-[#14B8A6]/10 text-sm font-semibold text-[#8FE3CF]">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <p className="mt-6 text-sm leading-7 text-[#F8FAF8]/80">
                  {note}
                </p>
              </motion.article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
