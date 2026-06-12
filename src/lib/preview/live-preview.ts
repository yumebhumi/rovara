import type { BudgetBreakdown, ItineraryDay } from "@/types";
import type {
  AccommodationPreference,
  TransportationPreference,
  TripGenerationInterest,
  TripGenerationTravelType
} from "@/types/forms";
import type { MapPoint } from "@/components/map";
import type { TripFormValues } from "@/lib/validations/trip-schema";
import {
  formatTripVibeSelection,
  getPreferencesForTripVibes,
  normalizeTripVibes
} from "@/lib/trip-vibes";

type DestinationPreset = {
  title: string;
  description: string;
  highlights: string[];
  vibeTags: string[];
  quickFacts: Array<{ label: string; value: string }>;
  gradient: string;
  imageUrl: string;
  country: string;
  weatherBase: { current: number; condition: string; accent: string };
  points: MapPoint[];
};

export type PreviewWeatherDay = {
  label: string;
  tempC: number;
  condition: string;
};

export type PreviewSuggestion = {
  title: string;
  message: string;
  tone: "weather" | "budget" | "route" | "crowd" | "ai";
};

export type LivePreviewData = {
  summary: {
    destination: string;
    startDate: string;
    endDate: string;
    durationDays: number;
    travelVibe: string;
    interests: string[];
    accommodationPreference: string;
    transportationPreference: string;
  };
  destination: {
    title: string;
    description: string;
    highlights: string[];
    vibeTags: string[];
    quickFacts: Array<{ label: string; value: string }>;
    gradient: string;
    imageUrl: string;
    country: string;
  };
  cost: BudgetBreakdown;
  weather: {
    currentTempC: number;
    currentCondition: string;
    insight: string;
    warning?: string;
    accent: string;
    forecast: PreviewWeatherDay[];
  };
  suggestions: PreviewSuggestion[];
  map: {
    points: MapPoint[];
  };
};

