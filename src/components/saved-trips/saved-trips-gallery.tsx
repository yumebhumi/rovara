"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CloudSun,
  Compass,
  Plus,
  Trash2,
  Wallet
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { formatDateRange, durationInDays } from "@/utils/date";
import { cn } from "@/utils/cn";
import { formatCurrencyValue, type SupportedCurrency } from "@/lib/currency";
import { pageTransition } from "@/styles/animations";
import { Button } from "@/components/ui/button";

export type SavedGalleryTrip = {
  id: string;
  destination: string;
  country?: string | null;
  startDate: string | Date;
  endDate: string | Date;
  budget: number;
  currency?: SupportedCurrency;
  travelVibe: string;
  coverImage?: string | null;
  summary?: string;
  createdAt: string;
};

type SavedTripsGalleryProps = {
  trips: SavedGalleryTrip[];
  loading?: boolean;
  error?: string | null;
  successMessage?: string | null;
  deletingId?: string | null;
  onDeleteRequest?: (tripId: string) => void;
  onRetry?: () => void;
};

const reveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: pageTransition }
};

const destinationImages = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1600&q=82"
] as const;

function hashDestination(value: string) {
  return Array.from(value).reduce((total, char) => total + char.charCodeAt(0), 0);
}

function imageForTrip(destination: string) {
  return destinationImages[hashDestination(destination) % destinationImages.length];
}

function summaryForTrip(trip: SavedGalleryTrip) {
  if (trip.summary?.trim()) {
    return trip.summary;
  }

  const days = Math.max(1, durationInDays(trip.startDate, trip.endDate) + 1);
  const vibe = trip.travelVibe.toLowerCase();

  return `${days} days in ${trip.destination} shaped into a ${vibe} journey with calm pacing and readable daily flow.`;
}

function TravelTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-[#0B1215]/46 px-3 py-1 text-[11px] font-medium text-[#F8FAF8]/80 backdrop-blur-md">
      {children}
    </span>
  );
}

function TripsHero({ count }: { count: number }) {
  return (
    <motion.section
      className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#10191D]/70 px-5 py-12 backdrop-blur-xl sm:rounded-[2rem] sm:px-10 sm:py-16 lg:px-16 lg:py-20"
      initial="hidden"
      animate="visible"
      variants={reveal}
      aria-labelledby="saved-trips-title"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(143,227,207,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.055),transparent_42%)]" />
      <div aria-hidden="true" className="absolute right-8 top-8 h-28 w-28 rounded-full border border-white/[0.08] opacity-40" />
      <div className="relative max-w-3xl">
        <p className="rovara-eyebrow">Saved trips</p>
        <h1 id="saved-trips-title" className="rovara-page-title mt-6">
          Your journeys.
        </h1>
        <p className="rovara-body mt-7 max-w-2xl">
          A cinematic archive of AI-crafted travel experiences, collected for the moments you want to return to.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <TravelTag>{count} saved</TravelTag>
          <TravelTag>AI-crafted archive</TravelTag>
          <TravelTag>Editorial itinerary gallery</TravelTag>
        </div>
      </div>
    </motion.section>
  );
}

function SavedTripsLoadingState() {
  return (
    <div
      className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
      role="status"
      aria-label="Loading saved trips"
    >
      <span className="sr-only">Loading saved trips...</span>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[1.55rem] border border-white/[0.08] bg-white/[0.035] p-5 shadow-[0_22px_62px_rgba(0,0,0,0.2)]"
        >
          <div className="h-48 animate-pulse rounded-[1.2rem] bg-white/[0.06]" />
          <div className="mt-5 h-8 w-2/3 animate-pulse rounded bg-white/[0.06]" />
          <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-white/[0.06]" />
          <div className="mt-6 h-20 animate-pulse rounded-[1rem] bg-white/[0.06]" />
        </div>
      ))}
    </div>
  );
}

function SavedTripsErrorState({
  message,
  onRetry
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <motion.section
      aria-labelledby="saved-trips-error-title"
      className="rounded-[1.5rem] border border-white/[0.08] bg-[#10191D]/72 px-5 py-12 text-center backdrop-blur-xl sm:rounded-[2rem] sm:px-6 sm:py-16"
      initial="hidden"
      animate="visible"
      variants={reveal}
    >
      <div className="mx-auto max-w-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#14B8A6]/18 bg-[#14B8A6]/10 text-[#8FE3CF]">
          <CloudSun size={28} aria-hidden="true" />
        </div>
        <h2 id="saved-trips-error-title" className="rovara-section-title mt-9">Saved trips are temporarily unavailable.</h2>
        <p className="rovara-body mt-5">{message}</p>
        {onRetry ? (
          <Button onClick={onRetry} className="mt-8">
            Try again
          </Button>
        ) : null}
      </div>
    </motion.section>
  );
}

