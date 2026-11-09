/** GetPanted office / fulfilment origin (Ipaja) — override via env if needed. */
export const SHIPPING_ORIGIN = {
  lat: Number(process.env.SHIPPING_ORIGIN_LAT ?? "6.609549"),
  lng: Number(process.env.SHIPPING_ORIGIN_LNG ?? "3.2672941"),
  // Keep this generic in API responses — do not publish the street/area publicly.
  label: process.env.SHIPPING_ORIGIN_LABEL ?? "Lagos fulfilment hub",
} as const;

/** Distance bands from origin (km → fee in Naira). Always charged — no free shipping. */
export const DISTANCE_BANDS: { upToKm: number; fee: number; label: string }[] = [
  { upToKm: 8, fee: 2500, label: "Local (within 8 km)" },
  { upToKm: 20, fee: 3500, label: "Metro (within 20 km)" },
  { upToKm: 40, fee: 5000, label: "Greater city (within 40 km)" },
  { upToKm: 80, fee: 7000, label: "Regional (within 80 km)" },
  { upToKm: 200, fee: 10000, label: "Statewide (within 200 km)" },
  { upToKm: 500, fee: 14000, label: "Interstate (within 500 km)" },
  { upToKm: Infinity, fee: 18000, label: "Long distance" },
];

/** When geocoding fails, fall back by city/state keywords. */
export const CITY_STATE_FALLBACKS: { match: RegExp; fee: number; label: string }[] = [
  { match: /\blagos\b/i, fee: 3500, label: "Lagos (estimate)" },
  { match: /\b(abuja|fct|federal capital)\b/i, fee: 6500, label: "Abuja (estimate)" },
  { match: /\b(port\s*harcourt|rivers)\b/i, fee: 9000, label: "Port Harcourt (estimate)" },
  { match: /\b(ibadan|oyo)\b/i, fee: 8000, label: "Ibadan (estimate)" },
  { match: /\b(enugu|anambra|imo|abia)\b/i, fee: 10000, label: "South East (estimate)" },
  { match: /\b(kano|kaduna|katsina)\b/i, fee: 12000, label: "North (estimate)" },
];

export const DEFAULT_NIGERIA_FEE = 10000;
export const INTERNATIONAL_FEE = 25000;
export const MIN_SHIPPING_FEE = 2500;

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function feeFromDistanceKm(km: number): { fee: number; label: string; distanceKm: number } {
  const band = DISTANCE_BANDS.find((b) => km <= b.upToKm) ?? DISTANCE_BANDS[DISTANCE_BANDS.length - 1];
  return {
    fee: Math.max(MIN_SHIPPING_FEE, band.fee),
    label: band.label,
    distanceKm: Math.round(km * 10) / 10,
  };
}

export function feeFromCityState(city: string, state: string, country: string): {
  fee: number;
  label: string;
} {
  const blob = `${city} ${state} ${country}`;
  if (country && !/nigeria|ng\b/i.test(country)) {
    return { fee: INTERNATIONAL_FEE, label: "International (estimate)" };
  }
  for (const row of CITY_STATE_FALLBACKS) {
    if (row.match.test(blob)) return { fee: row.fee, label: row.label };
  }
  return { fee: DEFAULT_NIGERIA_FEE, label: "Nigeria (estimate)" };
}
