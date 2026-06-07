const SUPPORT_EMAIL = "hello@getpanted.com";
const WHATSAPP_URL =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_WHATSAPP_URL
    ? process.env.NEXT_PUBLIC_WHATSAPP_URL
    : "https://wa.me/2348000000000";

export const CONTACT_CHANNELS = [
  {
    label: "WhatsApp",
    value: "Message us on WhatsApp",
    href: WHATSAPP_URL,
    note: "Fastest for order questions, sizing help, and delivery updates.",
  },
  {
    label: "Email",
    value: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
    note: "For general enquiries, wholesale, and support.",
  },
  {
    label: "Instagram",
    value: "@getpanted",
    href: "https://instagram.com/getpanted",
    note: "New drops, styling notes, and behind-the-scenes updates.",
  },
] as const;

export const HELP_TOPICS = [
  {
    title: "Delivery Questions",
    body: "Need help with shipping timelines or tracking? Reach out on WhatsApp or email with your order details.",
  },
  {
    title: "Returns & Exchanges",
    body: "Contact us within the stated return window. Our team will guide you through the next steps based on your order.",
  },
  {
    title: "Size & Fit Help",
    body: "Between sizes or unsure which fit to choose? Share your measurements and we will recommend the best option.",
  },
  {
    title: "Made to Order",
    body: "Missed your size on a sold-out piece? Request made to order and we will confirm availability and timeline.",
  },
] as const;
