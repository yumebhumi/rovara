import type { Activity } from "./activity";
import type { MetadataRecord, IsoDateString } from "./shared";

/**
 * Canonical per-day itinerary aggregate. The grouped arrays are the source of
 * truth; `activities` is retained as a rendering convenience.
 */
export interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  date: IsoDateString;
  weatherSummary?: string | null;
  overview?: string | null;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
  transportationNotes: string[];
  estimatedDailyCost: number;
  activities: Activity[];
  metadata?: MetadataRecord;
  /**
   * Compatibility aliases for existing UI and persistence helpers.
   */
  day: number;
  estimatedCost: number;
  foodSuggestions?: string[];
  hiddenGems?: string[];
}
