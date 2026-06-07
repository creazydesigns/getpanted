import { NextResponse } from "next/server";
import { fetchStoreProducts } from "@/lib/products/fetch";

export async function GET() {
  try {
    const products = await fetchStoreProducts();
    return NextResponse.json({ products });
  } catch (err) {
    console.error("[api/products]", err);
    return NextResponse.json({ error: "Could not load products" }, { status: 500 });
  }
}
