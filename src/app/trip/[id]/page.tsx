import { z } from "zod";
import { TripItineraryClient } from "@/components/itinerary/trip-itinerary-client";
import { ItineraryEmptyState } from "@/components/itinerary/empty-state";
import { ItineraryErrorState } from "@/components/itinerary/error-state";
import { getAuthenticatedApiUser } from "@/lib/auth/api";
import { publicPersistedTripSchema } from "@/lib/validations/itinerary-schema";
import { ROUTES } from "@/constants/routes";
import { getTripById } from "@/services/trips";

const tripPageParamsSchema = z.object({
  id: z.string().trim().min(1)
});

export default async function TripPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ saved?: string }>;
}) {
  const user = await getAuthenticatedApiUser();

  if (!user) {
    return (
      <ItineraryErrorState
        title="Sign in to open this itinerary."
        description={`Your session is required to view saved trips. Return to ${ROUTES.SIGN_IN} and try again.`}
      />
    );
  }

  const paramsResult = tripPageParamsSchema.safeParse(await params);

  if (!paramsResult.success) {
    return (
      <ItineraryErrorState
        title="This trip could not be loaded."
        description="The trip link is incomplete or no longer valid."
      />
    );
  }

  let trip;

  try {
    trip = await getTripById(paramsResult.data.id, user.clerkId);
  } catch {
    return (
      <ItineraryErrorState
        title="This trip could not be loaded."
        description="The trip detail request failed. Try again in a moment or return to your saved trips."
      />
    );
  }

  if (!trip) {
    return (
      <ItineraryErrorState
        title="This trip could not be found."
        description="It may have been deleted or is no longer available to your account."
      />
    );
  }

  const parsed = publicPersistedTripSchema.safeParse(trip);

  if (!parsed.success) {
    return (
      <ItineraryErrorState
        title="Trip data is incomplete."
        description="The saved itinerary exists, but its structure is not ready for rendering yet."
      />
    );
  }

  if (!parsed.data.itineraryDays.length) {
    return (
      <ItineraryEmptyState
        title="This journey has no rendered itinerary yet."
        description="Generate or regenerate the trip to unlock the full day-by-day itinerary experience."
      />
    );
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return (
    <TripItineraryClient
      trip={parsed.data}
      savedState={resolvedSearchParams?.saved === "1"}
    />
  );
}
