import { NextResponse } from "next/server";
import { generateItinerary } from "@/services/openai";
import { isSupportedCurrency } from "@/lib/currency";
import { tripGenerationSchema } from "@/lib/validations/trip-generation";

export async function POST(request: Request) {
  const body = await request.json();

  const parsed = tripGenerationSchema.safeParse({
    destination: body.destination,
    startDate: body.startDate,
    endDate: body.endDate,
    budget: Number(body.budget ?? 0),
    travelType: body.travelType,
    interests: Array.isArray(body.interests) ? body.interests : [],
    accommodationPreference: body.accommodationPreference,
    transportationPreference: body.transportationPreference
  });

  if (!parsed.success || !isSupportedCurrency(body.currency)) {
    return NextResponse.json({ error: "Invalid trip input" }, { status: 400 });
  }

  try {
    const itinerary = await generateItinerary({
      ...parsed.data,
      currency: body.currency
    });
    return NextResponse.json(itinerary);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Trip generation could not be completed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
