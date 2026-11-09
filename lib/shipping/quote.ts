import { geocodeAddress } from "./geocode";
import {
  SHIPPING_ORIGIN,
  feeFromCityState,
  feeFromDistanceKm,
  haversineKm,
} from "./rates";

export type ShippingAddressInput = {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
};

export type ShippingQuote = {
  amount: number;
  currency: "NGN";
  label: string;
  method: "distance" | "city_fallback";
  distanceKm: number | null;
  origin: string;
  destination: string;
  quotedAt: string;
};

export async function quoteShipping(address: ShippingAddressInput): Promise<ShippingQuote> {
  const street = (address.street ?? "").trim();
  const city = (address.city ?? "").trim();
  const state = (address.state ?? "").trim();
  const country = (address.country ?? "Nigeria").trim() || "Nigeria";
  const destination = [street, city, state, country].filter(Boolean).join(", ");

  if (!city && !state && !street) {
    throw new Error("Enter a delivery address to calculate shipping");
  }

  const point = await geocodeAddress(destination);
  if (point) {
    const km = haversineKm(SHIPPING_ORIGIN, point);
    const priced = feeFromDistanceKm(km);
    return {
      amount: priced.fee,
      currency: "NGN",
      label: priced.label,
      method: "distance",
      distanceKm: priced.distanceKm,
      origin: SHIPPING_ORIGIN.label,
      destination: point.displayName ?? destination,
      quotedAt: new Date().toISOString(),
    };
  }

  const fallback = feeFromCityState(city, state, country);
  return {
    amount: fallback.fee,
    currency: "NGN",
    label: fallback.label,
    method: "city_fallback",
    distanceKm: null,
    origin: SHIPPING_ORIGIN.label,
    destination,
    quotedAt: new Date().toISOString(),
  };
}
