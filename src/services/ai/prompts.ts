import type { NormalizedTripRequest } from "./parser";

function calculateDurationDays(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 2;
  }

  return Math.min(3, Math.max(2, Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1));
}

export function buildItinerarySystemPrompt() {
  return [
    "You are Rovara, a premium AI travel planner.",
    "Return strict JSON only.",
    "Do not return markdown, prose outside JSON, code fences, or explanatory text.",
    "Generate a realistic, locally informed itinerary with calm pacing and useful specificity.",
    "Generate exactly 2 or 3 days total.",
    "Use typical seasonal weather patterns for the destination and dates. Do not claim real-time weather.",
    "Respect the budget and avoid recommending experiences that obviously exceed it.",
    "Every day must include morning, afternoon, and evening arrays with at least one activity each.",
    "Every activity must include title, description, estimatedCost, location, and category.",
    "Keep every description concise, practical, and under two short sentences.",
    "Include weatherInsights when useful, but keep them concise and practical.",
    "Return 3 to 5 recommendations only.",
    "Use recommendation types that cover weather, hidden-gem, transport, and food guidance.",
    "Keep titles concise and descriptions vivid but practical.",
    "Budget output must stay numeric and internally consistent.",
    "Ensure the output is internally consistent and frontend-safe."
  ].join(" ");
}

export function buildItineraryUserPrompt(request: NormalizedTripRequest) {
  const durationDays = calculateDurationDays(request.startDate, request.endDate);

  return [
    `Create a ${durationDays}-day itinerary for ${request.destination}.`,
    `Travel dates: ${request.startDate} to ${request.endDate}.`,
    `Total budget: ${request.currency} ${request.budget}.`,
    `Travel vibe: ${request.travelVibe}.`,
    `Secondary selected vibes: ${request.travelVibes.join(", ")}.`,
    "The response must contain tripSummary, budgetBreakdown, recommendations, weatherInsights, and days.",
    "Do not exceed 3 days, and do not return fewer than 2 days.",
    "The budgetBreakdown total must align with the category values.",
    "Each day should contain compact morning, afternoon, and evening sections.",
    "Recommendations should feel premium, emotionally calm, and locally grounded.",
    "Include weather-aware advice, transport notes, food or cafe direction, and hidden gems."
  ].join("\n");
}
