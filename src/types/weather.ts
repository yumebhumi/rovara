import type { WeatherCondition as CanonicalWeatherCondition } from "@/constants/itinerary";

export type WeatherCondition = CanonicalWeatherCondition | string;
export type {
  Weather,
  WeatherForecastDay,
  WeatherInsight
} from "./itinerary/weather";
