"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatTripVibeSelection } from "@/lib/trip-vibes";
import { saveTripDraft } from "@/lib/trip-draft";
import type { SupportedCurrency } from "@/lib/currency";
import type { TripFormValues } from "@/lib/validations/trip-schema";
import {
  buildGenerateTripPayload,
  getTripGenerationErrorMessage,
  submitTripGeneration
} from "@/services/trip-service";

const generationMessages = [
  "Planning your journey...",
  "Finding local experiences...",
  "Optimizing travel flow...",
  "Curating destination highlights...",
  "Building your itinerary...",
  "Creating your adventure..."
] as const;

type UseGenerateTripOptions = {
  currency: SupportedCurrency;
};

export function useGenerateTrip({ currency }: UseGenerateTripOptions) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) return;

    const timer = window.setInterval(() => {
      setActiveMessageIndex((current) => (current + 1) % generationMessages.length);
    }, 2100);

    return () => window.clearInterval(timer);
  }, [isGenerating]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const generateTrip = useCallback(
    async (values: TripFormValues) => {
      if (isGenerating) return;

      setError(null);
      setActiveMessageIndex(0);
      setIsGenerating(true);

      try {
        const travelVibe = formatTripVibeSelection(values.vibes);
        const result = await submitTripGeneration(
          buildGenerateTripPayload({
            ...values,
            currency
          })
        );

        if (result.storage === "draft") {
          saveTripDraft({
            id: result.id,
            itinerary: result.itinerary,
            request: result.request ?? {
              destination: values.destination,
              startDate: values.startDate,
              endDate: values.endDate,
              budget: values.budget,
              travelVibe,
              currency
            },
            generatedAt: new Date().toISOString()
          });

          startTransition(() => {
            router.push(`/trip/draft?draftId=${encodeURIComponent(result.id)}`);
          });
          return;
        }

        startTransition(() => {
          router.push(`/trip/${result.id}`);
        });
      } catch (generationError) {
        setError(getTripGenerationErrorMessage(generationError));
        setActiveMessageIndex(0);
        setIsGenerating(false);
      }
    },
    [currency, isGenerating, router]
  );

  return {
    generateTrip,
    clearError,
    error,
    isGenerating,
    activeMessageIndex,
    messages: generationMessages
  };
}
