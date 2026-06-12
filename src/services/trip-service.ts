import { z } from "zod";
import { isSupportedCurrency, type SupportedCurrency } from "@/lib/currency";
import { formatTripVibeSelection } from "@/lib/trip-vibes";
import { generateTripResponseSchema } from "@/lib/validations/itinerary-schema";
import type { TripFormValues } from "@/lib/validations/trip-schema";
import type { GenerateTripResponse } from "@/types";

const supportedCurrencySchema = z.custom<SupportedCurrency>(
  (value) => typeof value === "string" && isSupportedCurrency(value),
  "Unsupported currency."
);

const apiTripRequestSchema = z.object({
  destination: z.string().trim().min(2),
  startDate: z.string().trim().min(1),
  endDate: z.string().trim().min(1),
  budget: z.number().positive(),
  travelVibe: z.string().trim().min(1),
  currency: supportedCurrencySchema
});

const apiTripResponseSchema = generateTripResponseSchema;

export type GenerateTripResult = GenerateTripResponse;

export type GenerateTripPayload = z.infer<typeof apiTripRequestSchema>;

export type GenerateTripPayloadInput = Pick<
  TripFormValues,
  "destination" | "startDate" | "endDate" | "budget" | "vibes"
> & {
  currency: SupportedCurrency;
};

function toErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something unexpected interrupted trip generation.";
}

function getApiErrorMessage(
  response: Response,
  rawPayload: ({ error?: string } & Partial<GenerateTripResult>) | null
) {
  if (rawPayload?.error) {
    return rawPayload.error;
  }

  switch (response.status) {
    case 400:
      return "Trip details are incomplete. Check the form and try again.";
    case 401:
      return "You need to sign in before generating a trip.";
    case 429:
      return "Trip generation is busy right now. Try again in a moment.";
    default:
      return "Trip generation failed.";
  }
}

export function buildGenerateTripPayload(
  input: GenerateTripPayloadInput
): GenerateTripPayload {
  return apiTripRequestSchema.parse({
    destination: input.destination,
    startDate: input.startDate,
    endDate: input.endDate,
    budget: input.budget,
    travelVibe: formatTripVibeSelection(input.vibes),
    currency: input.currency
  });
}

export async function submitTripGeneration(
  input: GenerateTripPayload
): Promise<GenerateTripResult> {
  const payload = apiTripRequestSchema.parse(input);
  let response: Response;

  try {
    response = await fetch("/api/generate-trip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    throw new Error("We couldn't reach the trip engine. Check your connection and try again.", {
      cause: error
    });
  }

  const rawPayload = (await response.json().catch(() => null)) as
    | ({ error?: string } & Partial<GenerateTripResult>)
    | null;

  if (!response.ok) {
    throw new Error(getApiErrorMessage(response, rawPayload));
  }

  const parsedPayload = apiTripResponseSchema.safeParse(rawPayload);

  if (!parsedPayload.success) {
    throw new Error("The trip engine returned an incomplete response.");
  }

  return parsedPayload.data;
}

export function getTripGenerationErrorMessage(error: unknown) {
  return toErrorMessage(error);
}
