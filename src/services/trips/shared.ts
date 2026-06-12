import {
  ActivitySection,
  RecommendationType as PrismaRecommendationType
} from "@prisma/client";
import { RecommendationCategory } from "@/constants/itinerary";
import { DEFAULT_CURRENCY, isSupportedCurrency } from "@/lib/currency";
import {
  resolvePagination,
  toPaginatedResult,
  type PaginationInput
} from "@/lib/db-utils";
import { db } from "@/lib/prisma";
import {
  deriveTripStatus,
  toDisplayTripTravelType
} from "@/lib/trips";
import { tripDetailsInclude, type TripRecord } from "@/types/database";
import { ActivityCategory, normalizeActivityCategory } from "@/types/itinerary";
import type {
  Activity,
  BudgetBreakdown,
  ItineraryDay,
  PersistedTrip,
  Recommendation,
  SaveTripRequest,
  WeatherInsight
} from "@/types";
import { requireDatabaseUserId } from "../users";

export { db, resolvePagination, toPaginatedResult, tripDetailsInclude };
export type { PaginationInput };

function toIsoDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function toIsoDateTime(value: Date) {
  return value.toISOString();
}

function mapRecommendationCategory(
  category: PrismaRecommendationType
): Recommendation["category"] {
  switch (category) {
    case PrismaRecommendationType.WEATHER:
      return RecommendationCategory.Weather;
    case PrismaRecommendationType.HIDDEN_GEM:
      return RecommendationCategory.HiddenGem;
    case PrismaRecommendationType.TRANSPORT:
      return RecommendationCategory.Transport;
    case PrismaRecommendationType.FOOD:
      return RecommendationCategory.Food;
    case PrismaRecommendationType.BUDGET:
      return RecommendationCategory.Budget;
    case PrismaRecommendationType.PLANNING:
      return RecommendationCategory.Planning;
    case PrismaRecommendationType.SAFETY:
      return RecommendationCategory.Safety;
    case PrismaRecommendationType.DINING:
      return RecommendationCategory.Dining;
    case PrismaRecommendationType.ACTIVITY:
      return RecommendationCategory.Activity;
    case PrismaRecommendationType.AI:
      return RecommendationCategory.AI;
    default:
      return RecommendationCategory.General;
  }
}

export function mapToPrismaRecommendationCategory(
  category: Recommendation["category"]
): PrismaRecommendationType {
  switch (category) {
    case RecommendationCategory.Weather:
      return PrismaRecommendationType.WEATHER;
    case RecommendationCategory.HiddenGem:
      return PrismaRecommendationType.HIDDEN_GEM;
    case RecommendationCategory.Transport:
      return PrismaRecommendationType.TRANSPORT;
    case RecommendationCategory.Food:
      return PrismaRecommendationType.FOOD;
    case RecommendationCategory.Budget:
      return PrismaRecommendationType.BUDGET;
    case RecommendationCategory.Planning:
      return PrismaRecommendationType.PLANNING;
    case RecommendationCategory.Safety:
      return PrismaRecommendationType.SAFETY;
    case RecommendationCategory.Dining:
      return PrismaRecommendationType.DINING;
    case RecommendationCategory.Activity:
      return PrismaRecommendationType.ACTIVITY;
    case RecommendationCategory.AI:
      return PrismaRecommendationType.AI;
    default:
      return PrismaRecommendationType.GENERAL;
  }
}

function mapToPrismaActivitySection(time?: Activity["time"]) {
  switch (time) {
    case "morning":
      return ActivitySection.MORNING;
    case "afternoon":
      return ActivitySection.AFTERNOON;
    case "evening":
      return ActivitySection.EVENING;
    default:
      return ActivitySection.AFTERNOON;
  }
}

function mapActivitySection(section: ActivitySection): Activity["time"] {
  switch (section) {
    case ActivitySection.MORNING:
      return "morning";
    case ActivitySection.AFTERNOON:
      return "afternoon";
    case ActivitySection.EVENING:
      return "evening";
  }
}

