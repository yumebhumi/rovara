import { z } from "zod";
import {
  ActivityCategory,
  RecommendationCategory,
  TransportationType,
  TravelVibe,
  WeatherCondition
} from "@/constants/itinerary";
import {
  isSupportedCurrency,
  type SupportedCurrency
} from "@/lib/currency";
import { normalizeActivityCategory } from "@/types/itinerary";
import {
  ACCOMMODATION_PREFERENCES,
  TRANSPORTATION_PREFERENCES,
  TRIP_GENERATION_INTERESTS,
  TRIP_GENERATION_TRAVEL_TYPES
} from "@/types/forms";

const supportedCurrencySchema = z.custom<SupportedCurrency>(
  (value) => typeof value === "string" && isSupportedCurrency(value),
  "Unsupported currency."
);

const isoDateSchema = z.string().trim().min(1);
const isoDateTimeSchema = z.string().trim().min(1);
const activityTimeSchema = z.enum(["morning", "afternoon", "evening"]);
const activityCategorySchema = z
  .string()
  .trim()
  .transform((value, ctx) => {
    const normalized = normalizeActivityCategory(value);

    if (!normalized) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid activity category."
      });
      return z.NEVER;
    }

    return normalized;
  });

export const coordinatesSchema = z.object({
  lat: z.number().finite(),
  lng: z.number().finite()
});

export const mediaAssetSchema = z.object({
  url: z.string().url(),
  alt: z.string().trim().min(1).max(240).nullable().optional(),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  blurDataUrl: z.string().trim().nullable().optional(),
  attribution: z.string().trim().nullable().optional()
});

export const activityLocationSchema = z.object({
  name: z.string().trim().min(1).max(160),
  address: z.string().trim().max(240).nullable().optional(),
  city: z.string().trim().max(120).nullable().optional(),
  country: z.string().trim().max(120).nullable().optional(),
  placeId: z.string().trim().max(180).nullable().optional(),
  timezone: z.string().trim().max(80).nullable().optional(),
  lat: z.number().finite().optional(),
  lng: z.number().finite().optional()
});

/**
 * Runtime-safe activity schema used by AI parsing, persistence hydration, and
 * frontend rendering.
 */
export const ActivitySchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(500),
  location: activityLocationSchema.nullable().optional(),
  coordinates: coordinatesSchema.nullable().optional(),
  startTime: z.string().trim().max(80).nullable().optional(),
  endTime: z.string().trim().max(80).nullable().optional(),
  estimatedCost: z.number().min(0).max(100000),
  category: activityCategorySchema,
  tags: z.array(z.string().trim().min(1).max(50)).default([]),
  image: mediaAssetSchema.nullable().optional(),
  bookingRequired: z.boolean().default(false),
  accessibilityNotes: z.string().trim().max(240).nullable().optional(),
  aiConfidenceScore: z.number().min(0).max(1).nullable().optional(),
  transportationType: z.nativeEnum(TransportationType).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  time: activityTimeSchema.optional(),
  duration: z.number().int().positive().optional(),
  locationName: z.string().trim().max(160).optional()
});
export const activitySchema = ActivitySchema;

export const weatherInsightSchema = z.object({
  condition: z.union([z.nativeEnum(WeatherCondition), z.string().trim().min(1).max(80)]),
  temperature: z.number().min(-100).max(100),
  humidity: z.number().min(0).max(100).nullable().optional(),
  recommendation: z.string().trim().min(1).max(280),
  precipitationChance: z.number().min(0).max(100).nullable().optional(),
  bestTimeToVisit: z.string().trim().max(120).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  attribution: z
    .object({
      provider: z.string().trim().max(120).nullable().optional(),
      model: z.string().trim().max(120).nullable().optional(),
      promptVersion: z.string().trim().max(120).nullable().optional(),
      generatedAt: isoDateTimeSchema.nullable().optional(),
      confidenceScore: z.number().min(0).max(1).nullable().optional()
    })
    .optional()
});

/**
 * Recommendation entities stay intentionally small so AI output can be safely
 * rendered in cards, sidebars, and future personalization surfaces.
 */
export const RecommendationSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(320),
  category: z.nativeEnum(RecommendationCategory),
  relevanceScore: z.number().min(0).max(1),
  localTip: z.string().trim().max(240).nullable().optional(),
  recommendedTime: z.string().trim().max(120).nullable().optional(),
  image: mediaAssetSchema.nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  type: z.nativeEnum(RecommendationCategory).optional()
});
export const recommendationSchema = RecommendationSchema;

/**
 * Budget validation remains numeric-only and sum-checked before any AI payload
 * can reach the frontend.
 */
