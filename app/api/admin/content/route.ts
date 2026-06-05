import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminApi, jsonOk, jsonError } from "@/lib/admin/api-response";
import { SITE_CONTENT_DEFAULTS } from "@/lib/site-content-defaults";
import { ensureSiteContentSeeded } from "@/lib/site-content";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  await ensureSiteContentSeeded();

  const { data, error } = await supabaseAdmin.from("site_content").select("key, value, updated_at");

  if (error) return jsonError(error.message, 500);

  const content = { ...SITE_CONTENT_DEFAULTS };
  for (const row of data ?? []) {
    if (row.key) content[row.key] = row.value ?? "";
  }

  return jsonOk({ content });
}

export async function PUT(req: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { content } = await req.json();
  if (!content || typeof content !== "object") return jsonError("Invalid content");

  const rows = Object.entries(content as Record<string, string>).map(([key, value]) => ({
    key,
    value: String(value ?? ""),
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabaseAdmin.from("site_content").upsert(rows, { onConflict: "key" });

  if (error) return jsonError(error.message, 500);

  return jsonOk({ success: true });
}
