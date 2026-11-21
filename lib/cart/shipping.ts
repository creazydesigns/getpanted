/**
 * Cart-preview helpers.
 * Real quotes come from /api/shipping/quote at checkout
 * (Lagos Mainland ₦4,000 / Island ₦6,000 flat rates).
 * Free shipping is intentionally never applied.
 */

/** Cart page only — shipping is always calculated at checkout from the address. */
export function cartShippingPreviewLabel(): string {
  return "Calculated at checkout";
}
