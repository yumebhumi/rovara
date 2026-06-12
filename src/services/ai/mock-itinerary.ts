import { ActivityCategory } from "@/types/itinerary";
import { getPreferencesForTripVibes } from "@/lib/trip-vibes";
import type { FullItineraryResponse } from "@/types";
import { parseItineraryResponse, type NormalizedTripRequest } from "./parser";

const MORNING_TITLES = [
  "Settle into the neighborhood",
  "Morning district walk",
  "Local market pass",
  "Historic quarter opening hour",
  "Riverside or garden start",
  "Design-forward neighborhood loop"
] as const;

const AFTERNOON_TITLES = [
  "Signature cultural stop",
  "Long lunch nearby",
  "Museum or gallery window",
  "Slow cafe break",
  "Local craft or concept store detour",
  "Scenic mid-day route"
] as const;

const EVENING_TITLES = [
  "Golden-hour route",
  "Dinner with local character",
  "Laneway or quiet street wander",
  "Night market or tasting stop",
  "Viewpoint close",
  "Soft final neighborhood pass"
] as const;

const WEATHER_VARIATIONS = [
  "Clearer morning light with comfortable walking conditions and a gentler evening pace.",
  "Mild conditions with a softer afternoon window suited to cafes, museums, or slower wandering.",
  "Warm and walkable weather with the best outdoor light arriving before lunch.",
  "Softer skies later in the day, making the early evening better for neighborhood wandering than long transfers."
] as const;

const TRANSPORTATION_VARIATIONS = [
  "Reduce backtracking by clustering the day around one core district.",
  "Keep the route compact and let one transit hop set the rhythm for the day.",
  "Use one main transfer early, then finish the day mostly on foot.",
  "Avoid cross-city zigzags and let the afternoon unfold within one neighborhood."
] as const;

const FOOD_VARIATIONS = [
  "Choose one local breakfast spot before the city fully fills out.",
  "Make lunch the slower meal and keep dinner flexible around the neighborhood energy.",
  "Leave one cafe stop unbooked so the day can absorb a local recommendation naturally.",
  "Balance one signature meal with one smaller counter or pastry stop."
] as const;

const HIDDEN_GEM_VARIATIONS = [
  "Ask a host or cafe team for one nearby lane, courtyard, or market pocket.",
  "Prefer one quieter side street between major stops.",
  "Trade one headline stop for a smaller neighborhood detail with local character.",
  "Keep fifteen quiet minutes unscheduled for an accidental find."
] as const;

function calculateDurationDays(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 2;
  }

  return Math.min(3, Math.max(2, Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1));
}

function roundBudget(value: number) {
  return Math.round(value / 10) * 10;
}

function buildBudgetBreakdown(totalBudget: number) {
  const accommodation = roundBudget(totalBudget * 0.36);
  const food = roundBudget(totalBudget * 0.22);
  const transportation = roundBudget(totalBudget * 0.14);
  const activities = Math.max(0, totalBudget - accommodation - food - transportation);

  return {
    accommodation,
    food,
    transportation,
    activities,
    shopping: 0,
    miscellaneous: 0,
    total: accommodation + food + transportation + activities
  };
}

function createActivity(
  title: string,
  description: string,
  estimatedCost: number,
  location: string,
  category: ActivityCategory
) {
  return {
    title,
    description,
    estimatedCost,
    location,
    category
  };
}

function pickByDay<T>(items: readonly T[], index: number) {
  return items[index % items.length];
}

