"use client";

import { useCallback, useState } from "react";

function getDeleteTripErrorMessage(
  response: Response,
  payload: { error?: string; deleted?: boolean } | null
) {
  if (payload?.error) {
    return payload.error;
  }

  if (response.status === 401) {
    return "Please sign in to manage saved trips.";
  }

  if (response.status === 404) {
    return "This trip could not be found.";
  }

  return "Unable to delete this trip.";
}

export function useDeleteTrip() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const deleteTrip = useCallback(async (id: string) => {
    setDeletingId(id);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/trips/${id}`, {
        method: "DELETE"
      });
      const payload = (await response.json().catch(() => null)) as
        | { error?: string; deleted?: boolean }
        | null;

      if (!response.ok || !payload?.deleted) {
        throw new Error(getDeleteTripErrorMessage(response, payload));
      }

      setSuccessMessage("Trip deleted successfully.");
      return payload;
    } catch (deleteError) {
      const message =
        deleteError instanceof Error ? deleteError.message : "Unable to delete this trip.";
      setError(message);
      throw deleteError;
    } finally {
      setDeletingId(null);
    }
  }, []);

  return {
    deleteTrip,
    deletingId,
    error,
    successMessage,
    clearError: () => setError(null),
    clearSuccess: () => setSuccessMessage(null)
  };
}
