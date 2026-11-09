/**
 * Cart-preview helpers.
 * Real quotes come from /api/shipping/quote at checkout (distance bands).
 * Free shipping is intentionally never applied.
 */

/** Cart page only — shipping is always calculated at checkout from the address. */
export function cartShippingPreviewLabel(): string {
  return "Calculated at checkout";
}
