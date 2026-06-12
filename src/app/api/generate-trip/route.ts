import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isOpenAIConfigured } from "@/lib/openai";
import { z } from "zod";
import {
  generateStructuredItinerary,
  GenerateItineraryError
} from "@/services/ai/generate-itinerary";
import {
  toTripRequest,
  tripRequestSchema,
  type NormalizedTripRequest
} from "@/services/ai/parser";
import { generateMockItinerary } from "@/services/ai/mock-itinerary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const routeRequestSchema = z
  .object({
    destination: z.string().trim().min(2),
    startDate: z.string().trim().optional(),
    endDate: z.string().trim().optional(),
    dates: z
      .object({
        startDate: z.string().trim().min(1),
        endDate: z.string().trim().min(1)
      })
      .optional(),
    budget: z.coerce.number().positive(),
    travelVibe: z.string().trim().min(1).max(80).optional(),
    vibes: z.array(z.string().trim().min(1)).optional(),
    currency: z.string().trim().optional()
  })
  .transform((body) => ({
    destination: body.destination,
    startDate: body.startDate ?? body.dates?.startDate ?? "",
    endDate: body.endDate ?? body.dates?.endDate ?? "",
    budget: body.budget,
    travelVibe: body.travelVibe,
    vibes: body.vibes,
    currency: body.currency
  }));

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

function buildGenerationResponse(
  normalizedRequest: NormalizedTripRequest,
  options: {
    fallback?: boolean;
    fallbackReason?: string;
  } = {}
) {
  const itinerary = generateMockItinerary(normalizedRequest);

  return {
    id: `draft_${crypto.randomUUID()}`,
    trip: itinerary.trip,
    itinerary,
    days: itinerary.days ?? [],
    storage: "draft" as const,
    request: toTripRequest(normalizedRequest),
    fallback: options.fallback ?? false,
    fallbackReason: options.fallbackReason
  };
}

function buildSuccessfulGenerationResponse(
  normalizedRequest: NormalizedTripRequest,
  itinerary: Awaited<ReturnType<typeof generateStructuredItinerary>>,
  options: {
    fallback?: boolean;
    fallbackReason?: string;
  } = {}
) {
  return {
    id: `draft_${crypto.randomUUID()}`,
    trip: itinerary.trip,
    itinerary,
    days: itinerary.days ?? [],
    storage: "draft" as const,
    request: toTripRequest(normalizedRequest),
    fallback: options.fallback ?? false,
    fallbackReason: options.fallbackReason
  };
}

function shouldReturnFallback(error: unknown) {
  return (
    error instanceof GenerateItineraryError &&
    (error.status === 429 || error.status >= 500)
  );
}

function getFallbackReason(error: unknown) {
  if (error instanceof GenerateItineraryError && error.message) {
    return error.message;
  }

  return "Trip generation could not be completed by the AI engine.";
}

function fallbackJson(normalizedRequest: NormalizedTripRequest, error: unknown) {
  try {
    return NextResponse.json(buildGenerationResponse(normalizedRequest, {
      fallback: true,
      fallbackReason: getFallbackReason(error)
    }), {
      status: 201,
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch {
    return json(
      {
        error:
          "The trip engine is temporarily unavailable. Please try again shortly."
      },
      503
    );
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  const useDraftMode =
    process.env.NODE_ENV !== "production" &&
    !isOpenAIConfigured();

  if (!userId && !useDraftMode) {
    return json({ error: "You need to sign in before generating a trip." }, 401);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Unable to read the trip request." }, 400);
  }

  const routeParsed = routeRequestSchema.safeParse(body);

  if (!routeParsed.success) {
    const issue = routeParsed.error.issues[0];
    return json(
      { error: issue?.message || "Trip details are incomplete." },
      400
    );
  }

  const parsed = tripRequestSchema.safeParse(routeParsed.data);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return json(
      { error: issue?.message || "Trip details are incomplete." },
      400
    );
  }

  if (useDraftMode) {
    try {
      const normalizedRequest = parsed.data;
      const itinerary = isOpenAIConfigured()
        ? await generateStructuredItinerary(normalizedRequest)
        : generateMockItinerary(normalizedRequest);

      return NextResponse.json(
        buildSuccessfulGenerationResponse(normalizedRequest, itinerary),
        {
          status: 201,
          headers: {
            "Cache-Control": "no-store"
          }
        }
      );
    } catch (error) {
      return fallbackJson(parsed.data, error);
    }
  }

  if (!userId) {
    return json({ error: "You need to sign in before generating a trip." }, 401);
  }

  try {
    const normalizedRequest = parsed.data;
    const itinerary = await generateStructuredItinerary(normalizedRequest);

    return NextResponse.json(
      buildSuccessfulGenerationResponse(normalizedRequest, itinerary),
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (error) {
    if (shouldReturnFallback(error)) {
      return fallbackJson(parsed.data, error);
    }

    const rawMessage = error instanceof Error ? error.message : "";
    const status =
      error instanceof GenerateItineraryError
        ? error.status
        : 500;
    const message =
      rawMessage || "Trip generation could not be completed.";

    return json({ error: message }, status);
  }
}