export const BudgetBreakdownSchema = z
  .object({
    accommodation: z.number().min(0).max(1_000_000),
    food: z.number().min(0).max(1_000_000),
    transportation: z.number().min(0).max(1_000_000),
    activities: z.number().min(0).max(1_000_000),
    shopping: z.number().min(0).max(1_000_000).default(0),
    miscellaneous: z.number().min(0).max(1_000_000).default(0),
    total: z.number().min(0).max(1_000_000)
  })
  .superRefine((value, ctx) => {
    const calculatedTotal =
      value.accommodation +
      value.food +
      value.transportation +
      value.activities +
      value.shopping +
      value.miscellaneous;

    if (Math.abs(calculatedTotal - value.total) > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["total"],
        message: "Budget breakdown total does not match the category sum."
      });
    }
  });
export const budgetBreakdownSchema = BudgetBreakdownSchema;

/**
 * Canonical per-day itinerary validation with nested activity arrays for every
 * day section.
 */
export const ItineraryDaySchema = z.object({
  id: z.string().trim().min(1),
  dayNumber: z.number().int().positive(),
  title: z.string().trim().min(1).max(120),
  date: isoDateSchema,
  weatherSummary: z.string().trim().max(240).nullable().optional(),
  overview: z.string().trim().max(400).nullable().optional(),
  morning: z.array(activitySchema),
  afternoon: z.array(activitySchema),
  evening: z.array(activitySchema),
  transportationNotes: z.array(z.string().trim().min(1).max(180)).default([]),
  estimatedDailyCost: z.number().min(0).max(1_000_000),
  activities: z.array(activitySchema),
  metadata: z.record(z.string(), z.unknown()).optional(),
  day: z.number().int().positive(),
  estimatedCost: z.number().min(0).max(1_000_000),
  foodSuggestions: z.array(z.string().trim().min(1).max(180)).optional(),
  hiddenGems: z.array(z.string().trim().min(1).max(180)).optional()
});
export const itineraryDaySchema = ItineraryDaySchema;

export const tripSummarySchema = z.object({
  destination: z.string().trim().min(1).max(160),
  country: z.string().trim().max(120).nullable().optional(),
  duration: z.string().trim().min(1).max(60),
  travelVibe: z.string().trim().min(1).max(120),
  summary: z.string().trim().min(1).max(500),
  coverImage: mediaAssetSchema.nullable().optional()
});
export const TripSummarySchema = tripSummarySchema;

export const tripSchema = z.object({
  id: z.string().trim().min(1),
  userId: z.string().trim().min(1),
  destination: z.string().trim().min(1).max(160),
  country: z.string().trim().max(120).nullable().optional(),
  startDate: isoDateSchema,
  endDate: isoDateSchema,
  duration: z.number().int().positive(),
  budget: z.number().min(0).max(1_000_000),
  currency: supportedCurrencySchema,
  travelVibe: z.string().trim().min(1).max(120),
  coverImage: mediaAssetSchema.nullable().optional(),
  summary: z.string().trim().max(500).nullable().optional(),
  itineraryDays: z.array(itineraryDaySchema),
  recommendations: z.array(recommendationSchema),
  budgetBreakdown: budgetBreakdownSchema,
  weatherInsights: z.array(weatherInsightSchema),
  travelVibes: z.array(z.nativeEnum(TravelVibe)).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  ai: z
    .object({
      provider: z.string().trim().max(120).nullable().optional(),
      model: z.string().trim().max(120).nullable().optional(),
      promptVersion: z.string().trim().max(120).nullable().optional(),
      generatedAt: isoDateTimeSchema.nullable().optional(),
      confidenceScore: z.number().min(0).max(1).nullable().optional()
    })
    .optional(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema
});

export const persistedTripSchema = tripSchema.extend({
  status: z.string().trim().max(40).optional(),
  preferences: z.array(z.string().trim().min(1)).default([]),
  interests: z.array(z.string().trim().min(1)).optional(),
  travelType: z.string().trim().max(80).optional(),
  accommodationPreference: z.string().trim().max(120).nullable().optional(),
  transportationPreference: z.string().trim().max(120).nullable().optional(),
  generatedItinerary: z.unknown().optional(),
  weatherData: z.unknown().optional(),
  mapLocations: z.unknown().optional(),
  shareToken: z.string().trim().nullable().optional()
});

export const publicPersistedTripSchema = persistedTripSchema.omit({
  userId: true,
  generatedItinerary: true,
  weatherData: true,
  mapLocations: true,
  shareToken: true
});

/**
 * Full frontend-facing itinerary payload returned after AI validation and app
 * normalization.
 */
export const fullItineraryResponseSchema = z.object({
  trip: tripSchema,
  tripSummary: tripSummarySchema,
  budgetBreakdown: budgetBreakdownSchema,
  recommendations: z.array(recommendationSchema),
  weatherInsights: z.array(weatherInsightSchema),
  days: z.array(itineraryDaySchema)
});
export const FullItineraryResponseSchema = fullItineraryResponseSchema;

const aiActivitySchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(320),
  location: z.string().trim().min(1).max(160),
  estimatedCost: z.number().min(0).max(100000),
  category: activityCategorySchema,
  tags: z.array(z.string().trim().min(1).max(50)).default([]),
  bookingRequired: z.boolean().default(false),
  accessibilityNotes: z.string().trim().max(240).nullable().optional(),
  aiConfidenceScore: z.number().min(0).max(1).nullable().optional(),
  image: mediaAssetSchema.nullable().optional()
});

