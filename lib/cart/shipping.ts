/**
 * Flat / cart-preview helpers.
 * Real quotes come from /api/shipping/quote at checkout (distance bands).
 * Free shipping is intentionally never applied.
 */

export const PAYSTACK_TEST_PRODUCT_PREFIX = "Paystack Live Test";

export function isPaystackTestCart(items: { name: string }[]): boolean {
  return items.length > 0 && items.every((i) => i.name.startsWith(PAYSTACK_TEST_PRODUCT_PREFIX));
}

/** Cart page only — shipping is always calculated at checkout from the address. */
export function cartShippingPreviewLabel(): string {
  return "Calculated at checkout";
}
