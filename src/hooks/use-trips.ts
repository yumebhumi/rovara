"use client";

import { useCallback, useEffect, useReducer } from "react";
import type { SavedTripListItem } from "@/types";
import { getTripsResponseSchema } from "@/lib/validations/itinerary-schema";

type TripsState = {
  trips: SavedTripListItem[];
  loading: boolean;
  error: string | null;
};

type TripsAction =
  | { type: "load:start" }
  | { type: "load:success"; trips: SavedTripListItem[] }
  | { type: "load:error"; error: string }
  | { type: "trip:remove"; id: string }
  | { type: "trip:prepend"; trip: SavedTripListItem };

const initialState: TripsState = {
  trips: [],
  loading: true,
  error: null
};

function getTripsErrorMessage(payload: { error?: string } | unknown) {
  if (payload && typeof payload === "object" && payload !== null && "error" in payload) {
    const message = payload.error;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return "Unable to load saved trips.";
}

function tripsReducer(state: TripsState, action: TripsAction): TripsState {
  switch (action.type) {
    case "load:start":
      return {
        ...state,
        loading: true,
        error: null
      };
    case "load:success":
      return {
        trips: action.trips,
        loading: false,
        error: null
      };
    case "load:error":
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case "trip:remove":
      return {
        ...state,
        trips: state.trips.filter((trip) => trip.id !== action.id)
      };
    case "trip:prepend":
      return {
        ...state,
        trips: [action.trip, ...state.trips]
      };
    default:
      return state;
  }
}

export function useTrips() {
  const [state, dispatch] = useReducer(tripsReducer, initialState);

  const fetchTrips = useCallback(async (options?: { showLoading?: boolean }) => {
    if (options?.showLoading ?? true) {
      dispatch({ type: "load:start" });
    }

    try {
      const res = await fetch("/api/trips?pageSize=100", {
        cache: "no-store"
      });
      const payload = (await res.json().catch(() => null)) as
        | { error?: string }
        | unknown;

      if (!res.ok) {
        throw new Error(getTripsErrorMessage(payload));
      }

      const parsed = getTripsResponseSchema.parse(payload);
      dispatch({ type: "load:success", trips: parsed.trips });
    } catch (fetchError) {
      dispatch({
        type: "load:error",
        error:
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load saved trips."
      });
    }
  }, []);

  useEffect(() => {
    void fetchTrips({ showLoading: false });
  }, [fetchTrips]);

  const removeTrip = useCallback((id: string) => {
    dispatch({ type: "trip:remove", id });
  }, []);

  const prependTrip = useCallback((trip: SavedTripListItem) => {
    dispatch({ type: "trip:prepend", trip });
  }, []);

  return {
    trips: state.trips,
    loading: state.loading,
    error: state.error,
    refetch: fetchTrips,
    removeTrip,
    prependTrip
  };
}
