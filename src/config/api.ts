function readIntEnv(key: string, fallback: number) {
  const rawValue = process.env[key];

  if (!rawValue) {
    return fallback;
  }

  const parsed = Number.parseInt(rawValue, 10);

  return Number.isFinite(parsed) ? parsed : fallback;
}

export const apiConfig = {
  openai: {
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
    temperature: 0.4,
    maxTokens: readIntEnv("OPENAI_MAX_TOKENS", 2400),
    timeoutMs: readIntEnv("OPENAI_TIMEOUT_MS", 30_000)
  },
  openweather: {
    baseUrl: "https://api.openweathermap.org/data/2.5",
    units: "metric"
  },
  googlePlaces: {
    baseUrl: "https://maps.googleapis.com/maps/api/place"
  },
  mapbox: {
    style: "mapbox://styles/mapbox/dark-v11"
  }
};
