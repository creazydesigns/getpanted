/** Flat Lagos delivery rates — charged on every order. */
export const MAINLAND_FEE = 4000;
export const ISLAND_FEE = 6000;

export const MAINLAND_LABEL = "Lagos Mainland";
export const ISLAND_LABEL = "Lagos Island";

/**
 * Lagos Island / Lekki axis keywords.
 * Matched against street + city + state. Everything else quotes as Mainland.
 */
const ISLAND_MATCH =
  /\b(lekki|victoria\s*island|\bvi\b|ikoyi|ajah|banana\s*island|oniru|elegushi|lagos\s*island|marina|falomo|parkview|osborne|admiralty|chevron|sangotedo|abraham\s*adesanya|igbo[\s-]?efon|jakande|orchid|freedom\s*way|onikan|broad\s*street|cms|tinubu|obada|edo\s*street|epe\s*expressway|vgc|victoria\s*garden)\b/i;

export function classifyLagosZone(
  street: string,
  city: string,
  state: string
): { fee: number; label: string; zone: "island" | "mainland" } {
  const blob = `${street} ${city} ${state}`;
  if (ISLAND_MATCH.test(blob)) {
    return { fee: ISLAND_FEE, label: ISLAND_LABEL, zone: "island" };
  }
  return { fee: MAINLAND_FEE, label: MAINLAND_LABEL, zone: "mainland" };
}
