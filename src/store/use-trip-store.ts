"use client";

import { useState } from "react";
import type { Trip, ItineraryDay } from "@/types";

type TripStore = {
  currentTrip: Trip | null;
  currentItinerary: ItineraryDay[] | null;
  setCurrentTrip: (trip: Trip | null) => void;
  setCurrentItinerary: (days: ItineraryDay[] | null) => void;
};

/**
 * Simple React-state implementation.
 * Drop-in replaceable with Zustand:
 *   npm install zustand
 *   then: import { create } from "zustand"; export const useTripStore = create<TripStore>(...)
 */
export function useTripStore(): TripStore {
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [currentItinerary, setCurrentItinerary] = useState<ItineraryDay[] | null>(null);
  return { currentTrip, currentItinerary, setCurrentTrip, setCurrentItinerary };
}
