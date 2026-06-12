import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ shareToken: randomUUID() });
}
