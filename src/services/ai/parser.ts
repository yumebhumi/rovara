import { z } from "zod";
import {
  ActivityCategory,
  RecommendationCategory
} from "@/constants/itinerary";
import {
  DEFAULT_CURRENCY,
  isSupportedCurrency,
  type SupportedCurrency
} from "@/lib/currency";
import {
  formatTripVibeSelection,
  getPreferencesForTripVibes,
  isTripVibe,
  normalizeTripVibes,
  TRIP_VIBES,
  type TripVibe
} from "@/lib/trip-vibes";
import {
  tripGenerationBudgetMax,
  tripGenerationBudgetMin
} from "@/lib/validations/trip-schema";
import {
  AITripGenerationResponseSchema
} from "@/lib/validations/itinerary-schema";
import type {
  Activity,
  AITripGenerationResponse,
  FullItineraryResponse,
  GenerateItineraryInput,
  ItineraryDay,
  Recommendation,
  Trip,
  TripRequest,
  WeatherInsight
} from "@/types";
import { parseItinerary as parseRawItinerary } from "./parse-itinerary";

const travelDateMessage = "Select valid travel dates.";

const supportedCurrencySchema = z.custom<SupportedCurrency>(
  (value) => typeof value === "string" && isSupportedCurrency(value),
  "Unsupported currency."
);

const tripDateSchema = z.string().trim().min(1, travelDateMessage);
const tripVibeSchema = z.enum(TRIP_VIBES);

export const tripRequestSchema = z
  .object({
    destination: z.string().trim().min(2, "Please enter a destination."),
    startDate: tripDateSchema,
    endDate: tripDateSchema,
    budget: z.coerce
      .number({
        invalid_type_error: "Set a valid budget."
      })
      .min(
        tripGenerationBudgetMin,
        "Enter a starting budget so Rovara can shape a realistic trip."
      )
      .max(tripGenerationBudgetMax, "Set a realistic total budget."),
    travelVibe: z.string().trim().min(1).max(80).optional(),
    vibes: z.array(tripVibeSchema).optional(),
    currency: supportedCurrencySchema.optional()
  })
  .superRefine((values, ctx) => {
    const start = new Date(values.startDate);
    const end = new Date(values.endDate);
    const hasSelectedVibe = Boolean(values.travelVibe || values.vibes?.length);

    if (Number.isNaN(start.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: travelDateMessage
      });
    }

    if (Number.isNaN(end.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: travelDateMessage
      });
    }

    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "Return date must be on or after departure."
      });
    }

    if (!hasSelectedVibe) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["travelVibe"],
        message: "Choose a travel vibe."
      });
    }
  })
  .transform((values) => {
    const selectedVibes = values.vibes?.length
      ? normalizeTripVibes(values.vibes)
      : values.travelVibe && isTripVibe(values.travelVibe)
        ? [values.travelVibe]
        : normalizeTripVibes([]);

    return {
      destination: values.destination,
      startDate: values.startDate,
      endDate: values.endDate,
      budget: values.budget,
      currency: values.currency ?? DEFAULT_CURRENCY,
      travelVibe: values.travelVibe ?? formatTripVibeSelection(selectedVibes),
      travelVibes: selectedVibes
    };
  });

export const itineraryResponseSchema = AITripGenerationResponseSchema;

type ParsedTripRequest = z.infer<typeof tripRequestSchema>;
type ParsedItineraryResponse = AITripGenerationResponse;

export type NormalizedTripRequest = ParsedTripRequest;

function calculateDurationDays(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 1;
  }

  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1);
}

