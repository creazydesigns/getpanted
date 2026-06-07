import { NextResponse } from "next/server";
import { fetchStoreProductById } from "@/lib/products/fetch";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const product = await fetchStoreProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (err) {
    console.error("[api/products/id]", err);
    return NextResponse.json({ error: "Could not load product" }, { status: 500 });
  }
}
