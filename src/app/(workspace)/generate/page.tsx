"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GenerateTripForm } from "@/components/forms";
import { GenerationOverlay } from "@/components/loading";
import { LiveItineraryPreview } from "@/components/preview";
import { getPreferencesForTravelType, parsePlannerBudget } from "@/lib/landing-planner";
import { resolveTripVibeFromValues } from "@/lib/trip-vibes";
import { TRIP_GENERATION_TRAVEL_TYPES, type TripGenerationTravelType } from "@/types/forms";
import type { TripFormValues } from "@/lib/validations/trip-schema";
import { useCurrency } from "@/providers";
import { useGenerateTrip } from "@/hooks/use-generate-trip";

function resolveTravelType(value: string | null): TripGenerationTravelType | undefined {
  return TRIP_GENERATION_TRAVEL_TYPES.find((travelType) => travelType === value);
}

function arePreviewValuesEqual(
  current: Partial<TripFormValues>,
  next: Partial<TripFormValues>
) {
  const currentVibes = current.vibes ?? [];
  const nextVibes = next.vibes ?? [];

  return (
    current.destination === next.destination &&
    current.startDate === next.startDate &&
    current.endDate === next.endDate &&
    (current.budget ?? 0) === (next.budget ?? 0) &&
    currentVibes.length === nextVibes.length &&
    currentVibes.every((vibe, index) => vibe === nextVibes[index])
  );
}

export default function GeneratePage() {
  const searchParams = useSearchParams();
  const { currency } = useCurrency();
  const importedDestination = searchParams.get("destination") ?? "";
  const importedStartDate = searchParams.get("startDate") ?? "";
  const importedTravelType = resolveTravelType(searchParams.get("travelType"));
  const importedBudgetParam = searchParams.get("budget");
  const importedBudget = importedBudgetParam
    ? parsePlannerBudget(importedBudgetParam, 2000)
    : undefined;
  const importedPreferences = getPreferencesForTravelType(importedTravelType);
  const initialPreviewValues = useMemo<Partial<TripFormValues>>(
    () => ({
      destination: importedDestination,
      ...(typeof importedBudget === "number" ? { budget: importedBudget } : {}),
      startDate: importedStartDate || "",
      endDate: importedStartDate || "",
      vibes: [
        resolveTripVibeFromValues({
          travelType: importedTravelType,
          interests: importedPreferences
        })
      ]
    }),
    [importedBudget, importedDestination, importedPreferences, importedStartDate, importedTravelType]
  );
  const [previewValues, setPreviewValues] = useState<Partial<TripFormValues>>(initialPreviewValues);
  const {
    generateTrip,
    clearError,
    error,
    isGenerating,
    activeMessageIndex,
    messages
  } = useGenerateTrip({ currency });
  const handlePreviewValuesChange = useCallback((nextValues: Partial<TripFormValues>) => {
    setPreviewValues((currentValues) =>
      arePreviewValuesEqual(currentValues, nextValues) ? currentValues : nextValues
    );
  }, []);

  return (
    <section className="grid min-w-0 gap-10 xl:grid-cols-[minmax(0,1fr)_23rem] xl:items-start">
      <div className="min-w-0 space-y-8 sm:space-y-9">
        <div className="max-w-2xl space-y-4">
          <p className="rovara-eyebrow">
            AI trip studio
          </p>
          <h1 className="max-w-3xl text-balance text-[clamp(2.25rem,10vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[#F8FAF8] sm:leading-[0.97] sm:tracking-[-0.055em]">
            Craft your next escape.
          </h1>
          <p className="max-w-xl text-[1rem] leading-8 text-[#94A3B8]">
            Create an AI-powered itinerary in a few calm steps. Choose the destination, dates, budget, and atmosphere, then let Rovara shape the journey.
          </p>
        </div>

        <div className="w-full max-w-[42rem]">
          <GenerateTripForm
            key={[importedDestination, importedBudget, importedStartDate, importedTravelType ?? ""].join("|")}
            initialValues={initialPreviewValues}
            onValuesChange={handlePreviewValuesChange}
            onSubmitTrip={generateTrip}
            submitError={error}
            submitting={isGenerating}
            onClearError={clearError}
          />
        </div>
      </div>

      <LiveItineraryPreview values={previewValues} loading={isGenerating} />
      <GenerationOverlay
        open={isGenerating}
        activeIndex={activeMessageIndex}
        messages={messages}
      />
    </section>
  );
}
