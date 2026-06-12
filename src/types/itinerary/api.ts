import type { SupportedCurrency } from "@/lib/currency";
import type {
  AccommodationPreference,
  TransportationPreference,
  TripGenerationInterest,
  TripGenerationTravelType
} from "@/types/forms";
import type { TripVibe } from "@/lib/trip-vibes";
import type { ItineraryDay } from "./itinerary-day";
import type {
  FullItineraryResponse,
  PersistedTrip,
  Trip,
  TripRequest
} from "./trip";

export type ApiResponse<T> =
  | {
      data: T;
      error?: never;
    }
  | {
      data?: never;
      error: string;
    };

/**
 * Frontend/backend contract for AI trip generation.
 */
export interface GenerateTripRequest {
  destination: string;
  country?: string | null;
  budget: number;
  travelVibe?: string;
  travelVibes?: TripVibe[];
  travelType: TripGenerationTravelType;
  interests: TripGenerationInterest[];
  accommodationPreference: AccommodationPreference;
  transportationPreference: TransportationPreference;
  startDate: string;
  endDate: string;
  currency: SupportedCurrency;
  locale?: string;
}

export interface GenerateTripResponse {
  id: string;
  trip: Trip;
  itinerary: FullItineraryResponse;
  days: ItineraryDay[];
  storage: "database" | "draft";
  fallback?: boolean;
  fallbackReason?: string;
  request?: TripRequest;
}

export interface SaveTripRequest {
  trip: Trip;
  source?: "ai" | "manual" | "imported";
}

export type PublicPersistedTrip = Omit<
  PersistedTrip,
  "userId" | "generatedItinerary" | "weatherData" | "mapLocations" | "shareToken"
>;

export interface SaveTripResponse {
  trip: PublicPersistedTrip;
  saved: boolean;
}

export interface SavedTripListItem {
  id: string;
  destination: string;
  country?: string | null;
  startDate: string;
  endDate: string;
  budget: number;
  currency: SupportedCurrency;
  travelVibe: string;
  summary?: string | null;
  coverImage?: string | null;
  createdAt: string;
}

export interface GetTripsResponse {
  trips: SavedTripListItem[];
  total: number;
}

export type GenerateItineraryInput = GenerateTripRequest;
export type GenerateItineraryResponse = FullItineraryResponse;
