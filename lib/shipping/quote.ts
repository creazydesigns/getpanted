import { classifyLagosZone } from "./rates";

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
  method: "flat_zone";
  zone: "island" | "mainland";
  distanceKm: null;
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

  const priced = classifyLagosZone(street, city, state);

  return {
    amount: priced.fee,
    currency: "NGN",
    label: priced.label,
    method: "flat_zone",
    zone: priced.zone,
    distanceKm: null,
    origin: "Lagos fulfilment hub",
    destination,
    quotedAt: new Date().toISOString(),
  };
}
