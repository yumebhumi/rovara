import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedApiUser } from "@/lib/auth/api";
import { publicPersistedTripSchema } from "@/lib/validations/itinerary-schema";
import { deleteTrip, getTripById } from "@/services/trips";

const tripParamsSchema = z.object({
  id: z.string().trim().min(1)
});

function logRouteError(scope: string, error: unknown) {
  console.error(scope, error);
}

async function resolveTripId(params: Promise<{ id: string }>) {
  return tripParamsSchema.safeParse(await params);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedApiUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paramsResult = await resolveTripId(context.params);

  if (!paramsResult.success) {
    return NextResponse.json({ error: "Invalid trip identifier." }, { status: 400 });
  }

  try {
    const trip = await getTripById(paramsResult.data.id, user.clerkId);

    if (!trip) {
      return NextResponse.json({ error: "Trip not found." }, { status: 404 });
    }

    return NextResponse.json(publicPersistedTripSchema.parse(trip), {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store, max-age=0"
      }
    });
  } catch (error) {
    logRouteError("Unable to load trip", error);
    return NextResponse.json(
      { error: "This trip could not be loaded right now. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedApiUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paramsResult = await resolveTripId(context.params);

  if (!paramsResult.success) {
    return NextResponse.json({ error: "Invalid trip identifier." }, { status: 400 });
  }

  try {
    const result = await deleteTrip(paramsResult.data.id, user.clerkId);

    if (!result.deleted) {
      return NextResponse.json({ error: "Trip not found." }, { status: 404 });
    }

    return NextResponse.json({
      deleted: true,
      id: paramsResult.data.id
    });
  } catch (error) {
    logRouteError("Unable to delete trip", error);
    return NextResponse.json(
      { error: "Unable to delete this trip right now. Please try again." },
      { status: 500 }
    );
  }
}
