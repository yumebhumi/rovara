import type { GenerateItineraryInput, GenerateItineraryResponse } from "@/types";
import { generateStructuredItinerary } from "./ai/generate-itinerary";
import { buildTripRequestFromGenerateInput } from "./ai/parser";

export async function generateItinerary(
  input: GenerateItineraryInput
): Promise<GenerateItineraryResponse> {
  return generateStructuredItinerary(buildTripRequestFromGenerateInput(input));
}
