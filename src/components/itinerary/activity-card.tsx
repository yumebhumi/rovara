"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Clock3, MapPin, Tag, Wallet } from "lucide-react";
import { useId, useState } from "react";
import { MiniMapCard } from "@/components/map";
import type { Activity } from "@/types";
import { panelTransition } from "@/styles/animations";
import { formatCurrencyValue } from "@/lib/currency";
import { cn } from "@/utils/cn";
import {
  formatActivityCategory,
  getActivityLocationLabel,
  getActivityMapPoints
} from "./render-utils";

type ActivityCardProps = {
  activity: Activity;
  dayPartLabel: string;
  currency: string;
};

export function ActivityCard({
  activity,
  dayPartLabel,
  currency
}: ActivityCardProps) {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const locationLabel = getActivityLocationLabel(activity);
  const mapPoints = getActivityMapPoints(activity);
  const timeLabel =
    activity.startTime && activity.endTime
      ? `${activity.startTime} - ${activity.endTime}`
      : activity.startTime ?? dayPartLabel;

  return (
    <motion.article
      layout
      className="min-w-0 overflow-hidden rounded-[1.4rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] shadow-[0_18px_52px_rgba(0,0,0,0.16)] backdrop-blur-xl transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-px hover:border-[#8FE3CF]/18 hover:shadow-[0_20px_56px_rgba(0,0,0,0.2)]"
    >
      {activity.image?.url ? (
        <div className="relative h-40 overflow-hidden">
          <Image
            src={activity.image.url}
            alt={activity.image.alt ?? activity.title}
            fill
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,21,0.08),rgba(11,18,21,0.54))]" />
        </div>
      ) : null}

      <div className="p-5 sm:p-6">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={contentId}
          className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FE3CF]/60"
        >
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8FE3CF]">
            <span>{dayPartLabel}</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#8FE3CF]/70" />
            <span>{formatActivityCategory(activity.category)}</span>
          </div>
          <h4 className="mt-3 break-words text-xl font-semibold tracking-[-0.03em] text-[#F8FAF8]">
            {activity.title}
          </h4>
          <p className="mt-3 text-sm leading-7 text-[#94A3B8]">
            {activity.description}
          </p>
        </button>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-[#F8FAF8]/78">
            <Clock3 size={13} className="text-[#8FE3CF]" aria-hidden="true" />
            <span className="truncate">{timeLabel}</span>
          </span>
          {locationLabel ? (
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-[#F8FAF8]/78">
              <MapPin size={13} className="text-[#8FE3CF]" aria-hidden="true" />
              <span className="truncate">{locationLabel}</span>
            </span>
          ) : null}
          <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-[#F8FAF8]/78">
            <Wallet size={13} className="text-[#8FE3CF]" aria-hidden="true" />
            <span className="truncate">{formatCurrencyValue(activity.estimatedCost, currency as never)}</span>
          </span>
          {activity.tags[0] ? (
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-[#F8FAF8]/78">
              <Tag size={13} className="text-[#8FE3CF]" aria-hidden="true" />
              <span className="truncate">{activity.tags[0]}</span>
            </span>
          ) : null}
        </div>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              id={contentId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={panelTransition}
              className="overflow-hidden"
            >
              <div className="mt-5 grid gap-4 border-t border-white/[0.08] pt-5 sm:grid-cols-[1fr_13rem]">
                <div className="space-y-3 text-sm leading-7 text-[#94A3B8]">
                  {activity.accessibilityNotes ? (
                    <p>
                      <span className="text-[#F8FAF8]">Accessibility:</span>{" "}
                      {activity.accessibilityNotes}
                    </p>
                  ) : null}
                  <p>
                    <span className="text-[#F8FAF8]">Booking:</span>{" "}
                    {activity.bookingRequired ? "Recommended ahead of time." : "Flexible stop."}
                  </p>
                  {activity.aiConfidenceScore != null ? (
                    <p>
                      <span className="text-[#F8FAF8]">AI confidence:</span>{" "}
                      {Math.round(activity.aiConfidenceScore * 100)}%
                    </p>
                  ) : null}
                </div>
                <div className={cn(!mapPoints.length && "hidden sm:block")}>
                  {mapPoints.length ? (
                    <MiniMapCard points={mapPoints} label={activity.title} />
                  ) : (
                    <div className="flex h-28 items-center justify-center rounded-[1rem] border border-dashed border-white/[0.08] text-xs text-[#64748B]">
                      Map preview unavailable
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
