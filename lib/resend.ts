import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = "GetPanted <noreply@getpanted.com>";
export const ADMIN_EMAIL = "admin@getpanted.com";
