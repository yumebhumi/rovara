import type { Preference } from "@/constants/preferences";

export const LANDING_MIN_BUDGET = 300;
export const LANDING_MAX_BUDGET = 10000;

export const LANDING_TRAVEL_TYPES = ["Solo", "Couple", "Friends", "Family"] as const;

export type LandingTravelType = (typeof LANDING_TRAVEL_TYPES)[number];

const TRAVEL_TYPE_PREFERENCES: Record<LandingTravelType, Preference[]> = {
  Solo: ["Adventure", "Nature"],
  Couple: ["Luxury", "Food"],
  Friends: ["Nightlife", "Food"],
  Family: ["Relaxation", "Nature"]
};

export function isLandingTravelType(value: string | null | undefined): value is LandingTravelType {
  return LANDING_TRAVEL_TYPES.some((travelType) => travelType === value);
}

export function getPreferencesForTravelType(value: string | null | undefined): Preference[] {
  return isLandingTravelType(value) ? TRAVEL_TYPE_PREFERENCES[value] : [];
}

export function parsePlannerBudget(value: string | null | undefined, fallback = 2000) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(LANDING_MAX_BUDGET, Math.max(LANDING_MIN_BUDGET, Math.round(parsed)));
}
