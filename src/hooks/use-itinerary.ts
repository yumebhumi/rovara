"use client";

import { useState, useCallback } from "react";
import type { ItineraryDay, GenerateItineraryInput } from "@/types";

type State = {
  loading: boolean;
  days: ItineraryDay[] | null;
  error: string | null;
};

export function useItinerary() {
  const [state, setState] = useState<State>({ loading: false, days: null, error: null });

  const generate = useCallback(async (input: GenerateItineraryInput) => {
    setState({ loading: true, days: null, error: null });
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      if (!res.ok) throw new Error("Generation failed");
      const data = (await res.json()) as { days: ItineraryDay[] };
      setState({ loading: false, days: data.days ?? [], error: null });
      return data;
    } catch (err) {
      setState({ loading: false, days: null, error: (err as Error).message });
      throw err;
    }
  }, []);

  return { ...state, generate };
}
