"use client";

import Image from "next/image";
import { CalendarRange, Compass, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { deriveLivePreview } from "@/lib/preview/live-preview";
import type { Place } from "@/services/maps";
import type { ItineraryDay } from "@/types";
import type { TripFormValues } from "@/lib/validations/trip-schema";
import { useCurrency } from "@/providers";
import { formatDateRange } from "@/utils/date";
import { cn } from "@/utils/cn";

const FALLBACK_PREVIEW_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80";

type LiveItineraryPreviewProps = {
  values: Partial<TripFormValues>;
  days?: ItineraryDay[] | null;
  loading?: boolean;
};

function PreviewRow({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: string;
  icon: typeof CalendarRange;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-[1.2rem] bg-white/[0.03] px-4 py-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-[#8FE3CF]">
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">
          {label}
        </p>
        <p className="mt-1 break-words text-sm text-[#F8FAF8]">{value}</p>
      </div>
    </div>
  );
}

export function LiveItineraryPreview({
  values,
  days,
  loading = false
}: LiveItineraryPreviewProps) {
  const preview = useMemo(() => deriveLivePreview(values, days), [values, days]);
  const { formatCurrency } = useCurrency();
  const destination = preview.summary.destination.trim();
  const [resolvedPlaceState, setResolvedPlaceState] = useState<{
    destination: string;
    place: Place | null;
  }>({
    destination: "",
    place: null
  });
  const [failedSnapshotSrc, setFailedSnapshotSrc] = useState<string | null>(null);
  const dateLabel =
    preview.summary.startDate && preview.summary.endDate
      ? formatDateRange(preview.summary.startDate, preview.summary.endDate)
      : "Choose travel dates";
  const budgetLabel = values.budget ? formatCurrency(values.budget) : "Set your budget";

  useEffect(() => {
    if (!destination) {
      return;
    }

    let cancelled = false;

    async function loadPlace() {
      try {
        const response = await fetch(`/api/places?destination=${encodeURIComponent(destination)}`);
        const results = (await response.json()) as Place[];

        if (!cancelled) {
          setResolvedPlaceState({
            destination,
            place: results[0] ?? null
          });
        }
      } catch {
        if (!cancelled) {
          setResolvedPlaceState({
            destination,
            place: null
          });
        }
      }
    }

    void loadPlace();

    return () => {
      cancelled = true;
    };
  }, [destination]);

  const resolvedPlace =
    resolvedPlaceState.destination === destination ? resolvedPlaceState.place : null;
  const baseSnapshotSrc =
    resolvedPlace?.imageUrl ||
    preview.destination.imageUrl ||
    FALLBACK_PREVIEW_IMAGE;
  const snapshotSrc =
    failedSnapshotSrc === baseSnapshotSrc ? FALLBACK_PREVIEW_IMAGE : baseSnapshotSrc;
  const countryLabel = resolvedPlace?.country || preview.destination.country;
  const description = resolvedPlace?.description || preview.destination.description;

  return (
    <aside className="min-w-0 xl:sticky xl:top-28">
      <div className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[rgba(16,25,29,0.88)] shadow-[0_26px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <div className="border-b border-white/[0.06] px-5 py-5 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8FE3CF]">
            Live preview
          </p>
          <h2 className="mt-3 text-[1.45rem] font-semibold leading-[1.06] tracking-[-0.035em] text-[#F8FAF8] sm:text-[1.8rem] sm:leading-[1.02] sm:tracking-[-0.05em]">
            A calm snapshot of the trip you&apos;re shaping.
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-7 text-[#94A3B8]">
            Keep the focus on the next choice. Rovara updates this card as your trip takes form.
          </p>
        </div>

        <div className="p-4 sm:p-6">
          <div
            className={cn(
              "relative overflow-hidden rounded-[1.7rem] border border-white/[0.08] bg-[#10191d]",
              loading && "animate-pulse"
            )}
          >
            <div className="relative h-52 overflow-hidden sm:h-60">
              <Image
                src={snapshotSrc}
                alt={`${preview.summary.destination} travel preview`}
                onError={() => {
                  setFailedSnapshotSrc(baseSnapshotSrc);
                }}
                fill
                unoptimized
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,21,0.04),rgba(11,18,21,0.18)_45%,rgba(11,18,21,0.72)_100%)]" />
            </div>

            <div className="space-y-4 px-4 py-5 sm:px-5">
              <div className="inline-flex rounded-full border border-white/14 bg-black/18 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F8FAF8]">
                {countryLabel}
              </div>
              <div>
                <h3 className="break-words text-2xl font-semibold tracking-[-0.035em] text-[#F8FAF8] sm:text-3xl sm:tracking-[-0.05em]">
                  {preview.summary.destination}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-7 text-[#F8FAF8]/80">
                  {description}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <PreviewRow label="Dates" value={dateLabel} icon={CalendarRange} />
            <PreviewRow label="Travel vibes" value={preview.summary.travelVibe} icon={Compass} />
            <PreviewRow label="Estimated budget" value={budgetLabel} icon={Wallet} />
          </div>
        </div>
      </div>
    </aside>
  );
}
