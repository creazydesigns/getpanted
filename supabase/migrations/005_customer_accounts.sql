-- Customer accounts: profiles, wishlist, order ownership, Paystack fields

-- ── customer_profiles ─────────────────────────────────────────────────────────
create table if not exists customer_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  first_name  text,
  last_name   text,
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── wishlist_items (catalog product_id is text e.g. "1") ──────────────────────
create table if not exists wishlist_items (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  product_id   text not null,
  product_data jsonb not null default '{}',
  created_at   timestamptz not null default now(),
  unique (user_id, product_id)
);

-- ── orders: payment + notes ───────────────────────────────────────────────────
alter table orders add column if not exists payment_status text default 'unpaid';
alter table orders add column if not exists customer_notes text;
alter table orders add column if not exists paystack_reference text;

-- ── RLS ───────────────────────────────────────────────────────────────────────
alter table customer_profiles enable row level security;
alter table wishlist_items enable row level security;

drop policy if exists "profiles_own" on customer_profiles;
create policy "profiles_own"
  on customer_profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "wishlist_own" on wishlist_items;
create policy "wishlist_own"
  on wishlist_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "orders_customer_read" on orders;
create policy "orders_customer_read"
  on orders for select
  using (auth.uid() = user_id);

-- Service role policies remain for API writes (checkout, admin)
