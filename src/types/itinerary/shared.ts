import type { SupportedCurrency } from "@/lib/currency";

export type EntityId = string;
export type IsoDateString = string;
export type IsoDateTimeString = string;
export type LocaleCode = string;
export type CurrencyCode = SupportedCurrency;

export type Primitive = string | number | boolean | null;
export type JsonValue = Primitive | JsonValue[] | { [key: string]: JsonValue };
export type MetadataRecord = Record<string, unknown>;
export type Nullable<T> = T | null;

/**
 * Shared geospatial point used by itinerary activities and map integrations.
 */
export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Reusable media descriptor for trip and recommendation imagery.
 */
export interface MediaAsset {
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  blurDataUrl?: string | null;
  attribution?: string | null;
}

/**
 * Minimal audit contract for entities that are persisted or versioned.
 */
export interface AuditFields {
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
}

/**
 * Generation metadata allows the AI pipeline to evolve without reshaping core
 * trip entities.
 */
export interface AIAttribution {
  provider?: string | null;
  model?: string | null;
  promptVersion?: string | null;
  generatedAt?: IsoDateTimeString | null;
  confidenceScore?: number | null;
}
