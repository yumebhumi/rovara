import type { BudgetTier } from "@/constants/itinerary";
import type { MetadataRecord } from "./shared";

/**
 * Canonical budget shape for persistence, analytics, and rendering.
 */
export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  transportation: number;
  activities: number;
  shopping: number;
  miscellaneous: number;
  total: number;
}

export interface BudgetSnapshot {
  tier?: BudgetTier;
  breakdown: BudgetBreakdown;
  metadata?: MetadataRecord;
}

export type StructuredBudgetBreakdown = BudgetBreakdown;
