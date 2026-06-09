import { requireAdminApi, jsonOk, jsonError } from "@/lib/admin/api-response";
import { fetchRecipientLists } from "@/lib/newsletter/fetch-recipient-lists";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const lists = await fetchRecipientLists();
    return jsonOk({ lists });
  } catch (err) {
    console.error("[newsletter/lists]", err);
    return jsonError("Could not load recipient lists", 500);
  }
}
