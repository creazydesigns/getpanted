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
| `waitlist_setup.sql` | Subscribers table only (includes source + whatsapp) |

## Admin dashboard (`/admin`)

1. Run all migrations through `004_admin_dashboard.sql` in the SQL Editor (in order).
2. In Supabase **Authentication** → **Users** → **Add user**, create `admin@getpanted.com` with a strong password (email provider enabled).
3. Sign in at `/admin/login`. Only `ADMIN_EMAIL` (default `admin@getpanted.com`) can access the panel.

The admin CMS uses Supabase Auth cookies, the service role for data mutations, and the `product-images` storage bucket for uploads.

## Production (Vercel etc.)

Add the same three Supabase variables (and `RESEND_API_KEY` if you want emails) in your host’s environment settings, then redeploy.