const DESTINATION_PRESETS: Record<string, DestinationPreset> = {
  tokyo: {
    title: "Tokyo",
    description: "Hyper-modern neighborhoods, precise transit, and calm shrine moments layered into one dense urban rhythm.",
    highlights: ["Shibuya", "Senso-ji", "teamLab", "Tsukiji"],
    vibeTags: ["Neon city", "Design-forward", "Late-night energy"],
    quickFacts: [
      { label: "Best pace", value: "Fast + efficient" },
      { label: "Ideal stay", value: "Shibuya or Ginza" },
      { label: "Transit", value: "Metro-dominant" }
    ],
    gradient: "from-[#142f39] via-[#1F4E5F] to-[#28414a]",
    imageUrl:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80",
    country: "Japan",
    weatherBase: { current: 22, condition: "Clear", accent: "from-[#2F6F73] to-[#6E8B83]" },
    points: [
      { lat: 35.6764, lng: 139.65, label: "Tokyo Core", category: "city" },
      { lat: 35.6595, lng: 139.7005, label: "Shibuya", category: "district" },
      { lat: 35.7148, lng: 139.7967, label: "Asakusa", category: "landmark" }
    ]
  },
  paris: {
    title: "Paris",
    description: "Elegant boulevards, museum density, and café pacing tuned for slow premium exploration.",
    highlights: ["Le Marais", "Louvre", "Montmartre", "Seine"],
    vibeTags: ["Romantic", "Cultural", "Walkable"],
    quickFacts: [
      { label: "Best pace", value: "Slow + curated" },
      { label: "Ideal stay", value: "Le Marais" },
      { label: "Transit", value: "Metro + walking" }
    ],
    gradient: "from-[#253640] via-[#2f5561] to-[#6e8b83]",
    imageUrl:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=80",
    country: "France",
    weatherBase: { current: 18, condition: "Partly cloudy", accent: "from-[#C6AF8A] to-[#F4EDE1]" },
    points: [
      { lat: 48.8566, lng: 2.3522, label: "Paris Centre", category: "city" },
      { lat: 48.8606, lng: 2.3376, label: "Louvre", category: "landmark" },
      { lat: 48.8867, lng: 2.3431, label: "Montmartre", category: "district" }
    ]
  },
  bali: {
    title: "Bali",
    description: "Resort calm, surf energy, and lush inland escapes blended into a slower tropical arc.",
    highlights: ["Ubud", "Canggu", "Uluwatu", "Seminyak"],
    vibeTags: ["Tropical", "Wellness", "Scenic"],
    quickFacts: [
      { label: "Best pace", value: "Slow + immersive" },
      { label: "Ideal stay", value: "Split coast + inland" },
      { label: "Transit", value: "Driver or scooter" }
    ],
    gradient: "from-[#203E42] via-[#2F6F73] to-[#A88D69]",
    imageUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80",
    country: "Indonesia",
    weatherBase: { current: 29, condition: "Humid", accent: "from-[#2F6F73] to-[#A8BBB1]" },
    points: [
      { lat: -8.4095, lng: 115.1889, label: "Bali", category: "island" },
      { lat: -8.5069, lng: 115.2625, label: "Ubud", category: "district" },
      { lat: -8.8291, lng: 115.0849, label: "Uluwatu", category: "coast" }
    ]
  },
  lisbon: {
    title: "Lisbon",
    description: "Sunlit hills, tiled facades, tram routes, and a slower Atlantic city rhythm made for relaxed wandering.",
    highlights: ["Alfama", "Bairro Alto", "Belem", "LX Factory"],
    vibeTags: ["Coastal city", "Golden light", "Walkable"],
    quickFacts: [
      { label: "Best pace", value: "Slow + scenic" },
      { label: "Ideal stay", value: "Chiado or Alfama" },
      { label: "Transit", value: "Trams + walking" }
    ],
    gradient: "from-[#29424a] via-[#3b6870] to-[#9e8b6f]",
    imageUrl:
      "https://images.unsplash.com/photo-1513735492246-483525079686?auto=format&fit=crop&w=1600&q=80",
    country: "Portugal",
    weatherBase: { current: 23, condition: "Sunny", accent: "from-[#2F6F73] to-[#C6AF8A]" },
    points: [
      { lat: 38.7223, lng: -9.1393, label: "Lisbon Centre", category: "city" },
      { lat: 38.711, lng: -9.1303, label: "Alfama", category: "district" },
      { lat: 38.6979, lng: -9.206, label: "Belem", category: "landmark" }
    ]
  },
  seoul: {
    title: "Seoul",
    description: "A high-energy mix of design, food streets, palace grounds, and late-night neighborhoods with precise city flow.",
    highlights: ["Myeongdong", "Bukchon", "Hongdae", "Gyeongbokgung"],
    vibeTags: ["Modern city", "Food-led", "Night energy"],
    quickFacts: [
      { label: "Best pace", value: "Fast + flexible" },
      { label: "Ideal stay", value: "Myeongdong or Seongsu" },
      { label: "Transit", value: "Metro-dominant" }
    ],
    gradient: "from-[#1d3038] via-[#365964] to-[#685f70]",
    imageUrl:
      "https://images.unsplash.com/photo-1538485399081-7c897c863b1b?auto=format&fit=crop&w=1600&q=80",
    country: "South Korea",
    weatherBase: { current: 20, condition: "Clear", accent: "from-[#2F6F73] to-[#6E8B83]" },
    points: [
      { lat: 37.5665, lng: 126.978, label: "Seoul Core", category: "city" },
      { lat: 37.5826, lng: 126.983, label: "Bukchon", category: "district" },
      { lat: 37.5563, lng: 126.922, label: "Hongdae", category: "district" }
    ]
  },
  marrakech: {
    title: "Marrakech",
    description: "Ochre walls, riad courtyards, market energy, and desert warmth layered into a vivid slower-paced escape.",
    highlights: ["Medina", "Jemaa el-Fnaa", "Majorelle Garden", "Bahia Palace"],
    vibeTags: ["Atmospheric", "Textured", "Story-rich"],
    quickFacts: [
      { label: "Best pace", value: "Curated + immersive" },
      { label: "Ideal stay", value: "Medina riad" },
      { label: "Transit", value: "Walking + short taxis" }
    ],
    gradient: "from-[#3b2a23] via-[#805642] to-[#b88a63]",
    imageUrl:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1600&q=80",
    country: "Morocco",
    weatherBase: { current: 27, condition: "Warm", accent: "from-[#8a5a44] to-[#d4b08b]" },
    points: [
      { lat: 31.6295, lng: -7.9811, label: "Marrakech", category: "city" },
      { lat: 31.6258, lng: -7.9891, label: "Medina", category: "district" },
      { lat: 31.6416, lng: -8.0054, label: "Majorelle", category: "landmark" }
    ]
  }
};

