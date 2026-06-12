import type {
  Coordinates,
  MediaAsset,
  MetadataRecord,
  Nullable
} from "./shared";

/**
 * Canonical AI-safe activity categories used across validation, rendering, and
 * future personalization layers.
 */
export enum ActivityCategory {
  FOOD = "food",
  CULTURE = "culture",
  NATURE = "nature",
  ADVENTURE = "adventure",
  SHOPPING = "shopping",
  RELAXATION = "relaxation",
  TRANSPORTATION = "transportation"
}

export const ACTIVITY_CATEGORY_VALUES = [
  ActivityCategory.FOOD,
  ActivityCategory.CULTURE,
  ActivityCategory.NATURE,
  ActivityCategory.ADVENTURE,
  ActivityCategory.SHOPPING,
  ActivityCategory.RELAXATION,
  ActivityCategory.TRANSPORTATION
] as const;

export enum TransportationType {
  Walking = "walking",
  PublicTransport = "public-transport",
  Taxi = "taxi",
  Rideshare = "rideshare",
  RentalCar = "rental-car",
  Flight = "flight",
  Train = "train",
  Ferry = "ferry",
  Bicycle = "bicycle",
  PrivateTransfer = "private-transfer"
}

export const TRANSPORTATION_TYPE_VALUES = [
  TransportationType.Walking,
  TransportationType.PublicTransport,
  TransportationType.Taxi,
  TransportationType.Rideshare,
  TransportationType.RentalCar,
  TransportationType.Flight,
  TransportationType.Train,
  TransportationType.Ferry,
  TransportationType.Bicycle,
  TransportationType.PrivateTransfer
] as const;

export type ActivityTime = "morning" | "afternoon" | "evening";

const LEGACY_ACTIVITY_CATEGORY_MAP = {
  food: ActivityCategory.FOOD,
  cafe: ActivityCategory.FOOD,
  sightseeing: ActivityCategory.CULTURE,
  "hidden-gem": ActivityCategory.CULTURE,
  transport: ActivityCategory.TRANSPORTATION,
  transportation: ActivityCategory.TRANSPORTATION,
  activity: ActivityCategory.ADVENTURE,
  adventure: ActivityCategory.ADVENTURE,
  nature: ActivityCategory.NATURE,
  shopping: ActivityCategory.SHOPPING,
  accommodation: ActivityCategory.RELAXATION,
  relaxation: ActivityCategory.RELAXATION,
  wellness: ActivityCategory.RELAXATION,
  nightlife: ActivityCategory.RELAXATION,
  culture: ActivityCategory.CULTURE
} as const;

/**
 * Normalizes AI and legacy stored values into the canonical activity category
 * enum so malformed or older payloads do not leak to the frontend unchecked.
 */
export function normalizeActivityCategory(value: unknown): ActivityCategory | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  return LEGACY_ACTIVITY_CATEGORY_MAP[
    normalized as keyof typeof LEGACY_ACTIVITY_CATEGORY_MAP
  ] ?? null;
}

/**
 * Rich place descriptor that is safe to persist and render while remaining map
 * provider agnostic.
 */
export interface ActivityLocation {
  name: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  placeId?: string | null;
  timezone?: string | null;
  lat?: number;
  lng?: number;
}

/**
 * Core itinerary activity shared by AI output, persistence, and rendering.
 */
export interface Activity {
  id: string;
  title: string;
  description: string;
  location?: ActivityLocation | null;
  coordinates?: Coordinates | null;
  startTime?: string | null;
  endTime?: string | null;
  estimatedCost: number;
  category: ActivityCategory;
  tags: string[];
  image?: Nullable<MediaAsset>;
  bookingRequired: boolean;
  accessibilityNotes?: string | null;
  aiConfidenceScore?: number | null;
  transportationType?: TransportationType | null;
  metadata?: MetadataRecord;
  /**
   * Legacy compatibility fields still consumed in a few timeline renderers.
   */
  time?: ActivityTime;
  duration?: number;
  locationName?: string;
}
