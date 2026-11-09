/**
 * Upserts a ₦200 Paystack live-test product into Supabase.
 * Usage: node scripts/seed-paystack-test-product.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    if (!line || line.trim().startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const slug = "paystack-live-test-200";
const row = {
  name: "Paystack Live Test (₦200)",
  slug,
  description:
    "Dummy product for live Paystack checkout tests. Charge is ₦200 with free shipping when this is the only item in the cart. Delete or set to draft after testing.",
  price: 200,
  original_price: null,
  category: "ready-to-wear",
  badge: "TEST",
  sizes: ["One Size"],
  colors: ["#1a1a1a"],
  image: "/images/straight-pants/black-front.png",
  images: ["/images/straight-pants/black-front.png"],
  stock_by_size: { "One Size": 99 },
  total_stock: 99,
  in_stock: true,
  status: "active",
};

const supabase = createClient(url, key, { auth: { persistSession: false } });

const { data: existing, error: findErr } = await supabase
  .from("products")
  .select("id, slug, price, status")
  .eq("slug", slug)
  .maybeSingle();

if (findErr) {
  console.error("Lookup failed:", findErr.message);
  process.exit(1);
}

if (existing) {
  const { data, error } = await supabase
    .from("products")
    .update(row)
    .eq("id", existing.id)
    .select("id, slug, name, price, status")
    .single();
  if (error) {
    console.error("Update failed:", error.message);
    process.exit(1);
  }
  console.log("Updated test product:", data);
} else {
  const { data, error } = await supabase
    .from("products")
    .insert(row)
    .select("id, slug, name, price, status")
    .single();
  if (error) {
    console.error("Insert failed:", error.message);
    process.exit(1);
  }
  console.log("Created test product:", data);
}

console.log("Shop URL: /shop");
console.log("Product URL: /products/" + slug);
