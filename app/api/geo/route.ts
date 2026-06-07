import { NextResponse } from "next/server";
import { getDialCodeForCountry } from "@/lib/phone-codes";

function countryFromRequest(request: Request): string | null {
  return (
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-country-code") ??
    null
  );
}

export async function GET(request: Request) {
  const country = countryFromRequest(request);
  const dialCode = getDialCodeForCountry(country);

  return NextResponse.json(
    { country, dialCode },
    { headers: { "Cache-Control": "private, max-age=3600" } }
  );
}
