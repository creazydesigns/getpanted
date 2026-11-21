/**
 * Upserts landing-page colourways into the main shop products table.
 * Straight ₦27,500 · Pleated ₦32,000 · Flared ₦30,000
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

const env = Object.fromEntries(
  readFileSync(resolve(process.cwd(), ".env.local"), "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
    })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const SIZES = ["6", "8", "10", "12", "14", "16", "18", "20", "22"];
const stockBySize = Object.fromEntries(SIZES.map((s) => [s, 5]));
const totalStock = SIZES.length * 5;

const PRODUCTS = [
  // Straight — ₦27,500
  {
    slug: "straight-pants-beige",
    name: "Straight Pants — Beige",
    price: 27500,
    category: "solid",
    badge: "New",
    colors: ["#C8B89A"],
    image: "/images/beige-luxe.png",
    images: ["/images/beige-luxe.png"],
    description:
      "A clean straight-leg silhouette in soft beige — polished for the office, easy for everything after.",
  },
  {
    slug: "straight-pants-coffee-brown",
    name: "Straight Pants — Coffee Brown",
    price: 27500,
    category: "solid",
    badge: "New",
    colors: ["#4A2F1F"],
    image: "/images/coffee-luxe.png",
    images: ["/images/coffee-luxe.png"],
    description:
      "Grounded coffee-brown straight trousers with a tailored fall that elevates everyday basics.",
  },
  {
    slug: "straight-pants-white",
    name: "Straight Pants — White",
    price: 27500,
    category: "solid",
    badge: "New",
    colors: ["#F5F5F5"],
    image: "/images/white-luxe.png",
    images: ["/images/white-luxe.png"],
    description: "Crisp white straight-leg trousers for sharp contrast under blazers and knits.",
  },
  {
    slug: "straight-pants-army-green",
    name: "Straight Pants — Army Green",
    price: 27500,
    category: "solid",
    badge: "New",
    colors: ["#4B5320"],
    image: "/images/army-luxe.png",
    images: ["/images/army-luxe.png"],
    description: "Unexpected polish in army green — a straight silhouette for midweek looks.",
  },
  {
    slug: "straight-pants-black",
    name: "Straight Pants — Black",
    price: 27500,
    category: "solid",
    badge: "New",
    colors: ["#1A1A1A"],
    image: "/images/black-luxe.png",
    images: ["/images/black-luxe.png"],
    description: "The forever staple. A black straight-leg trouser cut for presence and longevity.",
  },
  {
    slug: "straight-pants-navy",
    name: "Straight Pants — Navy",
    price: 27500,
    category: "solid",
    badge: "New",
    colors: ["#1F2A5A"],
    image: "/images/straight-pants/new straight/navblue.jpg",
    images: ["/images/straight-pants/new straight/navblue.jpg"],
    description: "A sharp navy alternative to black — clean lines for the office and beyond.",
  },
  {
    slug: "straight-pants-charcoal",
    name: "Straight Pants — Charcoal",
    price: 27500,
    category: "solid",
    badge: "New",
    colors: ["#3A3D42"],
    image: "/images/straight-pants/new straight/grey.jpg",
    images: ["/images/straight-pants/new straight/grey.jpg"],
    description: "Tailored charcoal grey with a quietly modern straight fall.",
  },
  // Pleated — ₦32,000
  {
    slug: "pleated-pants-black",
    name: "Pleated Pants — Black",
    price: 32000,
    category: "solid",
    badge: "New",
    colors: ["#1A1A1A"],
    image: "/images/pleated-pants/Black-pleated.jpg",
    images: ["/images/pleated-pants/Black-pleated.jpg"],
    description: "Wide-leg black trousers with deep front pleats for volume and presence.",
  },
  {
    slug: "pleated-pants-navy",
    name: "Pleated Pants — Navy",
    price: 32000,
    category: "solid",
    badge: "New",
    colors: ["#1F2A5A"],
    image: "/images/pleated-pants/Navy-pleated.jpg",
    images: ["/images/pleated-pants/Navy-pleated.jpg"],
    description: "Deep navy pleated wide-leg trousers with a structured, flowing drape.",
  },
  {
    slug: "pleated-pants-blue",
    name: "Pleated Pants — Denim Blue",
    price: 32000,
    category: "solid",
    badge: "New",
    colors: ["#3C5F94"],
    image: "/images/pleated-pants/blue-pleated.jpg",
    images: ["/images/pleated-pants/blue-pleated.jpg"],
    description: "Denim-blue pleated trousers with architectural volume from waist to hem.",
  },
  {
    slug: "pleated-pants-ash",
    name: "Pleated Pants — Ash",
    price: 32000,
    category: "solid",
    badge: "New",
    colors: ["#A6A8AD"],
    image: "/images/pleated-pants/ash-pleated.jpg",
    images: ["/images/pleated-pants/ash-pleated.jpg"],
    description: "Soft ash grey pleated wide-leg trousers — understated and intentional.",
  },
  {
    slug: "pleated-pants-green",
    name: "Pleated Pants — Olive Green",
    price: 32000,
    category: "solid",
    badge: "New",
    colors: ["#4F5B25"],
    image: "/images/pleated-pants/green-pleated.jpg",
    images: ["/images/pleated-pants/green-pleated.jpg"],
    description: "Olive green pleated trousers with a rich, grounded wide-leg silhouette.",
  },
  {
    slug: "pleated-pants-wine",
    name: "Pleated Pants — Wine",
    price: 32000,
    category: "solid",
    badge: "New",
    colors: ["#6B1427"],
    image: "/images/pleated-pants/wine-pleated.jpg",
    images: ["/images/pleated-pants/wine-pleated.jpg"],
    description: "Deep wine pleated trousers for statement polish with movement.",
  },
  {
    slug: "pleated-pants-chocolate",
    name: "Pleated Pants — Chocolate",
    price: 32000,
    category: "solid",
    badge: "New",
    colors: ["#5A3022"],
    image: "/images/pleated-pants/template-luxe.jpg",
    images: ["/images/pleated-pants/template-luxe.jpg"],
    description: "Chocolate-brown pleated wide-leg trousers with a luxe, tailored drape.",
  },
  // Flared — ₦30,000
  {
    slug: "flared-pants-pink",
    name: "Flared Pants — Pink",
    price: 30000,
    category: "solid",
    badge: "New",
    colors: ["#F2A3C4"],
    image: "/images/flare-pants/pink-flare.jpg",
    images: ["/images/flare-pants/pink-flare.jpg"],
    description: "Wrap-front flared trousers in soft pink — structured, feminine, and bold.",
  },
  {
    slug: "flared-pants-mustard",
    name: "Flared Pants — Mustard",
    price: 30000,
    category: "solid",
    badge: "New",
    colors: ["#E9A62A"],
    image: "/images/flare-pants/mustard-flare.jpg",
    images: ["/images/flare-pants/mustard-flare.jpg"],
    description: "Mustard flared wrap trousers that bring colour and architecture to the wardrobe.",
  },
  {
    slug: "flared-pants-blue",
    name: "Flared Pants — Sky Blue",
    price: 30000,
    category: "solid",
    badge: "New",
    colors: ["#5BB8F5"],
    image: "/images/flare-pants/blue-flare.jpg",
    images: ["/images/flare-pants/blue-flare.jpg"],
    description: "Sky-blue flared trousers with a wrap-front detail and generous leg.",
  },
  {
    slug: "flared-pants-white",
    name: "Flared Pants — White",
    price: 30000,
    category: "solid",
    badge: "New",
    colors: ["#F5F5F5"],
    image: "/images/flare-pants/white-flare.jpg",
    images: ["/images/flare-pants/white-flare.jpg"],
    description: "Crisp white flared wrap trousers for clean, intentional statement looks.",
  },
];

async function main() {
  let inserted = 0;
  let updated = 0;

  for (const p of PRODUCTS) {
    const row = {
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      category: p.category,
      badge: p.badge,
      sizes: SIZES,
      colors: p.colors,
      image: p.image,
      images: p.images,
      stock_by_size: stockBySize,
      total_stock: totalStock,
      in_stock: true,
      status: "active",
    };

    const { data: existing, error: findErr } = await supabase
      .from("products")
      .select("id, slug, name")
      .or(`slug.eq.${p.slug},name.eq.${p.name}`)
      .maybeSingle();

    if (findErr) {
      console.error("find", p.slug, findErr.message);
      continue;
    }

    if (existing?.id) {
      const { error } = await supabase.from("products").update(row).eq("id", existing.id);
      if (error) console.error("update", p.slug, error.message);
      else {
        updated++;
        console.log("updated", p.slug, p.price);
      }
    } else {
      const { error } = await supabase.from("products").insert(row);
      if (error) console.error("insert", p.slug, error.message);
      else {
        inserted++;
        console.log("inserted", p.slug, p.price);
      }
    }
  }

  console.log(JSON.stringify({ inserted, updated, total: PRODUCTS.length }));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
