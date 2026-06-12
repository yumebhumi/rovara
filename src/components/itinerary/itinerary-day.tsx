"use client";

import { motion } from "framer-motion";
import { CloudSun, Moon, Sun, Sunrise } from "lucide-react";
import type { ItineraryDay, PublicPersistedTrip } from "@/types";
import { TimelineMapPreview } from "@/components/map";
import { fadeInUp } from "@/styles/animations";
import { formatDate } from "@/utils/date";
import { ActivityCard } from "./activity-card";
import { getDayMapPoints } from "./render-utils";

const DAY_PART_META = {
  morning: { label: "Morning", Icon: Sunrise },
  afternoon: { label: "Afternoon", Icon: Sun },
  evening: { label: "Evening", Icon: Moon }
} as const;

type ItineraryDayProps = {
  day: ItineraryDay;
  trip: PublicPersistedTrip;
};

export function ItineraryDaySection({
  day,
  trip
}: ItineraryDayProps) {
  const dayPoints = getDayMapPoints(day);

  return (
    <motion.article
      className="relative grid min-w-0 gap-7 pl-8 sm:gap-8 sm:pl-10 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-12 lg:pl-0"
      variants={fadeInUp}
    >
      <div
        aria-hidden="true"
        className="absolute left-3 top-3 h-full w-px bg-gradient-to-b from-[#8FE3CF]/55 via-white/[0.08] to-transparent lg:left-[12.9rem]"
      />
      <div
        aria-hidden="true"
        className="absolute left-[0.45rem] top-2 h-5 w-5 rounded-full border border-[#8FE3CF]/36 bg-[#0B1215] shadow-[0_0_24px_rgba(143,227,207,0.34)] lg:left-[12.35rem]"
      />

      <header className="space-y-4 lg:text-right">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8FE3CF]">
            Day {day.dayNumber}
          </p>
          <h3 className="mt-3 break-words text-2xl font-semibold tracking-[-0.035em] text-[#F8FAF8] sm:tracking-[-0.04em]">
            {day.title}
          </h3>
          <p className="mt-2 text-sm text-[#94A3B8]">
            {formatDate(day.date)}
          </p>
        </div>

        {day.weatherSummary ? (
          <div className="rounded-[1.1rem] border border-white/[0.08] bg-white/[0.03] p-4 text-left lg:ml-auto">
            <div className="flex items-center gap-2 text-sm font-medium text-[#F8FAF8]">
              <CloudSun size={16} className="text-[#8FE3CF]" aria-hidden="true" />
              Weather note
            </div>
            <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
              {day.weatherSummary}
            </p>
          </div>
        ) : null}

        <TimelineMapPreview
          points={dayPoints.slice(0, 4)}
          label={`Day ${day.dayNumber} route`}
        />
      </header>

      <div className="min-w-0 space-y-9">
        {(Object.keys(DAY_PART_META) as Array<keyof typeof DAY_PART_META>).map((part) => {
          const activities = day[part];

          if (!activities.length) {
            return null;
          }

          const { label, Icon } = DAY_PART_META[part];

          return (
            <section key={part} aria-labelledby={`day-${day.dayNumber}-${part}`}>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-[#14B8A6]/10 text-[#8FE3CF]">
                  <Icon size={17} aria-hidden="true" />
                </span>
                <div>
                  <h4
                    id={`day-${day.dayNumber}-${part}`}
                    className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F8FAF8]/84"
                  >
                    {label}
                  </h4>
                  <p className="mt-1 text-xs text-[#64748B]">
                    {activities.length} planned {activities.length === 1 ? "stop" : "stops"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    dayPartLabel={label}
                    currency={trip.currency}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </motion.article>
  );
}
