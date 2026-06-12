"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { PublicPersistedTrip } from "@/types";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { ItineraryExperience } from "./itinerary-experience";
 
export function TripItineraryClient({
  trip,
  savedState = false
}: {
  trip: PublicPersistedTrip;
  savedState?: boolean;
}) {
  return (
    <div className="space-y-6">
      {savedState ? (
        <section
          aria-live="polite"
          className="rounded-[1.4rem] border border-[#14B8A6]/18 bg-[#14B8A6]/10 px-5 py-4 text-[#E2FDF7]"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#8FE3CF]" />
              <div>
                <p className="text-sm font-semibold">Trip saved successfully.</p>
                <p className="mt-1 text-sm text-[#BDEEE2]">
                  This itinerary is now stored in your account and available from your trips library.
                </p>
              </div>
            </div>
            <Link href={ROUTES.TRIPS}>
              <Button variant="outline" className="border-[#14B8A6]/20">
                View Trips
              </Button>
            </Link>
          </div>
        </section>
      ) : null}

      <ItineraryExperience trip={trip} />
    </div>
  );
}
