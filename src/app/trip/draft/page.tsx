"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ItineraryExperience } from "@/components/itinerary/itinerary-experience";
import { SaveDraftTripBar } from "@/components/itinerary/save-draft-trip-bar";
import { EmptyState, PageIntro } from "@/components/shared";
import { loadTripDraft } from "@/lib/trip-draft";
import { buildPersistedTripFromDraft } from "@/components/itinerary/render-utils";

export default function DraftTripPage() {
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draftId") ?? "";
  const draft = useMemo(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    if (!draftId) {
      return null;
    }

    return loadTripDraft(draftId);
  }, [draftId]);

  if (draft === undefined) {
    return (
      <div className="space-y-8">
        <PageIntro
          eyebrow="Draft itinerary"
          title="Loading your local draft."
          description="Rovara is preparing the itinerary view from your local generation session."
        />
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="space-y-8">
        <PageIntro
          eyebrow="Draft itinerary"
          title="Draft not found."
          description="This local itinerary draft is no longer available in the current browser session."
        />
        <EmptyState
          title="Generate a new draft"
          description="Create a new itinerary from the generate page to reopen the local preview flow."
          action={{ label: "Generate Trip", href: "/generate" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <SaveDraftTripBar draft={draft} />
      <ItineraryExperience trip={buildPersistedTripFromDraft(draft)} />
    </div>
  );
}
