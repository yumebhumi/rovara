import type {
  AccommodationPreference,
  TransportationPreference,
  TripGenerationInterest,
  TripGenerationTravelType
} from "@/types/forms";

export const TRIP_VIBES = [
  "Relaxed",
  "Adventure",
  "Luxury",
  "Cultural",
  "Nature",
  "Food & Cafes"
] as const;

export type TripVibe = (typeof TRIP_VIBES)[number];

type TripVibeConfig = {
  description: string;
  detail: string;
  travelType: TripGenerationTravelType;
  interests: TripGenerationInterest[];
  accommodationPreference: AccommodationPreference;
  transportationPreference: TransportationPreference;
};

export const TRIP_VIBE_CONFIG: Record<TripVibe, TripVibeConfig> = {
  Relaxed: {
    description: "Slow days, softer pacing, and space to breathe.",
    detail: "Ideal for spa mornings, scenic neighborhoods, and lighter movement.",
    travelType: "Couple",
    interests: ["Relaxation", "Nature"],
    accommodationPreference: "Resorts",
    transportationPreference: "Trains"
  },
  Adventure: {
    description: "Action-forward days with a little more momentum.",
    detail: "Best for active routes, day trips, and flexible local discovery.",
    travelType: "Friends",
    interests: ["Adventure", "Nature"],
    accommodationPreference: "Airbnb",
    transportationPreference: "Rental Cars"
  },
  Luxury: {
    description: "Polished stays, signature dining, and elevated flow.",
    detail: "Works well for premium hotels, curated moments, and comfort-first routing.",
    travelType: "Luxury",
    interests: ["Luxury", "Food"],
    accommodationPreference: "Luxury Stays",
    transportationPreference: "Flights"
  },
  Cultural: {
    description: "Museums, neighborhoods, and story-rich city rhythm.",
    detail: "Built for architecture, galleries, local history, and slower urban wandering.",
    travelType: "Solo",
    interests: ["Culture", "Photography"],
    accommodationPreference: "Hotels",
    transportationPreference: "Public Transport"
  },
  Nature: {
    description: "Scenic routes, calmer landscapes, and outdoor breathing room.",
    detail: "Great for mountains, coastlines, gardens, and long-view travel days.",
    travelType: "Backpacking",
    interests: ["Nature", "Adventure"],
    accommodationPreference: "Airbnb",
    transportationPreference: "Walking"
  },
  "Food & Cafes": {
    description: "Market mornings, hidden tables, and coffee-led wandering.",
    detail: "Designed for café neighborhoods, local tasting stops, and lighter curation.",
    travelType: "Couple",
    interests: ["Food", "Culture"],
    accommodationPreference: "Hotels",
    transportationPreference: "Trains"
  }
};

export function getPreferencesForTripVibe(vibe: TripVibe) {
  return TRIP_VIBE_CONFIG[vibe];
}

export function isTripVibe(value: string): value is TripVibe {
  return TRIP_VIBES.includes(value as TripVibe);
}

export function normalizeTripVibes(vibes?: readonly string[] | null): TripVibe[] {
  if (!vibes?.length) {
    return ["Relaxed"];
  }

  const selectedVibes = vibes.filter(isTripVibe);

  return selectedVibes.length > 0 ? selectedVibes : ["Relaxed"];
}

export function getPreferencesForTripVibes(vibes: TripVibe[]) {
  const selectedVibes: TripVibe[] = vibes.length > 0 ? vibes : ["Relaxed"];
  const primary = TRIP_VIBE_CONFIG[selectedVibes[0]];
  const interests = Array.from(
    new Set(selectedVibes.flatMap((vibe) => TRIP_VIBE_CONFIG[vibe].interests))
  );

  return {
    ...primary,
    interests
  };
}

export function formatTripVibeSelection(vibes: TripVibe[]) {
  if (vibes.length === 0) {
    return "Relaxed";
  }

  if (vibes.length === 1) {
    return vibes[0];
  }

  if (vibes.length === 2) {
    return `${vibes[0]} + ${vibes[1]}`;
  }

  return `${vibes[0]}, ${vibes[1]} +${vibes.length - 2} more`;
}

type TripVibeSource = {
  travelType?: TripGenerationTravelType;
  interests?: TripGenerationInterest[];
  accommodationPreference?: AccommodationPreference;
  transportationPreference?: TransportationPreference;
};

export function resolveTripVibeFromValues(values: Partial<TripVibeSource>): TripVibe {
  const interests = values.interests ?? [];

  if (values.travelType === "Luxury" || values.accommodationPreference === "Luxury Stays") {
    return "Luxury";
  }

  if (interests.includes("Food")) {
    return "Food & Cafes";
  }

  if (interests.includes("Culture") || interests.includes("Photography")) {
    return "Cultural";
  }

  if (values.transportationPreference === "Walking") {
    return "Nature";
  }

  if (values.travelType === "Backpacking") {
    return "Nature";
  }

  if (values.travelType === "Friends" || interests.includes("Adventure")) {
    return "Adventure";
  }

  return "Relaxed";
}
