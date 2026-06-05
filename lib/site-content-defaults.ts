export const SITE_CONTENT_DEFAULTS: Record<string, string> = {
  "homepage.hero_line_1": "DRESS THE POWER.",
  "homepage.hero_line_2": "OWN THE ROOM.",
  "homepage.hero_tagline":
    "Elevated trousers made for confidence, comfort, and style — from clean everyday silhouettes to bold statement pieces.",
  "homepage.hero_button_label": "SHOP NOW",
  "homepage.hero_button_link": "/collections",
  "about.brand_story":
    "GetPanted was built for women who want trousers that feel intentional — polished enough for work, expressive enough for the room, and comfortable enough to live in all day.",
  "about.image": "/images/gp-lady-white.png",
  "collections.banner_headline": "Shop the Collection",
  "announcement.text": "Free delivery on orders over ₦50,000",
  "announcement.enabled": "true",
  "bespoke.intro":
    "Tell us your preferred style, colour, and size. Our team will confirm availability, pricing, and your production timeline.",
  "bespoke.turnaround": "14–21 working days",
  "bespoke.starting_price": "From ₦36,000",
};

export const SITE_CONTENT_GROUPS = {
  homepage: [
    { key: "homepage.hero_line_1", label: "Hero headline (line 1)" },
    { key: "homepage.hero_line_2", label: "Hero headline (line 2)" },
    { key: "homepage.hero_tagline", label: "Hero subheadline / tagline", textarea: true },
    { key: "homepage.hero_button_label", label: "Hero button label" },
    { key: "homepage.hero_button_link", label: "Hero button link" },
  ],
  about: [
    { key: "about.brand_story", label: "Brand story", textarea: true },
    { key: "about.image", label: "About page image URL" },
  ],
  collections: [
    { key: "collections.banner_headline", label: "Collection banner headline" },
    { key: "announcement.text", label: "Announcement bar text" },
    { key: "announcement.enabled", label: "Announcement bar enabled (true/false)" },
  ],
  bespoke: [
    { key: "bespoke.intro", label: "Intro paragraph", textarea: true },
    { key: "bespoke.turnaround", label: "Turnaround time text" },
    { key: "bespoke.starting_price", label: "Starting price text" },
  ],
} as const;
