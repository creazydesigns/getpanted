import { NextRequest, NextResponse } from "next/server";
import { quoteShipping } from "@/lib/shipping/quote";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const quote = await quoteShipping({
      street: body.street,
      city: body.city,
      state: body.state,
      country: body.country,
    });
    return NextResponse.json({ quote });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not calculate shipping";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