export function generateMockItinerary(
  request: NormalizedTripRequest
): FullItineraryResponse {
  const durationDays = calculateDurationDays(request.startDate, request.endDate);
  const preferences = getPreferencesForTripVibes(request.travelVibes);
  const budgetBreakdown = buildBudgetBreakdown(request.budget);

  const rawResponse = {
    tripSummary: {
      destination: request.destination,
      duration: `${durationDays} ${durationDays === 1 ? "day" : "days"}`,
      travelVibe: request.travelVibe,
      summary: `${request.destination} shaped as a calm ${request.travelVibe.toLowerCase()} journey with grounded local pacing, balanced spending, and a few memorable quieter moments each day.`
    },
    budgetBreakdown,
    recommendations: [
      {
        title: "Best light, first",
        description: `Start outdoor highlights early in ${request.destination} and shift to slower neighborhood time after lunch.`,
        type: "weather"
      },
      {
        title: "Layer in one hidden detour",
        description: "Leave one open hour each afternoon for a lane, courtyard, market corner, or smaller local recommendation.",
        type: "hidden-gem"
      },
      {
        title: "Keep transit simple",
        description: `Use ${preferences.transportationPreference.toLowerCase()} as the main rhythm so the route stays easy to follow and low-friction.`,
        type: "transport"
      },
      {
        title: "Build the food story slowly",
        description: "Mix one signature meal, one lighter cafe stop, and one unplanned local counter each day instead of overbooking dining.",
        type: "food"
      }
    ],
    weatherInsights: [
      {
        condition: "Clear",
        temperature: 24,
        recommendation:
          "Plan the longest outdoor walks earlier in the day, then let cafes and slower neighborhood stretches absorb the afternoon heat.",
        precipitationChance: 10,
        bestTimeToVisit: "Morning"
      }
    ],
    days: Array.from({ length: durationDays }, (_, index) => {
      const day = index + 1;
      const dayBudget = Math.max(0, roundBudget(request.budget / durationDays));

      return {
        day,
        title:
          day === 1
            ? `Arrival and first feel of ${request.destination}`
            : day === durationDays
              ? `Final day and graceful close`
              : day % 3 === 0
                ? `Local rhythm and quieter corners`
                : `A slower ${request.destination} day`,
        weatherSummary: pickByDay(WEATHER_VARIATIONS, index),
        transportationNotes: [
          `${pickByDay(TRANSPORTATION_VARIATIONS, index)} Use ${preferences.transportationPreference.toLowerCase()} as the backbone when needed.`,
          "Keep transfers short and group nearby stops into one neighborhood arc."
        ],
        foodSuggestions: [
          pickByDay(FOOD_VARIATIONS, index),
          "Book dinner loosely enough to follow the energy of the area instead of forcing the evening."
        ],
        hiddenGems: [
          pickByDay(HIDDEN_GEM_VARIATIONS, index),
          "Prefer one quieter side street between major stops."
        ],
        morning: [
          createActivity(
            pickByDay(MORNING_TITLES, index),
            `Begin with a grounded walk through one of ${request.destination}'s more atmospheric areas and let the place reveal its pace naturally.`,
            Math.max(0, roundBudget(dayBudget * 0.14)),
            `${request.destination} old quarter`,
            ActivityCategory.CULTURE
          ),
          createActivity(
            day % 2 === 0 ? "Coffee and local bearings" : "Breakfast with neighborhood flow",
            "Pause at a smaller cafe to reset the route, note nearby streets, and ease into the day without rushing the schedule.",
            Math.max(0, roundBudget(dayBudget * 0.08)),
            `${request.destination} neighborhood cafe`,
            ActivityCategory.FOOD
          )
        ],
        afternoon: [
          createActivity(
            pickByDay(AFTERNOON_TITLES, index),
            "Spend the middle of the day on one strong anchor experience rather than trying to cover too many headline stops.",
            Math.max(0, roundBudget(dayBudget * 0.22)),
            `${request.destination} landmark district`,
            ActivityCategory.ADVENTURE
          ),
          createActivity(
            day % 2 === 0 ? "Long lunch nearby" : "Unhurried local lunch",
            "Keep lunch within walking range so the itinerary stays calm and the day does not fracture into long transit hops.",
            Math.max(0, roundBudget(dayBudget * 0.16)),
            `${request.destination} local dining street`,
            ActivityCategory.FOOD
          )
        ],
        evening: [
          createActivity(
            pickByDay(EVENING_TITLES, index),
            "Use the early evening for the most photogenic stretch of the day, with a shorter route and room to linger.",
            Math.max(0, roundBudget(dayBudget * 0.1)),
            `${request.destination} scenic viewpoint`,
            ActivityCategory.NATURE
          ),
          createActivity(
            day % 2 === 0 ? "Dinner with local character" : "Neighborhood dinner close",
            "Close with one place that feels rooted in the neighborhood instead of a checklist-driven final stop.",
            Math.max(0, roundBudget(dayBudget * 0.18)),
            `${request.destination} dinner address`,
            ActivityCategory.FOOD
          )
        ]
      };
    })
  };

  return parseItineraryResponse(rawResponse, request);
}
