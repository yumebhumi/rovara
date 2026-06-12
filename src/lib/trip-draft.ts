import type { FullItineraryResponse, TripRequest } from "@/types";

export const TRIP_DRAFT_STORAGE_KEY = "rovara-trip-draft";

export type TripDraftRecord = {
  id: string;
  itinerary: FullItineraryResponse;
  request: TripRequest;
  generatedAt: string;
};

export function saveTripDraft(record: TripDraftRecord) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    `${TRIP_DRAFT_STORAGE_KEY}:${record.id}`,
    JSON.stringify(record)
  );
}

export function loadTripDraft(id: string) {
  if (typeof window === "undefined") return null;

  const raw = window.sessionStorage.getItem(`${TRIP_DRAFT_STORAGE_KEY}:${id}`);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as TripDraftRecord;
  } catch {
    return null;
  }
}

export function deleteTripDraft(id: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(`${TRIP_DRAFT_STORAGE_KEY}:${id}`);
}
