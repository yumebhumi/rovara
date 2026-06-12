import { apiConfig } from "@/config/api";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import {
  getOpenAIClient,
  getOpenAIConfigurationErrorMessage,
  isOpenAIConfigured
} from "@/lib/openai";
import type { FullItineraryResponse } from "@/types";
import { buildItinerarySystemPrompt, buildItineraryUserPrompt } from "./prompts";
import { ParseItineraryError } from "./parse-itinerary";
import {
  itineraryResponseSchema,
  parseItineraryResponse,
  type NormalizedTripRequest
} from "./parser";

export class GenerateItineraryError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "GenerateItineraryError";
    this.status = status;
  }
}

function mapOpenAIError(error: unknown) {
  if (error instanceof GenerateItineraryError) {
    return error;
  }

  if (
    error instanceof Error &&
    (error.name === "AbortError" || error.name === "TimeoutError")
  ) {
    return new GenerateItineraryError(
      "Trip generation took too long. Please try again in a moment.",
      504
    );
  }

  if (error instanceof OpenAI.APIError) {
    if (error.status === 429) {
      return new GenerateItineraryError(
        "The trip engine is busy right now. Please try again shortly.",
        429
      );
    }

    if (error.status === 401 || error.status === 403) {
      return new GenerateItineraryError(getOpenAIConfigurationErrorMessage(), 503);
    }

    return new GenerateItineraryError(
      "The trip engine could not complete this request right now.",
      error.status ?? 502
    );
  }

  if (error instanceof ParseItineraryError) {
    return new GenerateItineraryError(error.message, 502);
  }

  if (error instanceof SyntaxError || error instanceof Error) {
    return new GenerateItineraryError(
      "The trip engine returned an invalid itinerary. Please try again.",
      502
    );
  }

  return new GenerateItineraryError(
    "Something unexpected interrupted itinerary generation.",
    500
  );
}

export async function generateStructuredItinerary(
  request: NormalizedTripRequest
): Promise<FullItineraryResponse> {
  if (!isOpenAIConfigured()) {
    throw new GenerateItineraryError(getOpenAIConfigurationErrorMessage(), 503);
  }

  const client = getOpenAIClient();

  try {
    const completion = await client.chat.completions.parse(
      {
        model: apiConfig.openai.model,
        temperature: 0.4,
        max_tokens: apiConfig.openai.maxTokens,
        response_format: zodResponseFormat(
          itineraryResponseSchema,
          "rovara_itinerary_response"
        ),
        messages: [
          {
            role: "system",
            content: buildItinerarySystemPrompt()
          },
          {
            role: "user",
            content: buildItineraryUserPrompt(request)
          }
        ]
      },
      {
        signal: AbortSignal.timeout(apiConfig.openai.timeoutMs)
      }
    );

    const message = completion.choices[0]?.message;

    if (message?.refusal) {
      throw new GenerateItineraryError(
        "The trip engine could not generate this itinerary. Please adjust the request and try again.",
        422
      );
    }

    const parsed = message?.parsed ?? message?.content ?? null;

    if (!parsed) {
      throw new GenerateItineraryError(
        "The trip engine returned an empty itinerary response.",
        502
      );
    }

    return parseItineraryResponse(parsed, request);
  } catch (error) {
    throw mapOpenAIError(error);
  }
}