const DEFAULT_PRESET: DestinationPreset = {
  title: "Your next destination",
  description: "A premium AI-curated route with balanced pacing, smarter movement, and more intentional stays.",
  highlights: ["Local highlights", "Signature dining", "Scenic route", "Hidden corners"],
  vibeTags: ["Adaptive", "Curated", "AI-optimized"],
  quickFacts: [
    { label: "Best pace", value: "Balanced" },
    { label: "Ideal stay", value: "Central district" },
    { label: "Transit", value: "Multi-modal" }
  ],
  gradient: "from-[#0B2E2B] via-[#1F4E5F] to-[#355C5A]",
  imageUrl:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
  country: "Custom route",
  weatherBase: { current: 24, condition: "Pleasant", accent: "from-[#2F6F73] to-[#F4EDE1]" },
  points: [{ lat: 35.6764, lng: 139.65, label: "Preview marker", category: "preview" }]
};

function normalizeDestinationKey(destination: string) {
  return destination.trim().toLowerCase();
}

function toDisplayDestinationTitle(destination: string) {
  return destination
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildDestinationImageUrl(destination: string) {
  const query = encodeURIComponent(`${destination},travel`);
  return `https://source.unsplash.com/1600x900/?${query}`;
}

function inferCountryLabel(destination: string) {
  const parts = destination
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length > 1) {
    return parts[parts.length - 1];
  }

  return "World";
}

function resolveDestinationPreset(destination: string) {
  const normalized = normalizeDestinationKey(destination);

  for (const [key, preset] of Object.entries(DESTINATION_PRESETS)) {
    if (normalized.includes(key)) return preset;
  }

  const title = destination ? toDisplayDestinationTitle(destination) : DEFAULT_PRESET.title;

  return {
    ...DEFAULT_PRESET,
    title,
    description: destination
      ? `A cinematic first look at ${title}, shaped into a calmer AI-planned route with better pacing and clearer focus.`
      : DEFAULT_PRESET.description,
    imageUrl: destination ? buildDestinationImageUrl(title) : DEFAULT_PRESET.imageUrl,
    country: destination ? inferCountryLabel(title) : DEFAULT_PRESET.country,
    points: []
  };
}

function resolveDurationDays(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1);
}

