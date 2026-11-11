export type ExecutivePackageId = "classic" | "signature";

export type ExecutiveStyleOption = {
  slug: string;
  name: string;
  colorName: string;
  colorHex: string;
  silhouette: "straight" | "pleated" | "flared";
  image: string;
  sizes: string[];
  /** When false, shown as coming soon and not selectable */
  available: boolean;
};

export const EE_HERO_IMAGE = "/images/luxe-hero.png";
export const EE_HERO_IMAGE_MOBILE = "/images/luxe-hero2.png";

export const EE_PREORDER = {
  windowLabel: "1–15 November 2026",
  windowStart: "2026-11-01",
  windowEnd: "2026-11-15",
  deliveryLabel: "first week of December 2026",
  shippingIncluded: false,
} as const;

export const EE_CONTACT = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://wa.me/2348000000000",
  instagram: "https://instagram.com/getpanted",
  instagramHandle: "@getpanted",
} as const;

/** Classic + Signature share the live Straight Pants colourways for now. */
export const EE_STRAIGHT_STYLES: ExecutiveStyleOption[] = [
  {
    slug: "straight-pants-beige",
    name: "Straight Pants — Beige",
    colorName: "Beige",
    colorHex: "#C8B89A",
    silhouette: "straight",
    image: "/images/beige-luxe.png",
    sizes: ["8", "12"],
    available: true,
  },
  {
    slug: "straight-pants-coffee-brown",
    name: "Straight Pants — Coffee Brown",
    colorName: "Coffee Brown",
    colorHex: "#4A2F1F",
    silhouette: "straight",
    image: "/images/coffee-luxe.png",
    sizes: ["10", "12"],
    available: true,
  },
  {
    slug: "straight-pants-white",
    name: "Straight Pants — White",
    colorName: "White",
    colorHex: "#F5F5F5",
    silhouette: "straight",
    image: "/images/white-luxe.png",
    sizes: ["8", "10", "16"],
    available: true,
  },
  {
    slug: "straight-pants-army-green",
    name: "Straight Pants — Army Green",
    colorName: "Army Green",
    colorHex: "#4B5320",
    silhouette: "straight",
    image: "/images/army-luxe.png",
    sizes: ["10", "14", "16"],
    available: true,
  },
  {
    slug: "straight-pants-black",
    name: "Straight Pants — Black",
    colorName: "Black",
    colorHex: "#1A1A1A",
    silhouette: "straight",
    image: "/images/black-luxe.png",
    sizes: ["12", "14"],
    available: true,
  },
];

/** Signature may expand with pleated/flared when those products go live. */
export const EE_SIGNATURE_EXTRA: ExecutiveStyleOption[] = [
  {
    slug: "pleated-coming-soon",
    name: "Pleated Trouser",
    colorName: "Assorted",
    colorHex: "#8B7355",
    silhouette: "pleated",
    image: "/images/straight-pants/beige-detail.png",
    sizes: [],
    available: false,
  },
  {
    slug: "flared-coming-soon",
    name: "Flared Trouser",
    colorName: "Assorted",
    colorHex: "#5C4033",
    silhouette: "flared",
    image: "/images/straight-pants/coffee-brown-detail.png",
    sizes: [],
    available: false,
  },
];

export const EE_PACKAGES: Record<
  ExecutivePackageId,
  {
    id: ExecutivePackageId;
    name: string;
    shortName: string;
    price: number;
    priceLabel: string;
    description: string;
    includes: string[];
    cta: string;
    styles: ExecutiveStyleOption[];
  }
> = {
  classic: {
    id: "classic",
    name: "The Executive Edit — Classic",
    shortName: "Classic",
    price: 135000,
    priceLabel: "₦135,000",
    description:
      "For the woman who appreciates timeless silhouettes, clean lines, and versatile workwear.",
    includes: [
      "Five pairs of straight-leg trousers — you choose the colours",
      "Size selection for each piece",
      "A styling guide to help you get more from your wardrobe",
      "Delivery calculated at checkout",
    ],
    cta: "Choose Classic",
    styles: EE_STRAIGHT_STYLES,
  },
  signature: {
    id: "signature",
    name: "The Executive Edit — Signature",
    shortName: "Signature",
    price: 150000,
    priceLabel: "₦150,000",
    description:
      "For the woman who wants more variety in silhouette and more ways to express her personal style at work.",
    includes: [
      "Five pairs of trousers — choose from available straight-leg colourways now; pleated and flared unlock as they launch",
      "Size selection for each piece",
      "A styling guide for more combinations",
      "Delivery calculated at checkout",
    ],
    cta: "Choose Signature",
    styles: [...EE_STRAIGHT_STYLES, ...EE_SIGNATURE_EXTRA],
  },
};

export const EE_SELECTION_COUNT = 5;

export const EE_FAQS: { q: string; a: string }[] = [
  {
    q: "What is this curated collection?",
    a: "A curated collection of five trousers designed to help professional women build a more intentional work wardrobe.",
  },
  {
    q: "What is the difference between Classic and Signature?",
    a: "Classic is five straight-leg trousers you choose by colour. Signature is five trousers with room for straight-leg now, and pleated or flared pieces as those styles become available.",
  },
  {
    q: "Can I choose my colours and styles?",
    a: "Yes. You select five pieces from the available options for your package, and a size for each one, before payment.",
  },
  {
    q: "How do I choose my size?",
    a: "Use our size guide and the available sizes listed for each colour. If you need help, message us on WhatsApp before you order.",
  },
  {
    q: "When will I receive my order?",
    a: `Delivery is scheduled to begin in the ${EE_PREORDER.deliveryLabel}. You will receive order confirmation and production updates by email.`,
  },
  {
    q: "Is delivery included in the package price?",
    a: "No. Delivery is calculated at checkout based on your delivery address, then added to your total before Paystack payment.",
  },
  {
    q: "Why am I paying before delivery?",
    a: "This is a pre-order for a specially prepared collection. Full payment (package plus delivery) secures your place in the November production run and confirms your selected styles and sizes.",
  },
  {
    q: "What happens if delivery is delayed?",
    a: "We will update you promptly with a revised timeline. Contact us on WhatsApp or Instagram to discuss options. We work with you to resolve delays fairly — please reach out rather than assume an automatic refund.",
  },
  {
    q: "Can I pay in instalments?",
    a: "Not for this launch. Full payment is required at checkout.",
  },
  {
    q: "How can I contact GetPanted?",
    a: `WhatsApp via our contact link, or Instagram ${EE_CONTACT.instagramHandle}.`,
  },
];

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function getPackage(id: ExecutivePackageId) {
  return EE_PACKAGES[id];
}

export function availableStylesForPackage(id: ExecutivePackageId) {
  return EE_PACKAGES[id].styles.filter((s) => s.available);
}
