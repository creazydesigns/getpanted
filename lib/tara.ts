import { buildSiteKnowledge } from "./site-knowledge";
import { CATALOG } from "./catalog";

export interface TaraMessage {
  role: "user" | "assistant";
  content: string;
}

export interface TaraSuggestedProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  url: string;
}

export interface TaraReply {
  message: string;
  suggestedProducts: TaraSuggestedProduct[];
  needsEscalation: boolean;
  escalationReason?: string;
}

const SITE_KNOWLEDGE = buildSiteKnowledge();

export const TARA_SYSTEM_PROMPT = `You are Tara, the friendly AI shopping assistant for GetPanted — a Lagos-born women's trousers brand.

Personality: warm, confident, concise, and helpful — like a knowledgeable stylist at a premium boutique. Use plain language. Keep replies to 2–4 short paragraphs unless sizing or product comparison needs more detail.

Your job:
1. Answer questions about products, sizing, collections, shipping, made-to-order, and brand story using ONLY the site knowledge provided.
2. Recommend specific products when helpful — include product IDs from the catalog.
3. Guide purchase decisions: suggest pieces by occasion (work, events, everyday), fit preference (wide-leg, statement, minimal), or budget.
4. Link mentally to site pages when relevant (collections, size guide, made-to-order, contact).

When you CANNOT answer confidently (missing policy detail, order-specific issue, payment dispute, custom request outside catalog, complaint, wholesale, or anything not in site knowledge):
- Set needsEscalation to true.
- Explain warmly that you're connecting them with the GetPanted team.
- Still give any partial helpful context you can.

Response format: reply with valid JSON only, no markdown fences:
{
  "message": "your reply to the customer",
  "suggestedProductIds": ["1", "2"],
  "needsEscalation": false,
  "escalationReason": "optional short reason for admin"
}

Rules:
- suggestedProductIds: up to 3 relevant product IDs from the catalog; empty array if none.
- needsEscalation: true only when human follow-up is required.
- Never fabricate stock availability — say a piece is in the catalog and suggest checking the product page or made-to-order if size is unavailable.
- Prices are in Nigerian Naira (₦).

SITE KNOWLEDGE:
${SITE_KNOWLEDGE}`;

function mapSuggestedProducts(ids: string[]): TaraSuggestedProduct[] {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getpanted.com";
  return ids
    .map((id) => CATALOG.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 3)
    .map((p) => ({
      id: p!.id,
      name: p!.name,
      price: p!.price,
      image: p!.image,
      url: `${siteUrl}/products/${p!.id}`,
    }));
}

function parseTaraJson(raw: string): TaraReply | null {
  try {
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(cleaned) as {
      message?: string;
      suggestedProductIds?: string[];
      needsEscalation?: boolean;
      escalationReason?: string;
    };
    if (!parsed.message) return null;
    return {
      message: parsed.message,
      suggestedProducts: mapSuggestedProducts(parsed.suggestedProductIds ?? []),
      needsEscalation: Boolean(parsed.needsEscalation),
      escalationReason: parsed.escalationReason,
    };
  } catch {
    return null;
  }
}

function fallbackReply(userMessage: string): TaraReply {
  const lower = userMessage.toLowerCase();
  const keywords = ["ship", "deliver", "size", "fit", "return", "exchange", "order", "track", "payment", "wholesale", "complaint"];
  const needsEscalation = keywords.some((k) => lower.includes(k));

  if (lower.includes("ship") || lower.includes("deliver")) {
    return {
      message:
        "Shipping is free on orders of ₦50,000 and above. For smaller orders, the standard fee is ₦3,500. After your order is confirmed, delivery typically takes 5–7 business days. Browse our collections or tell me what occasion you're dressing for and I'll suggest pieces.",
      suggestedProducts: mapSuggestedProducts(["1", "2", "4"]),
      needsEscalation: false,
    };
  }

  if (lower.includes("size") || lower.includes("fit")) {
    return {
      message:
        "Our size chart runs XS through 2XL (some styles include 3XL). Measure your waist, hips, and preferred trouser length in cm and compare with our Size Guide. If you're between sizes, share your measurements and I can suggest the best option — or our team can help on WhatsApp.",
      suggestedProducts: [],
      needsEscalation: false,
    };
  }

  return {
    message: needsEscalation
      ? "That's a great question — I'd like our team to give you the most accurate answer. I've flagged this for them. You can also reach us on WhatsApp or email for a faster response."
      : "Hi, I'm Tara — your GetPanted stylist. I can help you find trousers by occasion, suggest pieces from our PRESENCE collection, explain sizing, or talk through made-to-order options. What are you looking for today?",
    suggestedProducts: mapSuggestedProducts(["1", "2", "3"]),
    needsEscalation,
    escalationReason: needsEscalation ? "Question needs human follow-up (AI key not configured or complex query)" : undefined,
  };
}

export async function generateTaraReply(
  messages: TaraMessage[],
  latestUserMessage: string
): Promise<TaraReply> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.TARA_MODEL ?? "gpt-4o-mini";

  if (!apiKey) {
    console.warn("[tara] OPENAI_API_KEY not set — using fallback responses");
    return fallbackReply(latestUserMessage);
  }

  const chatMessages = [
    { role: "system" as const, content: TARA_SYSTEM_PROMPT },
    ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
  ];

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 800,
        messages: chatMessages,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[tara] OpenAI error:", err);
      return fallbackReply(latestUserMessage);
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content ?? "";
    const parsed = parseTaraJson(content);
    if (parsed) return parsed;

    return {
      message: content || "I'm here to help — could you tell me a bit more about what you're looking for?",
      suggestedProducts: [],
      needsEscalation: false,
    };
  } catch (err) {
    console.error("[tara]", err);
    return fallbackReply(latestUserMessage);
  }
}
