"use client";

import Image from "next/image";
import { CalendarDays, Compass, Sparkles, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import type { PublicPersistedTrip } from "@/types";
import { pageTransition } from "@/styles/animations";
import { formatDateRange } from "@/utils/date";
import { formatCurrencyValue } from "@/lib/currency";
import { getTripHeroImage } from "./render-utils";

export function ItineraryHero({ trip }: { trip: PublicPersistedTrip }) {
  const heroImage = getTripHeroImage(trip);

  return (
    <motion.section
      className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#10191D]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={pageTransition}
      aria-labelledby="itinerary-title"
    >
      <div className="relative min-h-[24rem] overflow-hidden sm:min-h-[32rem] lg:min-h-[38rem]">
        <Image
          src={heroImage}
          alt={`${trip.destination} travel scene`}
          fill
          priority
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,21,0.1)_0%,rgba(11,18,21,0.35)_44%,#0B1215_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(143,227,207,0.22),transparent_30%)]" />
      </div>

      <div className="relative px-4 pb-7 pt-0 sm:px-10 sm:pb-10 lg:px-14">
        <div className="-mt-20 max-w-4xl rounded-[1.45rem] border border-white/[0.08] bg-[#0B1215]/52 p-5 shadow-[0_24px_64px_rgba(0,0,0,0.24)] backdrop-blur-2xl sm:-mt-28 sm:rounded-[1.8rem] sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8FE3CF]">
              <Sparkles size={12} aria-hidden="true" />
              AI-crafted journey
            </span>
            {trip.country ? (
              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#F8FAF8]/76">
                {trip.country}
              </span>
            ) : null}
          </div>

          <h1
            id="itinerary-title"
            className="mt-6 max-w-3xl break-words text-3xl font-semibold leading-[1.03] tracking-[-0.035em] text-[#F8FAF8] sm:text-6xl sm:leading-[0.98] sm:tracking-[-0.06em]"
          >
            {trip.destination}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#F8FAF8]/82 sm:text-lg">
            {trip.summary ?? "A personalized itinerary shaped into a calmer, more cinematic journey."}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Dates",
                value: formatDateRange(trip.startDate, trip.endDate),
                Icon: CalendarDays
              },
              {
                label: "Travel vibe",
                value: trip.travelVibe,
                Icon: Compass
              },
              {
                label: "Duration",
                value: `${trip.duration} ${trip.duration === 1 ? "day" : "days"}`,
                Icon: Sparkles
              },
              {
                label: "Estimated total",
                value: formatCurrencyValue(trip.budgetBreakdown.total, trip.currency),
                Icon: Wallet
              }
            ].map(({ label, value, Icon }) => (
              <div
                key={label}
                className="rounded-[1.2rem] border border-white/[0.08] bg-white/[0.03] p-4"
              >
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  <Icon size={14} className="text-[#8FE3CF]" aria-hidden="true" />
                  {label}
                </p>
                <p className="mt-3 break-words text-sm font-medium leading-6 text-[#F8FAF8]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
