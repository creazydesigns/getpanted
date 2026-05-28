import { Resend } from "resend";

// Falls back to a placeholder so the build succeeds without RESEND_API_KEY set.
// Emails will only actually send once a real key is configured in Vercel.
export const resend = new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");

export const FROM_EMAIL = "GetPanted <noreply@getpanted.com>";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@getpanted.com";
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? "hello@getpanted.com";
export const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://wa.me/2348000000000";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getpanted.com";
