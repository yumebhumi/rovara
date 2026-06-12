import type { TripTravelType as PrismaTripTravelType } from "@prisma/client";
import type { BudgetBreakdown } from "@/types";
import type {
  AccommodationPreference,
  TransportationPreference
} from "@/types/forms";

const PRISMA_TO_DISPLAY_TRAVEL_TYPE: Record<PrismaTripTravelType, string> = {
  SOLO: "Solo",
  COUPLE: "Couple",
  FRIENDS: "Friends",
  FAMILY: "Family",
  LUXURY: "Luxury",
  BACKPACKING: "Backpacking"
};

export function toDisplayTripTravelType(value: PrismaTripTravelType | string | null | undefined) {
  if (!value) return "Solo";
  return PRISMA_TO_DISPLAY_TRAVEL_TYPE[value as PrismaTripTravelType] ?? value;
}

function percentageForAccommodation(value?: string | null) {
  switch (value as AccommodationPreference) {
    case "Luxury Stays":
      return 0.42;
    case "Resorts":
      return 0.38;
    case "Hotels":
      return 0.33;
    case "Airbnb":
      return 0.3;
    case "Hostels":
      return 0.18;
    default:
      return 0.33;
  }
}

function percentageForTransport(value?: string | null) {
  switch (value as TransportationPreference) {
    case "Flights":
      return 0.21;
    case "Rental Cars":
      return 0.19;
    case "Trains":
      return 0.14;
    case "Public Transport":
      return 0.11;
    case "Walking":
      return 0.06;
    default:
      return 0.14;
  }
}

function roundBudget(value: number) {
  return Math.round(value / 10) * 10;
}

export function deriveBudgetBreakdown(
  budget: number,
  accommodationPreference?: string | null,
  transportationPreference?: string | null
): BudgetBreakdown {
  const accommodation = roundBudget(
    budget * percentageForAccommodation(accommodationPreference)
  );
  const transportation = roundBudget(
    budget * percentageForTransport(transportationPreference)
  );
  const food = roundBudget(budget * 0.22);
  const activities = Math.max(0, budget - accommodation - transportation - food);

  return {
    accommodation,
    food,
    transportation,
    activities,
    shopping: 0,
    miscellaneous: 0,
    total: accommodation + transportation + food + activities
  };
}

export function deriveTripStatus(startDate: string | Date, endDate: string | Date) {
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) return "planning" as const;
  if (start > now) return "upcoming" as const;
  if (end < now) return "completed" as const;
  return "planning" as const;
}
