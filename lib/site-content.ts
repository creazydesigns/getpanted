import { supabaseAdmin } from "@/lib/supabase";
import { SITE_CONTENT_DEFAULTS } from "@/lib/site-content-defaults";

export async function getSiteContentMap(): Promise<Record<string, string>> {
  const map = { ...SITE_CONTENT_DEFAULTS };

  const { data, error } = await supabaseAdmin.from("site_content").select("key, value");

  if (error) {
    if (error.code === "PGRST205" || error.code === "42P01") {
      return map;
    }
    console.warn("[site-content] fetch failed:", error.message);
    return map;
  }

  for (const row of data ?? []) {
    if (row.key) map[row.key] = row.value ?? "";
  }

  return map;
}

export async function ensureSiteContentSeeded(): Promise<void> {
  const rows = Object.entries(SITE_CONTENT_DEFAULTS).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));

  await supabaseAdmin.from("site_content").upsert(rows, { onConflict: "key" });
}
