import { Prisma } from "@prisma/client";

export const tripDetailsInclude = Prisma.validator<Prisma.TripInclude>()({
  itineraryDays: {
    orderBy: { dayNumber: "asc" },
    include: {
      activities: {
        orderBy: [{ section: "asc" }, { createdAt: "asc" }]
      }
    }
  },
  recommendations: {
    orderBy: { createdAt: "desc" }
  },
  budgetBreakdown: true
});

export const tripListItemSelect = Prisma.validator<Prisma.TripSelect>()({
  id: true,
  destination: true,
  country: true,
  startDate: true,
  endDate: true,
  budget: true,
  currency: true,
  travelVibe: true,
  summary: true,
  coverImage: true,
  createdAt: true
});

export type DatabaseUserRecord = Prisma.UserGetPayload<{}>;
export type TripRecord = Prisma.TripGetPayload<{ include: typeof tripDetailsInclude }>;
export type TripListItemRecord = Prisma.TripGetPayload<{ select: typeof tripListItemSelect }>;
export type RecommendationRecord = Prisma.RecommendationGetPayload<{}>;
export type NotificationRecord = Prisma.NotificationGetPayload<{}>;
