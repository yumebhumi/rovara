export type Place = {
  name: string;
  lat: number;
  lng: number;
  category?: string;
  rating?: number;
  country?: string;
  imageUrl?: string;
  description?: string;
};

async function getWikipediaSummary(query: string) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`,
      {
        headers: {
          "Accept-Language": "en"
        },
        cache: "no-store"
      }
    );

    if (!response.ok) return null;

    const payload = (await response.json()) as {
      title?: string;
      description?: string;
      extract?: string;
      thumbnail?: { source?: string };
      originalimage?: { source?: string };
    };

    return {
      title: payload.title,
      description: payload.description || payload.extract,
      imageUrl: payload.originalimage?.source || payload.thumbnail?.source
    };
  } catch {
    return null;
  }
}

export async function getPlaces(destination: string): Promise<Place[]> {
  if (!destination.trim()) {
    return [];
  }

  if (!process.env.GOOGLE_PLACES_API_KEY) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(destination)}`,
        {
          headers: {
            "Accept-Language": "en"
          },
          cache: "no-store"
        }
      );

      if (response.ok) {
        const results = (await response.json()) as Array<{
          lat: string;
          lon: string;
          name?: string;
          display_name?: string;
        }>;

        const topResult = results[0];

        if (topResult) {
          const parts = (topResult.display_name ?? "")
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean);
          const lookupTerm = topResult.name || destination.split(",")[0]?.trim() || destination;
          const wiki = await getWikipediaSummary(lookupTerm);

          return [
            {
              name: wiki?.title || topResult.name || parts[0] || destination,
              lat: Number(topResult.lat),
              lng: Number(topResult.lon),
              category: "city",
              country: parts.at(-1),
              imageUrl: wiki?.imageUrl,
              description: wiki?.description
            }
          ];
        }
      }
    } catch {
      return [];
    }

    return [];
  }

  // Full Google Places API integration can be wired here
  return [];
}