export function serializeTrip(trip: TripRecord): PersistedTrip {
  const itineraryDays = trip.itineraryDays.map<ItineraryDay>((day) => {
    const activities = day.activities.map<Activity>((activity) => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      location: activity.location
        ? {
            name: activity.location,
            lat: activity.latitude ?? undefined,
            lng: activity.longitude ?? undefined
          }
        : null,
      coordinates:
        typeof activity.latitude === "number" && typeof activity.longitude === "number"
          ? { lat: activity.latitude, lng: activity.longitude }
          : null,
      startTime: activity.startTime,
      endTime: activity.endTime,
      estimatedCost: activity.estimatedCost,
      category:
        normalizeActivityCategory(activity.category) ??
        ActivityCategory.ADVENTURE,
      tags: activity.tags,
      image: activity.image
        ? {
            url: activity.image,
            alt: activity.title
          }
        : null,
      bookingRequired: activity.bookingRequired,
      accessibilityNotes: activity.accessibilityNotes,
      aiConfidenceScore: activity.aiConfidenceScore,
      time: mapActivitySection(activity.section),
      locationName: activity.location ?? undefined
    }));

    return {
      id: day.id,
      dayNumber: day.dayNumber,
      day: day.dayNumber,
      title: day.title,
      date: toIsoDate(day.date),
      weatherSummary: day.weatherSummary,
      overview: day.overview,
      morning: activities.filter((activity) => activity.time === "morning"),
      afternoon: activities.filter((activity) => activity.time === "afternoon"),
      evening: activities.filter((activity) => activity.time === "evening"),
      transportationNotes: day.transportationNotes,
      estimatedDailyCost: day.estimatedDailyCost,
      estimatedCost: day.estimatedDailyCost,
      activities
    };
  });

  const recommendations = trip.recommendations.map<Recommendation>((recommendation) => {
    const category = mapRecommendationCategory(recommendation.category);

    return {
      id: recommendation.id,
      title: recommendation.title,
      description: recommendation.description,
      category,
      type: category,
      relevanceScore: recommendation.relevanceScore,
      localTip: recommendation.localTip,
      recommendedTime: recommendation.recommendedTime,
      image: recommendation.image
        ? {
            url: recommendation.image,
            alt: recommendation.title
          }
        : null
    };
  });

  const budgetBreakdown: BudgetBreakdown = trip.budgetBreakdown
    ? {
        accommodation: trip.budgetBreakdown.accommodation,
        food: trip.budgetBreakdown.food,
        transportation: trip.budgetBreakdown.transportation,
        activities: trip.budgetBreakdown.activities,
        shopping: trip.budgetBreakdown.shopping,
        miscellaneous: trip.budgetBreakdown.miscellaneous,
        total: trip.budgetBreakdown.total
      }
    : {
        accommodation: 0,
        food: 0,
        transportation: 0,
        activities: 0,
        shopping: 0,
        miscellaneous: 0,
        total: 0
      };

  const weatherInsights: WeatherInsight[] = itineraryDays
    .filter((day) => day.weatherSummary)
    .slice(0, 3)
    .map((day) => ({
      condition: "Seasonal",
      temperature: 22,
      recommendation:
        day.weatherSummary ?? "Stay flexible around local conditions.",
      precipitationChance: null,
      bestTimeToVisit: day.dayNumber === 1 ? "Morning" : null
    }));

  return {
    id: trip.id,
    userId: trip.userId,
    destination: trip.destination,
    country: trip.country,
    startDate: toIsoDate(trip.startDate),
    endDate: toIsoDate(trip.endDate),
    duration: trip.duration,
    budget: trip.budget,
    currency: isSupportedCurrency(trip.currency) ? trip.currency : DEFAULT_CURRENCY,
    travelVibe: trip.travelVibe,
    coverImage: trip.coverImage
      ? {
          url: trip.coverImage,
          alt: trip.destination
        }
      : null,
    summary: trip.summary,
    itineraryDays,
    recommendations,
    budgetBreakdown,
    weatherInsights,
    createdAt: toIsoDateTime(trip.createdAt),
    updatedAt: toIsoDateTime(trip.updatedAt),
    status: trip.status ? deriveTripStatus(trip.startDate, trip.endDate) : undefined,
    preferences: trip.interests,
    interests: trip.interests,
    travelType: trip.travelType ? toDisplayTripTravelType(trip.travelType) : undefined,
    accommodationPreference: trip.accommodationPreference,
    transportationPreference: trip.transportationPreference,
    itinerary: itineraryDays
  };
}

