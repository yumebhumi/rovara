"use client";

import { useCallback, useState } from "react";
import type { SaveTripRequest } from "@/types";
import {
  saveTripRequestSchema,
  saveTripResponseSchema
} from "@/lib/validations/itinerary-schema";

function getSaveTripErrorMessage(
  response: Response,
  payload: { error?: string } | unknown
) {
  if (payload && typeof payload === "object" && payload !== null && "error" in payload) {
    const message = payload.error;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (response.status === 401) {
    return "Please sign in to save trips.";
  }

  if (response.status === 400) {
    return "The itinerary is incomplete and could not be saved.";
  }

  return "Unable to save this trip.";
}

export function useSaveTrip() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const saveTrip = useCallback(async (input: SaveTripRequest) => {
    if (isSaving) {
      throw new Error("Trip save already in progress.");
    }

    const payload = saveTripRequestSchema.parse(input);

    setIsSaving(true);
    setError(null);
    setIsSaved(false);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const rawPayload = (await response.json().catch(() => null)) as
        | { error?: string }
        | unknown;

      if (!response.ok) {
        throw new Error(getSaveTripErrorMessage(response, rawPayload));
      }

      const parsed = saveTripResponseSchema.parse(rawPayload);
      setIsSaved(true);
      setSuccessMessage("Trip saved successfully.");

      return parsed;
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Unable to save this trip.";
      setError(message);
      setIsSaved(false);
      setSuccessMessage(null);
      throw saveError;
    } finally {
      setIsSaving(false);
    }
  }, [isSaving]);

  return {
    saveTrip,
    isSaving,
    isSaved,
    error,
    successMessage,
    clearError: () => setError(null),
    clearSuccess: () => {
      setIsSaved(false);
      setSuccessMessage(null);
    }
  };
}