export const aiItineraryDaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().trim().min(1).max(120),
  weatherSummary: z.string().trim().min(1).max(240),
  overview: z.string().trim().max(400).nullable().optional(),
  transportationNotes: z.array(z.string().trim().min(1).max(180)).default([]),
  foodSuggestions: z.array(z.string().trim().min(1).max(180)).default([]),
  hiddenGems: z.array(z.string().trim().min(1).max(180)).default([]),
  morning: z.array(aiActivitySchema).min(1),
  afternoon: z.array(aiActivitySchema).min(1),
  evening: z.array(aiActivitySchema).min(1),
  estimatedDailyCost: z.number().min(0).max(1_000_000).optional()
});

export const aiRecommendationSchema = z.object({
  id: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(320),
  category: z.nativeEnum(RecommendationCategory).optional(),
  type: z.nativeEnum(RecommendationCategory).optional(),
  relevanceScore: z.number().min(0).max(1).optional(),
  localTip: z.string().trim().max(240).nullable().optional(),
  recommendedTime: z.string().trim().max(120).nullable().optional(),
  image: mediaAssetSchema.nullable().optional()
});

/**
 * Strict raw AI response contract. Every model response is safe-parsed against
 * this schema before app-level normalization.
 */
export const AITripGenerationResponseSchema = z.object({
  tripSummary: tripSummarySchema,
  budgetBreakdown: BudgetBreakdownSchema,
  recommendations: z.array(aiRecommendationSchema).min(3).max(5),
  weatherInsights: z.array(weatherInsightSchema).default([]),
  days: z.array(aiItineraryDaySchema).min(2).max(3)
});
export const aiTripGenerationResponseSchema = AITripGenerationResponseSchema;
export const GeneratedTripSchema = AITripGenerationResponseSchema;
export const TripSchema = AITripGenerationResponseSchema;

export const generateTripRequestSchema = z
  .object({
    destination: z.string().trim().min(2).max(160),
    country: z.string().trim().max(120).nullable().optional(),
    budget: z.number().min(0).max(1_000_000),
    travelVibe: z.string().trim().min(1).max(120).optional(),
    travelVibes: z.array(z.nativeEnum(TravelVibe)).optional(),
    travelType: z.enum(TRIP_GENERATION_TRAVEL_TYPES),
    interests: z.array(z.enum(TRIP_GENERATION_INTERESTS)).default([]),
    accommodationPreference: z.enum(ACCOMMODATION_PREFERENCES),
    transportationPreference: z.enum(TRANSPORTATION_PREFERENCES),
    startDate: isoDateSchema,
    endDate: isoDateSchema,
    currency: supportedCurrencySchema,
    locale: z.string().trim().max(40).optional()
  })
  .superRefine((value, ctx) => {
    const start = new Date(value.startDate);
    const end = new Date(value.endDate);

    if (Number.isNaN(start.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: "Invalid start date."
      });
    }

    if (Number.isNaN(end.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "Invalid end date."
      });
    }

    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be on or after the start date."
      });
    }
  });

export const generateTripResponseSchema = z.object({
  id: z.string().trim().min(1),
  trip: tripSchema,
  itinerary: fullItineraryResponseSchema,
  days: z.array(itineraryDaySchema),
  storage: z.enum(["database", "draft"]),
  fallback: z.boolean().optional(),
  fallbackReason: z.string().trim().max(240).optional(),
  request: z
    .object({
      destination: z.string().trim().min(1).max(160),
      country: z.string().trim().max(120).nullable().optional(),
      startDate: isoDateSchema,
      endDate: isoDateSchema,
      budget: z.number().min(0).max(1_000_000),
      travelVibe: z.string().trim().min(1).max(120),
      currency: supportedCurrencySchema,
      travelVibes: z.array(z.nativeEnum(TravelVibe)).optional()
    })
    .optional()
});

export const saveTripRequestSchema = z.object({
  trip: tripSchema,
  source: z.enum(["ai", "manual", "imported"]).optional()
});

export const saveTripResponseSchema = z.object({
  trip: publicPersistedTripSchema,
  saved: z.boolean()
});

export const savedTripListItemSchema = z.object({
  id: z.string().trim().min(1),
  destination: z.string().trim().min(1).max(160),
  country: z.string().trim().max(120).nullable().optional(),
  startDate: isoDateSchema,
  endDate: isoDateSchema,
  budget: z.number().min(0).max(1_000_000),
  currency: supportedCurrencySchema,
  travelVibe: z.string().trim().min(1).max(120),
  summary: z.string().trim().max(500).nullable().optional(),
  coverImage: z.string().trim().nullable().optional(),
  createdAt: isoDateTimeSchema
});

export const getTripsResponseSchema = z.object({
  trips: z.array(savedTripListItemSchema),
  total: z.number().int().nonnegative()
});
