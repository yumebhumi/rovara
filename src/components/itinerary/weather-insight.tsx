"use client";

import { CloudDrizzle, CloudSun, Umbrella } from "lucide-react";
import { motion } from "framer-motion";
import type { PublicPersistedTrip } from "@/types";
import { pageTransition } from "@/styles/animations";

export function WeatherInsightSection({ trip }: { trip: PublicPersistedTrip }) {
  if (!trip.weatherInsights.length) {
    return null;
  }

  return (
    <section aria-labelledby="weather-title" className="space-y-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8FE3CF]">
          Weather intelligence
        </p>
        <h2
          id="weather-title"
          className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-[#F8FAF8] sm:text-[2.8rem] sm:tracking-[-0.05em]"
        >
          Conditions translated into calmer travel choices.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[#94A3B8]">
          Weather context stays subtle and useful, woven into the trip without becoming a forecast dashboard.
        </p>
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-3">
        {trip.weatherInsights.map((insight, index) => (
          <motion.article
            key={`${insight.condition}-${index}`}
            className="rounded-[1.45rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(20,184,166,0.08),rgba(255,255,255,0.03))] p-5 shadow-[0_18px_52px_rgba(0,0,0,0.16)] backdrop-blur-xl"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={pageTransition}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8FE3CF]">
                  {insight.condition}
                </p>
                <h3 className="mt-2 break-words text-2xl font-semibold tracking-[-0.035em] text-[#F8FAF8] sm:tracking-[-0.04em]">
                  {insight.temperature}C
                </h3>
              </div>
              <CloudSun size={22} className="text-[#8FE3CF]" aria-hidden="true" />
            </div>

            <p className="mt-4 text-sm leading-7 text-[#94A3B8]">
              {insight.recommendation}
            </p>

            <div className="mt-5 space-y-3 text-sm text-[#F8FAF8]/78">
              {insight.precipitationChance != null ? (
                <p className="flex items-center gap-2">
                  <Umbrella size={15} className="text-[#8FE3CF]" />
                  {insight.precipitationChance}% precipitation chance
                </p>
              ) : null}
              {insight.humidity != null ? (
                <p className="flex items-center gap-2">
                  <CloudDrizzle size={15} className="text-[#8FE3CF]" />
                  {insight.humidity}% humidity
                </p>
              ) : null}
              {insight.bestTimeToVisit ? (
                <p className="text-[#94A3B8]">
                  Best window: <span className="text-[#F8FAF8]">{insight.bestTimeToVisit}</span>
                </p>
              ) : null}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
