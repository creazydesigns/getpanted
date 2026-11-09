export type GeoPoint = { lat: number; lng: number; displayName?: string };

/**
 * Geocode an address. Prefers Google if GOOGLE_MAPS_API_KEY is set;
 * otherwise uses OpenStreetMap Nominatim (no key).
 */
export async function geocodeAddress(query: string): Promise<GeoPoint | null> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return null;

  const googleKey = process.env.GOOGLE_MAPS_API_KEY;
  if (googleKey) {
    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    url.searchParams.set("address", trimmed);
    url.searchParams.set("key", googleKey);
    url.searchParams.set("region", "ng");
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const json = (await res.json()) as {
      results?: { geometry?: { location?: { lat: number; lng: number } }; formatted_address?: string }[];
    };
    const hit = json.results?.[0];
    if (!hit?.geometry?.location) return null;
    return {
      lat: hit.geometry.location.lat,
      lng: hit.geometry.location.lng,
      displayName: hit.formatted_address,
    };
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", trimmed);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "ng");

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "GetPantedShipping/1.0 (https://getpanted.com)",
      Accept: "application/json",
    },
    cache: "force-cache",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { lat: string; lon: string; display_name?: string }[];
  const hit = json[0];
  if (!hit) return null;
  return {
    lat: Number(hit.lat),
    lng: Number(hit.lon),
    displayName: hit.display_name,
  };
}
