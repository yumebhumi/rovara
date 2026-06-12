import type { ZodIssue } from "zod";
import {
  AITripGenerationResponseSchema
} from "@/lib/validations/itinerary-schema";
import type { AITripGenerationResponse } from "@/types/itinerary";

export class ParseItineraryError extends Error {
  code: "INVALID_JSON" | "EMPTY_ITINERARY" | "INVALID_ITINERARY";
  details: string[];

  constructor(
    message: string,
    code: "INVALID_JSON" | "EMPTY_ITINERARY" | "INVALID_ITINERARY",
    details: string[] = []
  ) {
    super(message);
    this.name = "ParseItineraryError";
    this.code = code;
    this.details = details;
  }
}

function sanitizeAiPayload(raw: string) {
  const trimmed = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    return trimmed;
  }

  return trimmed.slice(firstBrace, lastBrace + 1);
}

function parseRawJson(raw: string) {
  try {
    return JSON.parse(sanitizeAiPayload(raw)) as unknown;
  } catch {
    throw new ParseItineraryError(
      "The trip engine returned malformed JSON.",
      "INVALID_JSON"
    );
  }
}

function formatSchemaIssues(issues: ZodIssue[]) {
  return issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join(".") : "root";
    return `${path}: ${issue.message}`;
  });
}

export function safeParseItinerary(
  raw: unknown
):
  | { success: true; data: AITripGenerationResponse }
  | { success: false; error: ParseItineraryError } {
  let candidate = raw;

  if (typeof raw === "string") {
    try {
      candidate = parseRawJson(raw);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ParseItineraryError
            ? error
            : new ParseItineraryError(
                "The trip engine returned malformed JSON.",
                "INVALID_JSON"
              )
      };
    }
  }

  if (
    candidate === null ||
    typeof candidate !== "object" ||
    Array.isArray(candidate)
  ) {
    return {
      success: false,
      error: new ParseItineraryError(
        "The trip engine returned an empty itinerary response.",
        "EMPTY_ITINERARY"
      )
    };
  }

  if (
    "days" in candidate &&
    Array.isArray((candidate as { days?: unknown }).days) &&
    (candidate as { days: unknown[] }).days.length === 0
  ) {
    return {
      success: false,
      error: new ParseItineraryError(
        "The trip engine returned an empty itinerary.",
        "EMPTY_ITINERARY"
      )
    };
  }

  const parsed = AITripGenerationResponseSchema.safeParse(candidate);

  if (!parsed.success) {
    return {
      success: false,
      error: new ParseItineraryError(
        "The trip engine returned an invalid itinerary structure.",
        "INVALID_ITINERARY",
        formatSchemaIssues(parsed.error.issues)
      )
    };
  }

  return {
    success: true,
    data: parsed.data
  };
}

export function parseItinerary(raw: unknown): AITripGenerationResponse {
  const parsed = safeParseItinerary(raw);

  if (!parsed.success) {
    throw parsed.error;
  }

  return parsed.data;
}
