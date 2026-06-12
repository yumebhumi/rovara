/**
 * Canonical runtime enums and lists for itinerary generation, persistence,
 * validation, and rendering.
 */
export {
  ActivityCategory,
  ACTIVITY_CATEGORY_VALUES,
  TransportationType,
  TRANSPORTATION_TYPE_VALUES
} from "@/types/itinerary/activity";

export enum TravelVibe {
  Relaxed = "Relaxed",
  Adventure = "Adventure",
  Luxury = "Luxury",
  Cultural = "Cultural",
  Nature = "Nature",
  FoodAndCafes = "Food & Cafes"
}

export enum WeatherCondition {
  Clear = "Clear",
  Clouds = "Clouds",
  Rain = "Rain",
  Snow = "Snow",
  Thunderstorm = "Thunderstorm",
  Drizzle = "Drizzle",
  Mist = "Mist",
  Haze = "Haze",
  Fog = "Fog",
  Windy = "Windy",
  Unknown = "Unknown"
}

export enum BudgetTier {
  Budget = "budget",
  MidRange = "mid-range",
  Premium = "premium",
  Luxury = "luxury"
}

export enum RecommendationCategory {
  Weather = "weather",
  HiddenGem = "hidden-gem",
  Transport = "transport",
  Food = "food",
  Budget = "budget",
  Planning = "planning",
  Safety = "safety",
  Dining = "dining",
  Activity = "activity",
  General = "general",
  AI = "ai"
}

export const TRAVEL_VIBE_VALUES = [
  TravelVibe.Relaxed,
  TravelVibe.Adventure,
  TravelVibe.Luxury,
  TravelVibe.Cultural,
  TravelVibe.Nature,
  TravelVibe.FoodAndCafes
] as const;

export const WEATHER_CONDITION_VALUES = [
  WeatherCondition.Clear,
  WeatherCondition.Clouds,
  WeatherCondition.Rain,
  WeatherCondition.Snow,
  WeatherCondition.Thunderstorm,
  WeatherCondition.Drizzle,
  WeatherCondition.Mist,
  WeatherCondition.Haze,
  WeatherCondition.Fog,
  WeatherCondition.Windy,
  WeatherCondition.Unknown
] as const;

export const BUDGET_TIER_VALUES = [
  BudgetTier.Budget,
  BudgetTier.MidRange,
  BudgetTier.Premium,
  BudgetTier.Luxury
] as const;

export const RECOMMENDATION_CATEGORY_VALUES = [
  RecommendationCategory.Weather,
  RecommendationCategory.HiddenGem,
  RecommendationCategory.Transport,
  RecommendationCategory.Food,
  RecommendationCategory.Budget,
  RecommendationCategory.Planning,
  RecommendationCategory.Safety,
  RecommendationCategory.Dining,
  RecommendationCategory.Activity,
  RecommendationCategory.General,
  RecommendationCategory.AI
] as const;

export const BUDGET_TIER_THRESHOLDS: Record<
  BudgetTier,
  { min: number; max?: number }
> = {
  [BudgetTier.Budget]: { min: 0, max: 1500 },
  [BudgetTier.MidRange]: { min: 1501, max: 4000 },
  [BudgetTier.Premium]: { min: 4001, max: 9000 },
  [BudgetTier.Luxury]: { min: 9001 }
};
