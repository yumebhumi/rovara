"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteTrip, useTrips } from "@/hooks";
import type { SavedTripListItem } from "@/types";
import { SavedTripsGallery, type SavedGalleryTrip } from "./saved-trips-gallery";

function toGalleryTrip(trip: SavedTripListItem): SavedGalleryTrip {
  return {
    id: trip.id,
    destination: trip.destination,
    country: trip.country ?? null,
    startDate: trip.startDate,
    endDate: trip.endDate,
    budget: trip.budget,
    currency: trip.currency,
    travelVibe: trip.travelVibe,
    coverImage: trip.coverImage ?? null,
    summary: trip.summary ?? undefined,
    createdAt: trip.createdAt
  };
}

export function SavedTripsPage() {
  const { trips, loading, error, removeTrip, refetch } = useTrips();
  const {
    deleteTrip,
    deletingId,
    successMessage,
    error: deleteError,
    clearError: clearDeleteError,
    clearSuccess: clearDeleteSuccess
  } = useDeleteTrip();
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const galleryTrips = useMemo(() => trips.map(toGalleryTrip), [trips]);
  const selectedTrip = galleryTrips.find((trip) => trip.id === selectedTripId) ?? null;

  async function confirmDelete() {
    if (!selectedTripId) {
      return;
    }

    const tripId = selectedTripId;
    setSelectedTripId(null);
    clearDeleteError();
    clearDeleteSuccess();
    removeTrip(tripId);

    try {
      await deleteTrip(tripId);
    } catch {
      await refetch();
    }
  }

  return (
    <>
      <SavedTripsGallery
        trips={galleryTrips}
        loading={loading}
        error={error ?? deleteError}
        successMessage={successMessage}
        deletingId={deletingId}
        onDeleteRequest={(tripId) => setSelectedTripId(tripId)}
        onRetry={refetch}
      />

      <Dialog open={Boolean(selectedTrip)} onOpenChange={(open) => !open && setSelectedTripId(null)}>
        <DialogContent className="max-w-md rounded-[1.6rem] border-white/[0.08] bg-[#10191D] p-0 text-[#F8FAF8] ring-white/[0.08]">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-xl font-semibold tracking-[-0.03em] text-[#F8FAF8]">
              Delete saved trip?
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-7 text-[#94A3B8]">
              {selectedTrip
                ? `${selectedTrip.destination} will be removed from your account. This action cannot be undone.`
                : "This saved itinerary will be removed from your account."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="rounded-b-[1.6rem] border-white/[0.08] bg-white/[0.03]">
            <Button
              variant="outline"
              onClick={() => setSelectedTripId(null)}
              disabled={Boolean(deletingId)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={Boolean(deletingId)}
            >
              {deletingId ? "Deleting..." : "Delete trip"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
