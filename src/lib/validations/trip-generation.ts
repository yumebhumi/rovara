import { z } from "zod";
import {
  ACCOMMODATION_PREFERENCES,
  TRANSPORTATION_PREFERENCES,
  TRIP_GENERATION_INTERESTS,
  TRIP_GENERATION_TRAVEL_TYPES
} from "@/types/forms";
import {
  tripGenerationBudgetMax,
  tripGenerationBudgetMin,
  tripGenerationBudgetStep
} from "./trip-schema";

export const tripGenerationSchema = z
  .object({
    destination: z.string().trim().min(2, "Destination is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    budget: z.number().min(tripGenerationBudgetMin, `Minimum budget is ${tripGenerationBudgetMin}`),
    travelType: z.enum(TRIP_GENERATION_TRAVEL_TYPES, {
      errorMap: () => ({ message: "Select a travel type" })
    }),
    interests: z
      .array(z.enum(TRIP_GENERATION_INTERESTS))
      .min(1, "Select at least one interest"),
    accommodationPreference: z.enum(ACCOMMODATION_PREFERENCES, {
      errorMap: () => ({ message: "Select an accommodation preference" })
    }),
    transportationPreference: z.enum(TRANSPORTATION_PREFERENCES, {
      errorMap: () => ({ message: "Select a transportation preference" })
    })
  })
  .superRefine((values, ctx) => {
    const start = new Date(values.startDate);
    const end = new Date(values.endDate);

    if (Number.isNaN(start.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: "Choose a valid start date"
      });
    }

    if (Number.isNaN(end.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "Choose a valid end date"
      });
    }

    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be on or after the start date"
      });
    }
  });

export type TripGenerationFormValues = z.infer<typeof tripGenerationSchema>;
export {
  tripGenerationBudgetMin,
  tripGenerationBudgetMax,
  tripGenerationBudgetStep
};
