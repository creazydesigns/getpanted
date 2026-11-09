/** Demo/live Paystack test product — free shipping so the charge stays ₦200. */
export const PAYSTACK_TEST_PRODUCT_PREFIX = "Paystack Live Test";

export function isPaystackTestCart(
  items: { name: string }[]
): boolean {
  return items.length > 0 && items.every((i) => i.name.startsWith(PAYSTACK_TEST_PRODUCT_PREFIX));
}

export function calcShippingNaira(
  items: { name: string }[],
  subtotal: number,
  itemCount: number
): number {
  if (itemCount <= 0) return 0;
  if (isPaystackTestCart(items)) return 0;
  if (subtotal >= 50000) return 0;
  return 3500;
}
