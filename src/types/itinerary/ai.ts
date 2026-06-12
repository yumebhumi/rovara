import type { RecommendationCategory } from "@/constants/itinerary";
import type { ActivityCategory } from "./activity";
import type { BudgetBreakdown } from "./budget";
import type { TripSummary } from "./trip";
import type { MediaAsset, Nullable } from "./shared";
import type { WeatherInsight } from "./weather";

/**
 * Raw activity shape expected directly from the AI model before app-level
 * normalization adds ids, nested location objects, and grouped activity lists.
 */
export interface AIActivity {
  title: string;
  description: string;
  location: string;
  estimatedCost: number;
  category: ActivityCategory;
  tags: string[];
  bookingRequired: boolean;
  accessibilityNotes?: string | null;
  aiConfidenceScore?: number | null;
  image?: Nullable<MediaAsset>;
}

/**
 * Compact recommendation shape returned by the model.
 */
export interface AIRecommendation {
  id?: string;
  title: string;
  description: string;
  category?: RecommendationCategory;
  type?: RecommendationCategory;
  relevanceScore?: number;
  localTip?: string | null;
  recommendedTime?: string | null;
  image?: Nullable<MediaAsset>;
}

/**
 * Raw AI itinerary day grouped into morning, afternoon, and evening sections.
 */
export interface AIItineraryDay {
  day: number;
  title: string;
  weatherSummary: string;
  overview?: string | null;
  transportationNotes: string[];
  foodSuggestions: string[];
  hiddenGems: string[];
  morning: AIActivity[];
  afternoon: AIActivity[];
  evening: AIActivity[];
  estimatedDailyCost?: number;
}

/**
 * Strict AI response contract validated before any normalization or frontend
 * delivery happens.
 */
export interface AITripGenerationResponse {
  tripSummary: TripSummary;
  budgetBreakdown: BudgetBreakdown;
  recommendations: AIRecommendation[];
  weatherInsights: WeatherInsight[];
  days: AIItineraryDay[];
}

export type GeneratedTrip = AITripGenerationResponse;