function formatDurationLabel(days: number) {
  return `${days} ${days === 1 ? "day" : "days"}`;
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function normalizeActivityTime(
  time: "morning" | "afternoon" | "evening",
  activities: ParsedItineraryResponse["days"][number]["morning"],
  dayNumber: number
) {
  return activities.map<Activity>((activity, index) => ({
    id: `activity_${dayNumber}_${time}_${index + 1}`,
    time,
    title: activity.title,
    description: activity.description,
    estimatedCost: activity.estimatedCost,
    location: {
      name: activity.location
    },
    locationName: activity.location,
    category: activity.category,
    tags: activity.tags,
    image: activity.image ?? null,
    bookingRequired: activity.bookingRequired,
    accessibilityNotes: activity.accessibilityNotes ?? null,
    aiConfidenceScore: activity.aiConfidenceScore ?? null
  }));
}

function normalizeRecommendation(
  recommendation: ParsedItineraryResponse["recommendations"][number],
  index: number
): Recommendation {
  const category =
    recommendation.category ??
    recommendation.type ??
    RecommendationCategory.General;

  return {
    id: recommendation.id ?? `recommendation_${index + 1}`,
    title: recommendation.title,
    description: recommendation.description,
    category,
    type: category,
    relevanceScore: recommendation.relevanceScore ?? Math.max(0.4, 1 - index * 0.1),
    localTip: recommendation.localTip ?? null,
    recommendedTime: recommendation.recommendedTime ?? null,
    image: recommendation.image ?? null
  };
}

function buildWeatherInsights(
  response: ParsedItineraryResponse,
  days: ItineraryDay[]
): WeatherInsight[] {
  if (response.weatherInsights.length > 0) {
    return response.weatherInsights;
  }

  return days
    .filter((day) => day.weatherSummary)
    .slice(0, 3)
    .map((day, index) => ({
      condition: index === 0 ? "Clear" : "Seasonal",
      temperature: 22,
      humidity: null,
      recommendation:
        day.weatherSummary ??
        "Keep the route flexible enough to respond to changing conditions.",
      precipitationChance: null,
      bestTimeToVisit: day.dayNumber === 1 ? "Morning" : "Early evening"
    }));
}

function normalizeItineraryResponse(
  response: ParsedItineraryResponse,
  request: NormalizedTripRequest
): FullItineraryResponse {
  const durationDays = calculateDurationDays(request.startDate, request.endDate);
  const startDate = new Date(`${request.startDate}T00:00:00.000Z`);

  const days = response.days.slice(0, durationDays).map<ItineraryDay>((day, index) => {
    const dayNumber = index + 1;
    const morning = normalizeActivityTime("morning", day.morning, dayNumber);
    const afternoon = normalizeActivityTime("afternoon", day.afternoon, dayNumber);
    const evening = normalizeActivityTime("evening", day.evening, dayNumber);
    const activities = [...morning, ...afternoon, ...evening];
    const estimatedDailyCost =
      day.estimatedDailyCost ??
      activities.reduce((total, activity) => total + activity.estimatedCost, 0);

    return {
      id: `day_${dayNumber}`,
      dayNumber,
      day: dayNumber,
      title: day.title,
      date: toIsoDate(addDays(startDate, index)),
      weatherSummary: day.weatherSummary,
      overview: day.overview ?? null,
      morning,
      afternoon,
      evening,
      transportationNotes: day.transportationNotes,
      estimatedDailyCost,
      estimatedCost: estimatedDailyCost,
      activities,
      foodSuggestions: day.foodSuggestions,
      hiddenGems: day.hiddenGems
    };
  });

  const accommodation = Math.max(0, Math.round(response.budgetBreakdown.accommodation));
  const food = Math.max(0, Math.round(response.budgetBreakdown.food));
  const transportation = Math.max(0, Math.round(response.budgetBreakdown.transportation));
  const activities = Math.max(0, Math.round(response.budgetBreakdown.activities));
  const shopping = Math.max(0, Math.round(response.budgetBreakdown.shopping ?? 0));
  const miscellaneous = Math.max(
    0,
    Math.round(response.budgetBreakdown.miscellaneous ?? 0)
  );
  const total =
    response.budgetBreakdown.total ??
    accommodation + food + transportation + activities + shopping + miscellaneous;

  const budgetBreakdown = {
    accommodation,
    food,
    transportation,
    activities,
    shopping,
    miscellaneous,
    total
  };

  const recommendations = response.recommendations.map(normalizeRecommendation);
  const weatherInsights = buildWeatherInsights(response, days);
  const summary = response.tripSummary.summary;
  const now = new Date().toISOString();

  const trip: Trip = {
    id: `trip_${crypto.randomUUID()}`,
    userId: "draft",
    destination: request.destination,
    country: response.tripSummary.country ?? null,
    startDate: request.startDate,
    endDate: request.endDate,
    duration: durationDays,
    budget: request.budget,
    currency: request.currency,
    travelVibe: request.travelVibe,
    travelVibes: request.travelVibes as TripVibe[],
    coverImage: response.tripSummary.coverImage ?? null,
    summary,
    itineraryDays: days,
    recommendations,
    budgetBreakdown,
    weatherInsights,
    preferences: [],
    createdAt: now,
    updatedAt: now
  };

  return {
    trip,
    tripSummary: {
      destination: request.destination,
      country: response.tripSummary.country ?? null,
      duration: formatDurationLabel(durationDays),
      travelVibe: request.travelVibe,
      summary,
      coverImage: response.tripSummary.coverImage ?? null
    },
    budgetBreakdown,
    recommendations,
    weatherInsights,
    days
  };
}

export function parseTripRequest(input: unknown): NormalizedTripRequest {
  return tripRequestSchema.parse(input);
}

export function buildItineraryGenerationInput(
  request: NormalizedTripRequest
): GenerateItineraryInput {
  const preferences = getPreferencesForTripVibes(request.travelVibes as TripVibe[]);

  return {
    destination: request.destination,
    startDate: request.startDate,
    endDate: request.endDate,
    budget: request.budget,
    currency: request.currency,
    travelVibe: request.travelVibe,
    travelVibes: request.travelVibes as TripVibe[],
    travelType: preferences.travelType,
    interests: preferences.interests,
    accommodationPreference: preferences.accommodationPreference,
    transportationPreference: preferences.transportationPreference
  };
}

export function buildTripRequestFromGenerateInput(
  input: GenerateItineraryInput
): NormalizedTripRequest {
  const selectedVibes = normalizeTripVibes([
    input.travelType === "Luxury"
      ? "Luxury"
      : input.interests.includes("Food")
        ? "Food & Cafes"
        : input.interests.includes("Culture")
          ? "Cultural"
          : input.interests.includes("Adventure")
            ? "Adventure"
            : input.interests.includes("Nature")
              ? "Nature"
              : "Relaxed"
  ]);

  return {
    destination: input.destination,
    startDate: input.startDate,
    endDate: input.endDate,
    budget: input.budget,
    currency: input.currency,
    travelVibe: input.travelVibe ?? formatTripVibeSelection(selectedVibes),
    travelVibes: input.travelVibes?.length
      ? normalizeTripVibes(input.travelVibes)
      : selectedVibes
  };
}

export function parseItineraryResponse(
  raw: unknown,
  request: NormalizedTripRequest
): FullItineraryResponse {
  return normalizeItineraryResponse(parseRawItinerary(raw), request);
}

export function toTripRequest(request: NormalizedTripRequest): TripRequest {
  return {
    destination: request.destination,
    startDate: request.startDate,
    endDate: request.endDate,
    budget: request.budget,
    travelVibe: request.travelVibe,
    currency: request.currency,
    travelVibes: request.travelVibes as TripVibe[]
  };
}

export const DEFAULT_ACTIVITY_CATEGORY = ActivityCategory.CULTURE;
