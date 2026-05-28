import { CATALOG } from "./catalog";
import { ADMIN_EMAIL, SUPPORT_EMAIL, WHATSAPP_URL, SITE_URL } from "./resend";

const SIZE_CHART = [
  { size: "XS", waist: "60–64", hips: "86–90", length: "100" },
  { size: "S",  waist: "65–69", hips: "91–95", length: "101" },
  { size: "M",  waist: "70–74", hips: "96–100", length: "102" },
  { size: "L",  waist: "75–79", hips: "101–105", length: "103" },
  { size: "XL", waist: "80–84", hips: "106–110", length: "104" },
  { size: "2XL", waist: "85–90", hips: "111–116", length: "105" },
];

export function buildSiteKnowledge(): string {
  const products = CATALOG.map(
    (p) =>
      `- ID ${p.id}: ${p.name} — ${p.price}${p.badge ? ` (${p.badge})` : ""}. Sizes: ${p.sizes.join(", ")}. ${p.description} Product URL: ${SITE_URL}/products/${p.id}`
  ).join("\n");

  const sizes = SIZE_CHART.map(
    (r) => `- ${r.size}: waist ${r.waist} cm, hips ${r.hips} cm, length ${r.length} cm`
  ).join("\n");

  return `
GETPANTED SITE KNOWLEDGE (use only this information — do not invent facts)

Brand
- GetPanted is a Lagos-born women's pants lifestyle brand.
- Tagline positioning: elevated trousers for women who dress with intention.
- Debut collection: PRESENCE — clean silhouettes, intentional fit, minimal and bold details.
- Brand pillars: Fit That Flatters, Style With Intention, Classy Not Boring, Made to Move With You.
- Values: confidence without noise, comfort with structure, intentional design, quality before quantity.

Site pages
- Home: ${SITE_URL}/
- Collections: ${SITE_URL}/collections
- New Arrivals: ${SITE_URL}/new-arrivals
- Shop hub: ${SITE_URL}/shop
- About: ${SITE_URL}/about
- Size Guide: ${SITE_URL}/size-guide
- Made to Order: ${SITE_URL}/made-to-order
- Contact & Help: ${SITE_URL}/contact
- Cart: ${SITE_URL}/cart
- Checkout: ${SITE_URL}/checkout

Product catalog (${CATALOG.length} pieces)
${products}

Shop by style (collections framing)
- Minimal Essentials: clean everyday trousers
- Statement Pants: bold silhouettes
- Workwear Trousers: polished and professional
- Two-Tone Edits: intentional colour pairings

Size chart (cm)
${sizes}
- If between sizes, recommend contacting the team with measurements.
- Some products include 3XL (e.g. Onyx Statement, Blush Ultra Wide).

Shipping & delivery
- Free shipping on orders of ₦50,000 and above.
- Standard shipping fee: ₦3,500 for orders below ₦50,000.
- Estimated delivery after dispatch: 5–7 business days (from order confirmation emails).
- Shipping and delivery questions: contact page or WhatsApp.

Returns & exchanges
- Customers should contact the team within the stated return window via WhatsApp or email with order details.
- No fixed return window number is published on site — escalate specific return cases to the team.

Made to order
- Sold-out pieces may be requested again via ${SITE_URL}/made-to-order.
- Process: choose style/colour/size → team confirms availability, price, timeline → deposit → production → quality check → dispatch.
- Also available for custom sizing help.

Service promises (homepage)
- Intentional Fit: attention to waist, hip, length, and movement.
- Limited Pieces: thoughtful production quantities.
- Made to Order Option: sold-out pieces may be reproduced within stated timeline.
- Quality Checked: every piece reviewed before dispatch.

Contact & escalation
- Customer email: ${SUPPORT_EMAIL}
- Admin email (internal escalations): ${ADMIN_EMAIL}
- WhatsApp support: ${WHATSAPP_URL}
- Instagram: https://instagram.com/getpanted
- Facebook: https://facebook.com/getpanted
- TikTok: https://tiktok.com/@getpanted

Newsletter
- "Join the List" on homepage — new pieces, limited drops, size restocks, styling notes.

What Tara should NOT do
- Do not invent prices, discounts, stock levels, or policies not listed here.
- Do not promise refunds, exchanges, or timelines not stated above.
- Do not claim payment methods unless user asks about checkout on site (standard checkout flow on site).
`.trim();
}
