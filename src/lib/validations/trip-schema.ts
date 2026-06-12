import { z } from "zod";
import { isSupportedCurrency, type SupportedCurrency } from "@/lib/currency";
import { getPreferencesForTripVibes, TRIP_VIBES } from "@/lib/trip-vibes";
import type { GenerateItineraryInput } from "@/types";

const MIN_BUDGET = 300;

const travelDateMessage = "Select valid travel dates.";

export const tripGenerationBudgetMin = MIN_BUDGET;
export const tripGenerationBudgetMax = 1_000_000;
export const tripGenerationBudgetStep = 100;

const tripDateSchema = z.string().trim().min(1, travelDateMessage);

const tripFormFields = {
  destination: z.string().trim().min(2, "Please enter a destination."),
  startDate: tripDateSchema,
  endDate: tripDateSchema,
  budget: z.coerce
    .number({
      invalid_type_error: "Set a valid budget."
    })
    .min(MIN_BUDGET, "Enter a starting budget so Rovara can shape a realistic trip."),
  vibes: z
    .array(z.enum(TRIP_VIBES))
    .min(1, "Choose at least one travel vibe.")
} satisfies z.ZodRawShape;

function withDateValidation<T extends z.ZodRawShape>(shape: T) {
  return z.object(shape).superRefine((values, ctx) => {
    const start = new Date(values.startDate);
    const end = new Date(values.endDate);

    if (Number.isNaN(start.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: travelDateMessage
      });
    }

    if (Number.isNaN(end.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: travelDateMessage
      });
    }

    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "Return date must be on or after departure."
      });
    }
  });
}

export const tripFormSchema = withDateValidation(tripFormFields);

export const tripGenerationRequestSchema = withDateValidation({
  ...tripFormFields,
  currency: z.custom<SupportedCurrency>(
    (value) => typeof value === "string" && isSupportedCurrency(value),
    "Unsupported currency."
  )
});

export type TripFormValues = z.infer<typeof tripFormSchema>;
export type TripGenerationRequest = z.infer<typeof tripGenerationRequestSchema>;

export function buildTripGenerationInput(
  values: TripGenerationRequest
): GenerateItineraryInput {
  const preferences = getPreferencesForTripVibes(values.vibes);

  return {
    destination: values.destination,
    startDate: values.startDate,
    endDate: values.endDate,
    budget: values.budget,
    currency: values.currency,
    travelType: preferences.travelType,
    interests: preferences.interests,
    accommodationPreference: preferences.accommodationPreference,
    transportationPreference: preferences.transportationPreference
  };
}
