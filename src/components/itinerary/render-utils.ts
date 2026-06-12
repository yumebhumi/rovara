import type { Activity, ItineraryDay, PersistedTrip, PublicPersistedTrip } from "@/types";
import type { MapPoint } from "@/components/map";
import type { TripDraftRecord } from "@/lib/trip-draft";

export function formatActivityCategory(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getTripHeroImage(trip: PublicPersistedTrip) {
  if (trip.coverImage?.url) {
    return trip.coverImage.url;
  }

  const query = encodeURIComponent(`${trip.destination} cinematic travel`);
  return `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80&destination=${query}`;
}

export function getActivityLocationLabel(activity: Activity) {
  return (
    activity.location?.name ??
    activity.locationName ??
    activity.location?.address ??
    null
  );
}

export function getActivityMapPoints(activity: Activity): MapPoint[] {
  const coordinates =
    activity.coordinates ??
    (typeof activity.location?.lat === "number" &&
    typeof activity.location?.lng === "number"
      ? { lat: activity.location.lat, lng: activity.location.lng }
      : null);

  if (!coordinates) {
    return [];
  }

  return [
    {
      lat: coordinates.lat,
      lng: coordinates.lng,
      label: activity.title,
      category: activity.category
    }
  ];
}

export function getDayMapPoints(day: ItineraryDay): MapPoint[] {
  return day.activities.flatMap(getActivityMapPoints);
}

export function buildFinalTravelNotes(trip: PublicPersistedTrip) {
  const recommendationTips = trip.recommendations
    .flatMap((recommendation) => [
      recommendation.localTip,
      recommendation.description
    ])
    .filter((note): note is string => Boolean(note?.trim()));
  const movementTips = trip.itineraryDays
    .flatMap((day) => day.transportationNotes)
    .filter((note): note is string => Boolean(note?.trim()));
  const weatherTips = trip.weatherInsights
    .map((insight) => insight.recommendation)
    .filter((note): note is string => Boolean(note?.trim()));

  return Array.from(
    new Set([...recommendationTips, ...movementTips, ...weatherTips])
  ).slice(0, 4);
}

export function buildPersistedTripFromDraft(draft: TripDraftRecord): PersistedTrip {
  const trip = draft.itinerary.trip;

  return {
    ...trip,
    userId: "draft",
    preferences: [],
    interests: [],
    travelType: trip.travelVibe,
    accommodationPreference: null,
    transportationPreference: null,
    status: "planning",
    generatedItinerary: draft.itinerary,
    weatherData: draft.itinerary.weatherInsights,
    mapLocations: null,
    itinerary: draft.itinerary.days,
    shareToken: null
  };
}
