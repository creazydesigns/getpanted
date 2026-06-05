import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminApi, jsonOk, jsonError } from "@/lib/admin/api-response";

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) return jsonError("No file provided");

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from("product-images")
    .upload(path, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (error) return jsonError(error.message, 500);

  const { data: urlData } = supabaseAdmin.storage.from("product-images").getPublicUrl(path);

  return jsonOk({ url: urlData.publicUrl, path });
}
