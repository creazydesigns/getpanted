import { getSiteContentMap } from "@/lib/site-content";
import { NextResponse } from "next/server";

export async function GET() {
  const content = await getSiteContentMap();
  return NextResponse.json({ content });
}