function SavedTripsSuccessState({ message }: { message: string }) {
  return (
    <motion.section
      className="rounded-[1.25rem] border border-[#14B8A6]/18 bg-[#14B8A6]/10 px-4 py-4 text-[#DDFBF3] sm:rounded-[1.6rem] sm:px-5"
      initial="hidden"
      animate="visible"
      variants={reveal}
      aria-live="polite"
      role="status"
    >
      <p className="text-sm font-medium">{message}</p>
    </motion.section>
  );
}

function CinematicTripCard({
  trip,
  index,
  deleting,
  onDeleteRequest
}: {
  trip: SavedGalleryTrip;
  index: number;
  deleting?: boolean;
  onDeleteRequest?: (tripId: string) => void;
}) {
  const isFeature = index % 5 === 0;
  const image = imageForTrip(trip.destination);

  return (
    <motion.article
      className={cn("break-inside-avoid pb-5", isFeature && "md:pb-6")}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={reveal}
  >
      <div className="group min-w-0 overflow-hidden rounded-[1.35rem] border border-white/[0.08] bg-white/[0.035] shadow-[0_22px_62px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-[#8FE3CF]/18 hover:shadow-[0_26px_72px_rgba(0,0,0,0.26)] sm:rounded-[1.55rem]">
        <div className="relative">
          <Link
            href={ROUTES.TRIP(trip.id)}
            className="block outline-none focus-visible:ring-2 focus-visible:ring-[#8FE3CF]/60"
            aria-label={`Open itinerary for ${trip.destination}`}
          >
            <div className={cn("relative overflow-hidden", isFeature ? "h-[18rem] sm:h-[24rem]" : "h-[16rem] sm:h-[18rem]")}>
              <Image
                src={trip.coverImage || image}
                alt={`${trip.destination} destination scene`}
                fill
                sizes="(min-width: 1280px) 420px, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.015]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,21,0.06)_0%,rgba(11,18,21,0.38)_48%,rgba(11,18,21,0.92)_100%)]" />
              <div className="absolute left-3 right-14 top-3 flex min-w-0 items-center justify-between gap-3 sm:left-4 sm:right-16 sm:top-4">
                <TravelTag>{formatDateRange(trip.startDate, trip.endDate)}</TravelTag>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.1] bg-[#0B1215]/48 text-[#8FE3CF] backdrop-blur-md">
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <h2 className="break-words text-2xl font-semibold leading-tight text-[#F8FAF8] sm:text-[2.15rem]">
                  {trip.destination}
                </h2>
                {trip.country ? (
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#D7E7E4]/72">
                    {trip.country}
                  </p>
                ) : null}
                <p className="mt-4 text-sm leading-7 text-[#F8FAF8]/78 sm:text-[15px]">
                  {summaryForTrip(trip)}
                </p>
              </div>
            </div>
          </Link>

          {onDeleteRequest ? (
            <button
              type="button"
              onClick={() => onDeleteRequest(trip.id)}
              disabled={deleting}
              aria-busy={deleting}
              aria-label={`Delete saved trip to ${trip.destination}`}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.1] bg-[#0B1215]/58 text-[#F8FAF8] backdrop-blur-md transition hover:border-[#FCA5A5]/30 hover:text-[#FCA5A5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="space-y-6 p-5 sm:p-7">
          <div className="flex flex-wrap gap-2">
            <TravelTag>{trip.travelVibe}</TravelTag>
            <TravelTag>
              Saved {new Date(trip.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </TravelTag>
          </div>
          <div className="grid gap-4 min-[430px]:grid-cols-3">
            <div className="rounded-[1rem] border border-white/[0.08] bg-[#0B1215]/34 p-3">
              <CalendarDays size={15} className="text-[#8FE3CF]" aria-hidden="true" />
              <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-[#94A3B8]">Length</p>
              <p className="mt-1 text-sm font-medium text-[#F8FAF8]">{Math.max(1, durationInDays(trip.startDate, trip.endDate) + 1)} days</p>
            </div>
            <div className="rounded-[1rem] border border-white/[0.08] bg-[#0B1215]/34 p-3">
              <Wallet size={15} className="text-[#8FE3CF]" aria-hidden="true" />
              <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-[#94A3B8]">Budget</p>
              <p className="mt-1 break-words text-sm font-medium text-[#F8FAF8]">{formatCurrencyValue(trip.budget, trip.currency)}</p>
            </div>
            <div className="rounded-[1rem] border border-white/[0.08] bg-[#0B1215]/34 p-3">
              <CloudSun size={15} className="text-[#8FE3CF]" aria-hidden="true" />
              <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-[#94A3B8]">Travel vibe</p>
              <p className="mt-1 text-sm font-medium text-[#F8FAF8]">{trip.travelVibe}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 min-[430px]:flex-row min-[430px]:flex-wrap">
            <Link
              href={ROUTES.TRIP(trip.id)}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[#14B8A6]/28 bg-[#14B8A6] px-4 py-2 text-sm font-medium text-[#041311] shadow-[0_10px_24px_rgba(20,184,166,0.12)] transition-[background-color,border-color,color,box-shadow,opacity] duration-200 hover:bg-[#1ac7b4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FE3CF]/35 min-[430px]:w-auto"
              aria-label={`Open itinerary for ${trip.destination}`}
            >
              Open Trip
            </Link>
            {onDeleteRequest ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => onDeleteRequest(trip.id)}
                disabled={deleting}
                aria-label={`Delete saved trip to ${trip.destination}`}
                className="h-10 w-full rounded-full px-4 min-[430px]:w-auto"
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function TripGallery({
  trips,
  deletingId,
  onDeleteRequest
}: {
  trips: SavedGalleryTrip[];
  deletingId?: string | null;
  onDeleteRequest?: (tripId: string) => void;
}) {
  return (
    <section aria-labelledby="saved-trips-gallery-title" className="columns-1 gap-6 md:columns-2 xl:columns-3">
      <h2 id="saved-trips-gallery-title" className="sr-only">Saved travel gallery</h2>
      {trips.map((trip, index) => (
        <CinematicTripCard
          key={trip.id}
          trip={trip}
          index={index}
          deleting={deletingId === trip.id}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </section>
  );
}

function EmptyTripsState() {
  return (
    <motion.section
      className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#10191D]/72 px-5 py-14 text-center backdrop-blur-xl sm:rounded-[2rem] sm:px-10 sm:py-20"
      initial="hidden"
      animate="visible"
      variants={reveal}
      aria-labelledby="empty-saved-title"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(143,227,207,0.18),transparent_30%),linear-gradient(rgba(248,250,248,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(248,250,248,0.035)_1px,transparent_1px)] bg-[size:100%_100%,42px_42px,42px_42px]" />
      <div className="relative mx-auto max-w-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#14B8A6]/18 bg-[#14B8A6]/10 text-[#8FE3CF]">
          <Compass size={30} aria-hidden="true" />
        </div>
        <h2 id="empty-saved-title" className="rovara-section-title mt-9">No journeys yet.</h2>
        <p className="rovara-body mt-5">
          Start crafting your first AI-powered adventure and it will appear here as part of your personal travel archive.
        </p>
        <Link
          href={ROUTES.GENERATE}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/24 bg-[#14B8A6]/12 px-5 py-3 text-sm font-medium text-[#D6F5EC] transition hover:bg-[#14B8A6]/18 focus-visible:ring-2 focus-visible:ring-[#8FE3CF]/60"
        >
          <Plus size={16} aria-hidden="true" />
          Craft a journey
        </Link>
      </div>
    </motion.section>
  );
}

export function SavedTripsGallery({
  trips,
  loading = false,
  error = null,
  successMessage = null,
  deletingId = null,
  onDeleteRequest,
  onRetry
}: SavedTripsGalleryProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-10 sm:space-y-16">
      <TripsHero count={trips.length} />
      {successMessage ? <SavedTripsSuccessState message={successMessage} /> : null}
      {loading ? <SavedTripsLoadingState /> : null}
      {!loading && error ? <SavedTripsErrorState message={error} onRetry={onRetry} /> : null}
      {!loading && !error && trips.length ? (
        <TripGallery
          trips={trips}
          deletingId={deletingId}
          onDeleteRequest={onDeleteRequest}
        />
      ) : null}
      {!loading && !error && trips.length === 0 ? <EmptyTripsState /> : null}
    </div>
  );
}
