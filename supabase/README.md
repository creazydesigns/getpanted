# Supabase setup for GetPanted

## Waitlist only (fast path)

The waitlist at `/waitlist` saves signups via `POST /api/subscribe` into `newsletter_subscribers` with `source = 'waitlist'`.

### 1. Create a project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. **New project** → pick org, name (e.g. `getpanted`), database password, region.
3. Wait until the project is **Active**.

### 2. Run the waitlist SQL

1. In the project: **SQL Editor** → **New query**.
2. Paste the contents of [`waitlist_setup.sql`](./waitlist_setup.sql).
3. Click **Run**. You should see success with no errors.

To also seed products, orders, and the rest of the shop schema, run the files in `migrations/` in order (`001` → `003`) instead of or after the waitlist script.

### 3. Add API keys to `.env.local`

In Supabase: **Project Settings** → **API**.

| Variable | Where to copy |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key (**server only**, never expose to the browser) |

Copy from [`.env.example`](../.env.example) into `.env.local` and fill these three values.

The subscribe API uses the **service role** key so inserts are not blocked by RLS. Do not commit `.env.local`.

### 4. Optional: welcome email

Waitlist signups trigger a Resend welcome email when `RESEND_API_KEY` is set. Signups still save if email fails or the key is missing.

### 5. Verify locally

```bash
npm run dev
```

Open [http://localhost:3000/waitlist](http://localhost:3000/waitlist), submit the form, then in Supabase **Table Editor** → `newsletter_subscribers` confirm a row with `source = waitlist`.

## Viewing waitlist signups

**Table Editor** → `newsletter_subscribers`. Filter `source` = `waitlist` to see landing-page signups only.

Useful columns: `email`, `first_name` (full name from the form), `whatsapp`, `subscribed_at`, `active`.

## Full schema

| File | Purpose |
|------|---------|
| `migrations/001_initial_schema.sql` | Products, orders, bespoke, subscribers, cart + seed products |
| `migrations/002_add_subscriber_source.sql` | `source` column |
| `migrations/003_add_subscriber_whatsapp.sql` | `whatsapp` column |
| `migrations/004_admin_dashboard.sql` | Admin CMS fields, site content, storage |
| `migrations/005_customer_accounts.sql` | Customer profiles, wishlist, Paystack order fields |
| `migrations/006_support_tickets.sql` | Client area support tickets |
| `migrations/007_welcome_email_sent.sql` | Account welcome email tracking |
| `waitlist_setup.sql` | Subscribers table only (includes source + whatsapp) |

## Customer accounts & checkout

1. Run migration `005_customer_accounts.sql` after migrations `001`–`004`.
2. In Supabase **Authentication** → **Providers**, enable **Email** (password sign-up), **Google**, and **Facebook**. Add OAuth client IDs/secrets from each provider console.
3. Under **Authentication** → **URL Configuration**, set **Site URL** to your production URL and add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback`
4. Add `PAYSTACK_SECRET_KEY` to `.env.local` (from [Paystack Dashboard](https://dashboard.paystack.com) → Settings → API Keys). Use test keys locally.
5. In Paystack, set the webhook URL to `https://your-domain.com/api/paystack/webhook` (production only).

Customers can sign up with email/password or Google/Facebook at `/account/signup`. Guest checkout remains available at `/checkout` — orders are linked to `user_id` when signed in. Payments redirect to Paystack and return to `/checkout/complete`.

## Admin dashboard (`/admin`)

1. Run all migrations through `004_admin_dashboard.sql` in the SQL Editor (in order).
2. In Supabase **Authentication** → **Users** → **Add user**, create `admin@getpanted.com` with a strong password (email provider enabled).
3. Sign in at `/admin/login`. Only `ADMIN_EMAIL` (default `admin@getpanted.com`) can access the panel.

The admin CMS uses Supabase Auth cookies, the service role for data mutations, and the `product-images` storage bucket for uploads.

## Production (Vercel etc.)

Add the same environment variables from [`.env.example`](../.env.example) in your host’s settings, then redeploy.

For the full step-by-step guide (Supabase, admin, client accounts, Paystack, Resend), see **[`SETUP.md`](../SETUP.md)** in the project root.

### Resend emails (summary)

Configure `RESEND_API_KEY` and verify your domain at [resend.com](https://resend.com). Set `RESEND_FROM_EMAIL` to a verified address (e.g. `GetPanted <noreply@getpanted.com>`).

| Event | Customer email |
|-------|------------------|
| Waitlist signup | Welcome to the Clan |
| New account | Your account is ready |
| Support ticket | Acknowledgment + ticket number |
| Paid order | Order confirmation |
