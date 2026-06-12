"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { BookmarkPlus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TripDraftRecord } from "@/lib/trip-draft";
import { deleteTripDraft } from "@/lib/trip-draft";
import { useSaveTrip } from "@/hooks";

export function SaveDraftTripBar({ draft }: { draft: TripDraftRecord }) {
  const router = useRouter();
  const {
    saveTrip,
    isSaving,
    isSaved,
    successMessage,
    error,
    clearError,
    clearSuccess
  } = useSaveTrip();

  async function handleSave() {
    clearError();
    clearSuccess();

    try {
      const result = await saveTrip({
        trip: draft.itinerary.trip,
        source: "ai"
      });

      window.setTimeout(() => {
        deleteTripDraft(draft.id);

        startTransition(() => {
          router.replace(`/trip/${result.trip.id}?saved=1`);
        });
      }, 650);
    } catch {
      return;
    }
  }

  return (
    <section className="rounded-[1.6rem] border border-[#14B8A6]/18 bg-[linear-gradient(135deg,rgba(20,184,166,0.12),rgba(255,255,255,0.035))] px-5 py-5 shadow-[0_18px_52px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8FE3CF]">
            Unsaved itinerary
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#F8FAF8]">
            Save this AI-crafted journey to your trip library.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#94A3B8]">
            The itinerary is ready to review. Save it when you want this journey to live in your account and appear in saved trips.
          </p>
          {successMessage ? (
            <p aria-live="polite" className="mt-3 text-sm text-[#8FE3CF]">
              {successMessage} Opening your saved itinerary...
            </p>
          ) : null}
          {error ? (
            <p aria-live="polite" className="mt-3 text-sm text-[#FCA5A5]">{error}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs text-[#F8FAF8]/78 md:inline-flex">
            <CheckCircle2 size={14} className="text-[#8FE3CF]" />
            {isSaved ? "Saved to your account" : "Draft stored locally"}
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving || isSaved}
            aria-label={isSaving ? "Saving trip" : "Save trip"}
            className="h-12 rounded-full px-6"
          >
            <BookmarkPlus size={16} />
            {isSaving ? "Saving trip..." : isSaved ? "Trip Saved" : "Save Trip"}
          </Button>
        </div>
      </div>
    </section>
  );
}
