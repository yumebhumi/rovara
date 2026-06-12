import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "PDF export endpoint ready for react-pdf integration." });
}
