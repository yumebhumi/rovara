import type { GetTripsResponse, PersistedTrip, SavedTripListItem } from "@/types";
import { DEFAULT_CURRENCY, isSupportedCurrency } from "@/lib/currency";
import {
  deriveBudgetBreakdown,
  deriveTripStatus,
  toDisplayTripTravelType
} from "@/lib/trips";
import {
  db,
  resolvePagination,
  toPaginatedResult,
  type PaginationInput
} from "./shared";
import { tripListItemSelect, type TripListItemRecord } from "@/types/database";

type LegacyTripRow = {
  id: string;
  userId: string;
  destination: string;
  country: string | null;
  startDate: Date;
  endDate: Date;
  budget: number;
  currency: string | null;
  travelType: string | null;
  accommodationPreference: string | null;
  transportationPreference: string | null;
  interests: string[] | null;
  travelVibe: string | null;
  summary: string | null;
  coverImage: string | null;
  status: string | null;
  shareToken: string | null;
  createdAt: Date;
  updatedAt: Date;
  generatedItinerary?: unknown;
  weatherData?: unknown;
  mapLocations?: unknown;
};

function isLegacySchemaMismatch(error: unknown) {
  return (
    error instanceof Error &&
    (
      error.message.includes("does not exist in the current database") ||
      error.message.includes("column `Trip.") ||
      error.message.includes('column "category" does not exist')
    )
  );
}

function toIsoDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function toIsoDateTime(value: Date) {
  return value.toISOString();
}

function durationInDays(startDate: Date, endDate: Date) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(0, 0, 0, 0);
  return Math.max(1, Math.round((end.getTime() - start.getTime()) / millisecondsPerDay) + 1);
}

function serializeLegacyTrip(row: LegacyTripRow): PersistedTrip {
  const budgetBreakdown = deriveBudgetBreakdown(
    row.budget,
    row.accommodationPreference,
    row.transportationPreference
  );

  return {
    id: row.id,
    userId: row.userId,
    destination: row.destination,
    country: row.country,
    startDate: toIsoDate(row.startDate),
    endDate: toIsoDate(row.endDate),
    duration: durationInDays(row.startDate, row.endDate),
    budget: row.budget,
    currency:
      row.currency && isSupportedCurrency(row.currency) ? row.currency : DEFAULT_CURRENCY,
    travelVibe: row.travelVibe ?? "Relaxed",
    coverImage: row.coverImage
      ? {
          url: row.coverImage,
          alt: row.destination
        }
      : null,
    summary: row.summary,
    itineraryDays: [],
    recommendations: [],
    budgetBreakdown,
    weatherInsights: [],
    createdAt: toIsoDateTime(row.createdAt),
    updatedAt: toIsoDateTime(row.updatedAt),
    status: row.status ?? deriveTripStatus(row.startDate, row.endDate),
    preferences: row.interests ?? [],
    interests: row.interests ?? [],
    travelType: toDisplayTripTravelType(row.travelType),
    accommodationPreference: row.accommodationPreference,
    transportationPreference: row.transportationPreference,
    generatedItinerary: row.generatedItinerary,
    weatherData: row.weatherData,
    mapLocations: row.mapLocations,
    shareToken: row.shareToken
  };
}

function serializeSavedTripListItem(trip: PersistedTrip): SavedTripListItem {
  return {
    id: trip.id,
    destination: trip.destination,
    country: trip.country ?? null,
    startDate: trip.startDate,
    endDate: trip.endDate,
    budget: trip.budget,
    currency: trip.currency,
    travelVibe: trip.travelVibe,
    summary: trip.summary ?? null,
    coverImage: trip.coverImage?.url ?? null,
    createdAt: trip.createdAt
  };
}

function serializeTripListRecord(trip: TripListItemRecord): SavedTripListItem {
  return {
    id: trip.id,
    destination: trip.destination,
    country: trip.country ?? null,
    startDate: toIsoDate(trip.startDate),
    endDate: toIsoDate(trip.endDate),
    budget: trip.budget,
    currency:
      trip.currency && isSupportedCurrency(trip.currency) ? trip.currency : DEFAULT_CURRENCY,
    travelVibe: trip.travelVibe,
    summary: trip.summary ?? null,
    coverImage: trip.coverImage ?? null,
    createdAt: toIsoDateTime(trip.createdAt)
  };
}

async function getLegacyTrips(clerkId: string, pagination?: { skip: number; take: number }) {
  const rows = await db.$queryRawUnsafe<LegacyTripRow[]>(
    `
      SELECT
        t."id",
        t."userId",
        t."destination",
        t."country",
        t."startDate",
        t."endDate",
        t."budget",
        t."currency",
        t."travelVibe",
        t."summary",
        t."coverImage",
        t."travelType",
        t."accommodationPreference",
        t."transportationPreference",
        t."interests",
        t."status",
        t."shareToken",
        t."generatedItinerary",
        t."weatherData",
        t."mapLocations",
        t."createdAt",
        t."updatedAt"
      FROM "Trip" t
      INNER JOIN "User" u ON u."id" = t."userId"
      WHERE u."clerkId" = $1
      ORDER BY t."createdAt" DESC
      ${pagination ? "OFFSET $2 LIMIT $3" : ""}
    `,
    ...(pagination
      ? [clerkId, pagination.skip, pagination.take]
      : [clerkId])
  );

  return rows.map(serializeLegacyTrip);
}

async function countLegacyTrips(clerkId: string) {
  const rows = await db.$queryRawUnsafe<Array<{ total: bigint | number }>>(
    `
      SELECT COUNT(*) AS total
      FROM "Trip" t
      INNER JOIN "User" u ON u."id" = t."userId"
      WHERE u."clerkId" = $1
    `,
    clerkId
  );

  const total = rows[0]?.total ?? 0;
  return typeof total === "bigint" ? Number(total) : total;
}

export async function getTrips(clerkId: string): Promise<GetTripsResponse["trips"]> {
  try {
    const trips = await db.trip.findMany({
      where: {
        user: { clerkId }
      },
      select: tripListItemSelect,
      orderBy: [{ createdAt: "desc" }]
    });

    return trips.map(serializeTripListRecord);
  } catch (error) {
    if (!isLegacySchemaMismatch(error)) {
      throw error;
    }

    return (await getLegacyTrips(clerkId)).map(serializeSavedTripListItem);
  }
}

export async function getTripsPage(clerkId: string, pagination: PaginationInput = {}) {
  const state = resolvePagination(pagination);
  const where = { user: { clerkId } } as const;

  try {
    const [items, total] = await Promise.all([
      db.trip.findMany({
        where,
        select: tripListItemSelect,
        orderBy: [{ createdAt: "desc" }],
        skip: state.skip,
        take: state.take
      }),
      db.trip.count({ where })
    ]);

    return toPaginatedResult(
      items.map(serializeTripListRecord),
      total,
      state
    );
  } catch (error) {
    if (!isLegacySchemaMismatch(error)) {
      throw error;
    }

    const [items, total] = await Promise.all([
      getLegacyTrips(clerkId, { skip: state.skip, take: state.take }),
      countLegacyTrips(clerkId)
    ]);

    return toPaginatedResult(items.map(serializeSavedTripListItem), total, state);
  }
}
