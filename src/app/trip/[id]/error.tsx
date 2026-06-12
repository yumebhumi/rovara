"use client";

import { ItineraryErrorState } from "@/components/itinerary/error-state";

export default function TripPageError({
  error: _error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ItineraryErrorState
      title="This trip could not be loaded."
      description="The itinerary request ran into a server error. Try again or return to your trips."
      onRetry={reset}
    />
  );
}
