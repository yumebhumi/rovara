import type { SupportedCurrency } from "@/lib/currency";
import type {
  AccommodationPreference,
  TransportationPreference,
  TripGenerationTravelType
} from "@/types/forms";
import type { Preference } from "@/constants/preferences";
import type { TripVibe } from "@/lib/trip-vibes";
import type { BudgetBreakdown } from "./budget";
import type { ItineraryDay } from "./itinerary-day";
import type { Recommendation } from "./recommendation";
import type {
  AIAttribution,
  AuditFields,
  EntityId,
  IsoDateString,
  MediaAsset,
  MetadataRecord,
  Nullable
} from "./shared";
import type { WeatherInsight } from "./weather";

export type TripStatus =
  | "planning"
  | "upcoming"
  | "active"
  | "completed"
  | "cancelled"
  | "archived";

export type TripTravelType = Lowercase<TripGenerationTravelType>;
export type TripPreference = Preference | string;

/**
 * Primary itinerary aggregate shared across frontend, backend, AI output, and
 * persistence transformation layers.
 */
export interface Trip extends AuditFields {
  id: EntityId;
  userId: EntityId;
  destination: string;
  country?: string | null;
  startDate: IsoDateString;
  endDate: IsoDateString;
  duration: number;
  budget: number;
  currency: SupportedCurrency;
  travelVibe: string;
  coverImage?: Nullable<MediaAsset>;
  summary?: string | null;
  itineraryDays: ItineraryDay[];
  recommendations: Recommendation[];
  budgetBreakdown: BudgetBreakdown;
  weatherInsights: WeatherInsight[];
  travelVibes?: TripVibe[];
  metadata?: MetadataRecord;
  ai?: AIAttribution;
}

/**
 * Persistence-safe extension used by current saved-trip and trip-detail flows.
 */
export interface PersistedTrip extends Trip {
  status?: TripStatus | string;
  preferences: TripPreference[];
  interests?: string[];
  travelType?: TripTravelType | string;
  accommodationPreference?: AccommodationPreference | string | null;
  transportationPreference?: TransportationPreference | string | null;
  generatedItinerary?: unknown;
  weatherData?: unknown;
  mapLocations?: unknown;
  itinerary?: unknown;
  shareToken?: string | null;
}

export interface TripSummary {
  destination: string;
  country?: string | null;
  duration: string;
  travelVibe: string;
  summary: string;
  coverImage?: Nullable<MediaAsset>;
}

export interface TripRequest {
  destination: string;
  country?: string | null;
  startDate: IsoDateString;
  endDate: IsoDateString;
  budget: number;
  travelVibe: string;
  currency?: SupportedCurrency;
  travelVibes?: TripVibe[];
}

/**
 * Legacy compatibility payload plus canonical `trip`.
 */
export interface FullItineraryResponse {
  trip: Trip;
  tripSummary: TripSummary;
  budgetBreakdown: BudgetBreakdown;
  recommendations: Recommendation[];
  weatherInsights: WeatherInsight[];
  days: ItineraryDay[];
}

export type Itinerary = Pick<Trip, "id" | "itineraryDays" | "budgetBreakdown">;
export type CreateTripInput = Omit<
  PersistedTrip,
  "id" | "userId" | "createdAt" | "updatedAt" | "shareToken"
>;
