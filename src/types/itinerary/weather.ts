import type { WeatherCondition } from "@/constants/itinerary";
import type { AIAttribution, MetadataRecord } from "./shared";

/**
 * Normalized weather guidance used by AI planning and downstream UI.
 */
export interface WeatherInsight {
  condition: WeatherCondition | string;
  temperature: number;
  humidity?: number | null;
  recommendation: string;
  precipitationChance?: number | null;
  bestTimeToVisit?: string | null;
  metadata?: MetadataRecord;
  attribution?: AIAttribution;
}

export interface Weather {
  city: string;
  tempC: number;
  condition: WeatherCondition | string;
  humidity?: number;
  windSpeed?: number;
  icon?: string;
}

export interface WeatherForecastDay extends Weather {
  date: string;
}

export type WeatherConditionValue = WeatherCondition | string;
