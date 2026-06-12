import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedApiUser } from "@/lib/auth/api";
import {
  getTripsResponseSchema,
  saveTripRequestSchema,
  saveTripResponseSchema
} from "@/lib/validations/itinerary-schema";
import { getTripsPage, saveTrip } from "@/services/trips";

const tripsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional()
});

function logRouteError(scope: string, error: unknown) {
  console.error(scope, error);
}

export async function GET(request: Request) {
  const user = await getAuthenticatedApiUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const queryResult = tripsQuerySchema.safeParse({
    page: searchParams.get("page") ?? undefined,
    pageSize: searchParams.get("pageSize") ?? undefined
  });

  if (!queryResult.success) {
    return NextResponse.json({ error: "Invalid query parameters." }, { status: 400 });
  }

  try {
    const result = await getTripsPage(user.clerkId, queryResult.data);
    const payload = {
      trips: result.items,
      total: result.total
    };

    return NextResponse.json(getTripsResponseSchema.parse(payload));
  } catch (error) {
    logRouteError("Unable to load trips", error);
    return NextResponse.json(
      { error: "Saved trips are temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await getAuthenticatedApiUser();

  if (!user) {
    return NextResponse.json({ error: "Please sign in to save trips." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Unable to read trip payload." }, { status: 400 });
  }

  const parsed = saveTripRequestSchema.safeParse(body);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue?.message ?? "Invalid trip payload." },
      { status: 400 }
    );
  }

  try {
    const trip = await saveTrip(
      {
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        imageUrl: user.imageUrl
      },
      parsed.data
    );
    return NextResponse.json(
      saveTripResponseSchema.parse({
        trip,
        saved: true
      }),
      {
        status: 201,
        headers: {
          "Cache-Control": "private, no-store, max-age=0"
        }
      }
    );
  } catch (error) {
    logRouteError("Unable to save trip", error);
    return NextResponse.json(
      { error: "Unable to save this trip right now. Please try again." },
      { status: 500 }
    );
  }
}
