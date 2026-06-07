export const SUPPORT_TICKET_TYPES = [
  { value: "query", label: "Query" },
  { value: "feedback", label: "Feedback" },
] as const;

export const SUPPORT_CATEGORIES = [
  { value: "orders-delivery", label: "Orders & Delivery" },
  { value: "sizing-fit", label: "Sizing & Fit" },
  { value: "returns-exchanges", label: "Returns & Exchanges" },
  { value: "product-feedback", label: "Product Feedback" },
  { value: "payments-checkout", label: "Payments & Checkout" },
  { value: "account-website", label: "Account & Website" },
  { value: "made-to-order", label: "Made to Order" },
  { value: "wholesale-partnerships", label: "Wholesale & Partnerships" },
  { value: "general", label: "General Enquiry" },
  { value: "other", label: "Other" },
] as const;

export type SupportTicketType = (typeof SUPPORT_TICKET_TYPES)[number]["value"];
export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number]["value"];

export function makeTicketNumber(id: string): string {
  const year = new Date().getFullYear();
  const short = id.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `GP-${year}-${short}`;
}

export function categoryLabel(value: string): string {
  return SUPPORT_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
