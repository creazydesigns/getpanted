const PAYSTACK_BASE = "https://api.paystack.co";

export function paystackSecret(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured");
  return key;
}

export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
  const isLocal =
    !configured ||
    configured.includes("localhost") ||
    configured.includes("127.0.0.1");

  // On Vercel production, never send Paystack back to a local callback URL.
  if (process.env.VERCEL_ENV === "production") {
    if (configured && !isLocal) return configured;
    return "https://getpanted.com";
  }

  if (configured) return configured;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function nairaToKobo(amount: number): number {
  return Math.round(amount * 100);
}

export type PaystackInitResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

export type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: {
    status: string;
    reference: string;
    amount: number;
    paid_at?: string;
    metadata?: Record<string, unknown>;
  };
};

export async function initializeTransaction(params: {
  email: string;
  amountKobo: number;
  reference: string;
  metadata?: Record<string, unknown>;
  callbackUrl: string;
}): Promise<PaystackInitResponse> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${paystackSecret()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountKobo,
      currency: "NGN",
      reference: params.reference,
      metadata: params.metadata,
      callback_url: params.callbackUrl,
    }),
  });

  return res.json() as Promise<PaystackInitResponse>;
}

export async function verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${paystackSecret()}` },
  });

  return res.json() as Promise<PaystackVerifyResponse>;
}

export function makePaystackReference(orderId: string): string {
  return `gp-${orderId.replace(/-/g, "").slice(0, 12)}-${Date.now()}`;
}
