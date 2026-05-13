import { Resend } from "resend";

// Falls back to a placeholder so the build succeeds without RESEND_API_KEY set.
// Emails will only actually send once a real key is configured in Vercel.
export const resend = new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");

export const FROM_EMAIL = "GetPanted <noreply@getpanted.com>";
export const ADMIN_EMAIL = "admin@getpanted.com";
