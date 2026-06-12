import { NextResponse } from "next/server";
import { getPlaces } from "@/services/maps";

export async function GET(request: Request) {
  const destination = new URL(request.url).searchParams.get("destination") || "Tokyo";
  return NextResponse.json(await getPlaces(destination));
}
