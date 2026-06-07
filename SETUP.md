# GetPanted — Full Setup Guide

Complete configuration for **Supabase** (data + auth), **admin dashboard**, **client accounts**, **Paystack checkout**, and **Resend** (automated emails).

---

## 1. Environment variables

Copy [`.env.example`](../.env.example) to `.env.local` and fill in every value:

| Variable | Required for | Where to get it |
|----------|--------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Everything | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth, client reads | Same |
| `SUPABASE_SERVICE_ROLE_KEY` | API writes, admin | Same (**never expose to browser**) |
| `RESEND_API_KEY` | All emails | [resend.com](https://resend.com) → API Keys |
| `RESEND_FROM_EMAIL` | All emails | Verified sender, e.g. `GetPanted <noreply@getpanted.com>` |
| `NEXT_PUBLIC_SITE_URL` | OAuth, Paystack, email links | `http://localhost:3000` locally; production URL in prod |
| `ADMIN_EMAIL` | Admin login gate | Email of your admin user (default `admin@getpanted.com`) |
| `SUPPORT_EMAIL` | Ticket notifications | e.g. `hello@getpanted.com` |
| `PAYSTACK_SECRET_KEY` | Checkout payments | Paystack Dashboard → Settings → API Keys |
| `NEXT_PUBLIC_WHATSAPP_URL` | Contact links | Your WhatsApp link |

On **Vercel** (or your host), add the same variables under Project → Settings → Environment Variables, then redeploy.

---

## 2. Supabase project

### Create project

1. [supabase.com](https://supabase.com) → **New project**
2. Save your database password; wait until status is **Active**

### Run migrations (in order)

In **SQL Editor**, run each file from `supabase/migrations/` **one at a time**, in this order:

| # | File | What it adds |
|---|------|--------------|
| 1 | `001_initial_schema.sql` | Products, orders, bespoke, newsletter, cart |
| 2 | `002_add_subscriber_source.sql` | Waitlist `source` column |
| 3 | `003_add_subscriber_whatsapp.sql` | Waitlist `whatsapp` column |
| 4 | `004_admin_dashboard.sql` | Admin CMS, site content, storage bucket |
| 5 | `005_customer_accounts.sql` | Client profiles, wishlist, Paystack fields |
| 6 | `006_support_tickets.sql` | Support ticket form storage |
| 7 | `007_welcome_email_sent.sql` | Account welcome email tracking |

If you only need the waitlist first, you can run `waitlist_setup.sql` instead of 001–003, then run 004–007 when ready for the full shop.

### Copy API keys

**Project Settings → API** → paste into `.env.local`:

- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

---

## 3. Admin account (`/admin`)

1. Run migrations through **004** (and 005–007 for full platform).
2. **Authentication → Providers** → enable **Email** (password).
3. **Authentication → Users → Add user**:
   - Email: same as `ADMIN_EMAIL` (e.g. `admin@getpanted.com`)
   - Password: choose a strong password (this is your login password, not an API key)
   - Auto Confirm User: **on**
4. Sign in at `/admin/login`.

Only the email matching `ADMIN_EMAIL` can access the admin panel. The CMS uses the service role for data changes.

---

## 4. Client accounts (`/account`)

### Auth providers

**Authentication → Providers**:

| Provider | Enable | Notes |
|----------|--------|-------|
| Email | Yes | Allow sign-up + password login |
| Google | Yes | Add OAuth Client ID + Secret from Google Cloud Console |
| Facebook | Yes | Add App ID + Secret from Meta Developers |

### Redirect URLs

**Authentication → URL Configuration**:

- **Site URL**: your production URL (e.g. `https://getpanted.com`)
- **Redirect URLs** (add both):
  - `http://localhost:3000/auth/callback`
  - `https://getpanted.com/auth/callback`

### OAuth setup (summary)

**Google**: [console.cloud.google.com](https://console.cloud.google.com) → OAuth client → Authorized redirect URI = `https://<your-supabase-ref>.supabase.co/auth/v1/callback`

**Facebook**: [developers.facebook.com](https://developers.facebook.com) → App → Facebook Login → Valid OAuth Redirect URIs = same Supabase callback URL

Paste client ID/secret into Supabase provider settings.

### Client features (after migration 005–007)

- Sign up / sign in: `/account/signup`, `/account/login`
- Dashboard: `/account`
- Orders: `/account/orders`
- Support tickets: `/account/support`
- Guest checkout still works at `/checkout`

---

## 5. Paystack checkout

1. [dashboard.paystack.com](https://dashboard.paystack.com) → **Settings → API Keys**
2. Copy **Secret Key** → `PAYSTACK_SECRET_KEY` (use test key locally)
3. Set `NEXT_PUBLIC_SITE_URL` to the URL Paystack redirects back to
4. **Production only**: Settings → Webhooks → `https://getpanted.com/api/paystack/webhook`

---

## 6. Resend (automated emails)

### One-time Resend setup

1. Sign up at [resend.com](https://resend.com)
2. **Domains** → Add `getpanted.com` (or your domain)
3. Add the DNS records Resend provides (SPF, DKIM) until domain shows **Verified**
4. **API Keys** → Create key → `RESEND_API_KEY`
5. Set `RESEND_FROM_EMAIL=GetPanted <noreply@getpanted.com>` (must use verified domain)

Without a verified domain, emails will not send in production.

### Automated emails (already wired in code)

| Trigger | Email to customer | Email to team |
|---------|-------------------|---------------|
| Waitlist signup (`/waitlist`) | Welcome — *Welcome to the Clan* | — |
| New client account (`/account/signup` or OAuth) | Welcome — *Your account is ready* | — |
| Support ticket (`/account/support`) | Acknowledgment + **ticket number** | Notification to `SUPPORT_EMAIL` |
| Order paid (Paystack) | Order confirmation | — |
| Bespoke order | Confirmation | Notification to `ADMIN_EMAIL` |
| Tara human handoff | — | Notification to `ADMIN_EMAIL` |

All customer emails send from `RESEND_FROM_EMAIL`. Team notifications go to `SUPPORT_EMAIL` or `ADMIN_EMAIL` as listed above.

### Test emails locally

1. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in `.env.local`
2. Restart dev server: `npm run dev`
3. Test each flow:
   - Submit waitlist form → check inbox
   - Create account at `/account/signup` → welcome email
   - Submit support ticket at `/account/support` → ticket ack + team email
   - Complete a test Paystack checkout → order confirmation

Resend free tier works for testing; use a real inbox you control.

---

## 7. Verification checklist

Use this after configuration:

- [ ] `.env.local` has all Supabase keys
- [ ] Migrations 001–007 ran without errors
- [ ] Waitlist form saves to `newsletter_subscribers` + welcome email arrives
- [ ] Admin can sign in at `/admin/login`
- [ ] Client can sign up at `/account/signup` + welcome email arrives
- [ ] Google/Facebook sign-in redirects back to `/account`
- [ ] Support ticket saves to `support_tickets` + ack email with ticket number
- [ ] Paystack test payment completes + order confirmation email
- [ ] Production env vars set on host + domain verified in Resend

---

## 8. Troubleshooting

| Problem | Fix |
|---------|-----|
| Waitlist “Something went wrong” | Run migrations 002/003 or `waitlist_setup.sql` |
| Admin “Unauthorized” | User email must match `ADMIN_EMAIL` exactly |
| Account page stuck loading | Check Supabase URL/keys; restart dev server on port 3000 |
| Emails not sending | Verify `RESEND_API_KEY`, domain in Resend, and `RESEND_FROM_EMAIL` |
| OAuth redirect error | Add `/auth/callback` URLs in Supabase + provider console |
| Paystack fails | Check secret key and `NEXT_PUBLIC_SITE_URL` |
| Support ticket DB error | Run migration `006_support_tickets.sql` |
| Duplicate welcome emails | Run migration `007_welcome_email_sent.sql` |

More detail: [`supabase/README.md`](./supabase/README.md)
