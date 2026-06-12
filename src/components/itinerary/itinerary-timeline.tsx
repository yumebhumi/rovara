"use client";

import { motion } from "framer-motion";
import type { PublicPersistedTrip } from "@/types";
import { staggerContainer } from "@/styles/animations";
import { ItineraryDaySection } from "./itinerary-day";

export function ItineraryTimeline({ trip }: { trip: PublicPersistedTrip }) {
  return (
    <section aria-labelledby="timeline-title" className="space-y-10 sm:space-y-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8FE3CF]">
          Day-by-day flow
        </p>
        <h2
          id="timeline-title"
          className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-[#F8FAF8] sm:text-[2.8rem] sm:tracking-[-0.05em]"
        >
          A calm cinematic rhythm through the trip.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[#94A3B8]">
          Each day unfolds in morning, afternoon, and evening scenes so the itinerary reads like a beautifully paced travel journal instead of a checklist.
        </p>
      </div>

      <motion.div
        className="space-y-12 sm:space-y-16"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {trip.itineraryDays.map((day) => (
          <ItineraryDaySection key={day.id} day={day} trip={trip} />
        ))}
      </motion.div>
    </section>
  );
}