function sectionActivities(
  day: SaveTripRequest["trip"]["itineraryDays"][number],
  section: "morning" | "afternoon" | "evening"
) {
  return day[section].map((activity) => ({
    section: mapToPrismaActivitySection(activity.time ?? section),
    title: activity.title,
    description: activity.description,
    location: activity.location?.name ?? activity.locationName ?? null,
    latitude:
      activity.coordinates?.lat ??
      (typeof activity.location?.lat === "number" ? activity.location.lat : null),
    longitude:
      activity.coordinates?.lng ??
      (typeof activity.location?.lng === "number" ? activity.location.lng : null),
    estimatedCost: activity.estimatedCost,
    startTime: activity.startTime ?? null,
    endTime: activity.endTime ?? null,
    category: activity.category ?? null,
    image: activity.image?.url ?? null,
    tags: activity.tags,
    bookingRequired: activity.bookingRequired,
    accessibilityNotes: activity.accessibilityNotes ?? null,
    aiConfidenceScore: activity.aiConfidenceScore ?? null
  }));
}

export function buildCreateTripData(
  userId: string,
  request: SaveTripRequest
) {
  const { trip } = request;

  return {
    userId,
    destination: trip.destination,
    country: trip.country ?? null,
    startDate: new Date(trip.startDate),
    endDate: new Date(trip.endDate),
    duration: trip.duration,
    budget: trip.budget,
    currency: trip.currency,
    travelVibe: trip.travelVibe,
    summary: trip.summary ?? null,
    coverImage: trip.coverImage?.url ?? null,
    travelType: null,
    accommodationPreference: null,
    transportationPreference: null,
    interests: [],
    itineraryDays: {
      create: trip.itineraryDays.map((day) => ({
        dayNumber: day.dayNumber,
        title: day.title,
        date: new Date(day.date),
        weatherSummary: day.weatherSummary ?? null,
        overview: day.overview ?? null,
        transportationNotes: day.transportationNotes,
        estimatedDailyCost: day.estimatedDailyCost,
        activities: {
          create: [
            ...sectionActivities(day, "morning"),
            ...sectionActivities(day, "afternoon"),
            ...sectionActivities(day, "evening")
          ]
        }
      }))
    },
    recommendations: {
      create: trip.recommendations.map((recommendation) => ({
        title: recommendation.title,
        description: recommendation.description,
        category: mapToPrismaRecommendationCategory(recommendation.category),
        localTip: recommendation.localTip ?? null,
        recommendedTime: recommendation.recommendedTime ?? null,
        relevanceScore: recommendation.relevanceScore,
        image: recommendation.image?.url ?? null
      }))
    },
    budgetBreakdown: {
      create: {
        accommodation: trip.budgetBreakdown.accommodation,
        food: trip.budgetBreakdown.food,
        transportation: trip.budgetBreakdown.transportation,
        activities: trip.budgetBreakdown.activities,
        shopping: trip.budgetBreakdown.shopping,
        miscellaneous: trip.budgetBreakdown.miscellaneous,
        total: trip.budgetBreakdown.total
      }
    }
  };
}

export async function getOwnedDatabaseUserId(clerkId: string) {
  return requireDatabaseUserId(clerkId);
}

export async function findTripRecordById(id: string, clerkId: string) {
  return db.trip.findFirst({
    where: {
      id,
      user: { clerkId }
    },
    include: tripDetailsInclude
  });
}