function hashString(value: string) {
  return Array.from(value).reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function deriveWeatherForecast(baseTemp: number, destination: string): PreviewWeatherDay[] {
  const conditions = ["Clear", "Cloudy", "Light rain", "Breezy"] as const;
  const seed = hashString(destination || "preview");
  return ["Tue", "Wed", "Thu"].map((label, index) => ({
    label,
    tempC: baseTemp + ((seed + index) % 5) - 1,
    condition: conditions[(seed + index) % conditions.length]
  }));
}

function percentageForAccommodation(value: AccommodationPreference) {
  switch (value) {
    case "Luxury Stays":
      return 0.42;
    case "Resorts":
      return 0.38;
    case "Hotels":
      return 0.33;
    case "Airbnb":
      return 0.3;
    case "Hostels":
      return 0.18;
  }
}

function percentageForTransport(value: TransportationPreference) {
  switch (value) {
    case "Flights":
      return 0.21;
    case "Rental Cars":
      return 0.19;
    case "Trains":
      return 0.14;
    case "Public Transport":
      return 0.11;
    case "Walking":
      return 0.06;
  }
}

function roundBudget(value: number) {
  return Math.round(value / 10) * 10;
}

function deriveCostBreakdown(
  budget: number,
  accommodationPreference: AccommodationPreference,
  transportationPreference: TransportationPreference
): BudgetBreakdown {
  const accommodation = roundBudget(
    budget * percentageForAccommodation(accommodationPreference)
  );
  const transportation = roundBudget(
    budget * percentageForTransport(transportationPreference)
  );
  const food = roundBudget(budget * 0.22);
  const activities = Math.max(0, budget - accommodation - transportation - food);

  return {
    accommodation,
    food,
    activities,
    transportation,
    shopping: 0,
    miscellaneous: 0,
    total: accommodation + transportation + food + activities
  };
}

function deriveWeatherInsight(
  travelType: TripGenerationTravelType,
  interests: TripGenerationInterest[],
  currentCondition: string
) {
  if (currentCondition.toLowerCase().includes("rain")) {
    return "Rain expected Thursday. Indoor attractions recommended.";
  }

  if (interests.includes("Photography")) {
    return "Golden-hour windows look strong. Plan photo-heavy blocks near sunrise and sunset.";
  }

  if (travelType === "Luxury") {
    return "Stable conditions support more open-air dining and rooftop reservations.";
  }

  return "Weather conditions are favorable for a balanced outdoor itinerary.";
}

function deriveWarning(
  transportationPreference: TransportationPreference,
  currentCondition: string
) {
  if (transportationPreference === "Walking" && currentCondition.toLowerCase().includes("rain")) {
    return "Walking-heavy plans may need indoor route alternatives.";
  }

  if (transportationPreference === "Rental Cars") {
    return "Account for parking and pickup buffers in dense city centers.";
  }

  return undefined;
}

function buildSuggestionSet(
  values: Partial<TripFormValues>,
  interests: TripGenerationInterest[],
  transportationPreference: TransportationPreference,
  previewCost: BudgetBreakdown,
  days?: ItineraryDay[] | null
): PreviewSuggestion[] {
  const suggestions: PreviewSuggestion[] = [];

  if (values.budget && previewCost.accommodation > values.budget * 0.36) {
    suggestions.push({
      title: "Budget optimization",
      message: "Switching to a slightly more central mid-tier stay could unlock more activity budget.",
      tone: "budget"
    });
  }

  if (interests.includes("Culture")) {
    suggestions.push({
      title: "Crowd-aware routing",
      message: "Visit temples before 8AM to avoid crowds and keep the afternoon open for slower neighborhoods.",
      tone: "crowd"
    });
  }

  if (transportationPreference === "Public Transport") {
    suggestions.push({
      title: "Transit-first route",
      message: "Cluster nearby districts on the same day to reduce transfer overhead and improve pacing.",
      tone: "route"
    });
  }

  if (interests.includes("Food")) {
    suggestions.push({
      title: "Dining intelligence",
      message: "Reserve one signature dinner early and leave one flex meal slot for local discoveries.",
      tone: "ai"
    });
  }

  if (days?.[0]?.activities?.[0]?.title) {
    suggestions.push({
      title: "Generated anchor",
      message: `${days[0].activities[0].title} is currently anchoring your first-day flow.`,
      tone: "ai"
    });
  }

  return suggestions.slice(0, 4);
}

function resolveMapPoints(
  preset: DestinationPreset,
  days?: ItineraryDay[] | null
): MapPoint[] {
  const generated = days
    ?.flatMap((day) => day.activities)
    .map((activity) => ({
      coordinates: activity.coordinates ??
        (typeof activity.location?.lat === "number" &&
        typeof activity.location?.lng === "number"
          ? { lat: activity.location.lat, lng: activity.location.lng }
          : null),
      title: activity.title,
      category: activity.category
    }))
    .filter((activity) => Boolean(activity.coordinates))
    .map((activity) => ({
      lat: activity.coordinates!.lat,
      lng: activity.coordinates!.lng,
      label: activity.title,
      category: activity.category
    }));

  return generated && generated.length > 0 ? generated : preset.points;
}

export function deriveLivePreview(
  values: Partial<TripFormValues>,
  days?: ItineraryDay[] | null
): LivePreviewData {
  const vibes = normalizeTripVibes(values.vibes);
  const preferences = getPreferencesForTripVibes(vibes);
  const preset = resolveDestinationPreset(values.destination ?? "");
  const durationDays = resolveDurationDays(values.startDate, values.endDate);
  const cost = deriveCostBreakdown(
    values.budget ?? 2200,
    preferences.accommodationPreference,
    preferences.transportationPreference
  );
  const currentTempC = preset.weatherBase.current + (hashString(values.destination ?? preset.title) % 3);
  const forecast = deriveWeatherForecast(currentTempC, values.destination ?? preset.title);
  const insight = deriveWeatherInsight(
    preferences.travelType,
    preferences.interests,
    forecast[1]?.condition ?? preset.weatherBase.condition
  );
  const warning = deriveWarning(
    preferences.transportationPreference,
    forecast[1]?.condition ?? preset.weatherBase.condition
  );

  return {
    summary: {
      destination: values.destination || preset.title,
      startDate: values.startDate || "",
      endDate: values.endDate || "",
      durationDays,
      travelVibe: formatTripVibeSelection(vibes),
      interests: preferences.interests,
      accommodationPreference: preferences.accommodationPreference,
      transportationPreference: preferences.transportationPreference
    },
    destination: {
      title: values.destination || preset.title,
      description: preset.description,
      highlights: preset.highlights,
      vibeTags: [
        ...preset.vibeTags,
        ...preferences.interests.slice(0, 2)
      ].slice(0, 4),
      quickFacts: preset.quickFacts,
      gradient: preset.gradient,
      imageUrl: preset.imageUrl,
      country: preset.country
    },
    cost,
    weather: {
      currentTempC,
      currentCondition: preset.weatherBase.condition,
      insight,
      warning,
      accent: preset.weatherBase.accent,
      forecast
    },
    suggestions: buildSuggestionSet(
      values,
      preferences.interests,
      preferences.transportationPreference,
      cost,
      days
    ),
    map: {
      points: resolveMapPoints(preset, days)
    }
  };
}
