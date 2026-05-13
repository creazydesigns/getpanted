-- ── GetPanted — Initial Schema ────────────────────────────────────────────────
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ── products ──────────────────────────────────────────────────────────────────
create table if not exists products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  price         numeric(10,2) not null,
  original_price numeric(10,2),
  category      text not null,
  badge         text,
  sizes         text[] not null default '{}',
  colors        text[] not null default '{}',
  image         text not null default '',
  in_stock      boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ── orders ────────────────────────────────────────────────────────────────────
create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid,
  customer_name     text not null,
  customer_email    text not null,
  customer_phone    text not null,
  shipping_address  jsonb not null,
  items             jsonb not null,
  total_amount      numeric(10,2) not null,
  status            text not null default 'pending',
  payment_reference text,
  created_at        timestamptz not null default now()
);

-- ── bespoke_orders ────────────────────────────────────────────────────────────
create table if not exists bespoke_orders (
  id             uuid primary key default gen_random_uuid(),
  customer_name  text not null,
  customer_email text not null,
  customer_phone text not null,
  silhouette     text not null,
  waist_style    text not null,
  pleat_style    text not null,
  fabric         text not null,
  color          text not null,
  measurements   jsonb not null default '{}',
  timeline       text not null,
  notes          text,
  status         text not null default 'pending',
  created_at     timestamptz not null default now()
);

-- ── newsletter_subscribers ────────────────────────────────────────────────────
create table if not exists newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  first_name    text,
  subscribed_at timestamptz not null default now(),
  active        boolean not null default true
);

-- ── cart_items (persistent cart) ──────────────────────────────────────────────
create table if not exists cart_items (
  id         uuid primary key default gen_random_uuid(),
  session_id text not null,
  product_id uuid references products(id) on delete cascade,
  size       text not null,
  quantity   integer not null default 1,
  created_at timestamptz not null default now()
);

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table products             enable row level security;
alter table orders               enable row level security;
alter table bespoke_orders       enable row level security;
alter table newsletter_subscribers enable row level security;
alter table cart_items           enable row level security;

-- Public read on products
create policy "products_public_read" on products for select using (true);

-- Service role can do everything (used in API routes with admin client)
create policy "orders_service_insert"         on orders              for insert with check (true);
create policy "bespoke_service_insert"        on bespoke_orders      for insert with check (true);
create policy "newsletter_service_all"        on newsletter_subscribers for all using (true);
create policy "cart_items_session_all"        on cart_items          for all using (true);

-- ── Seed: products ───────────────────────────────────────────────────────────
INSERT INTO products (id, name, price, category, badge, sizes, colors, image, in_stock) VALUES
(gen_random_uuid(), 'The Royal Pleat',   45000, 'solid', 'Bestseller', ARRAY['XS','S','M','L','XL','2XL'],       ARRAY['#6B2D8B'], '/images/gp-royal-pleat.png',      true),
(gen_random_uuid(), 'Onyx Statement',    38000, 'solid', 'New',        ARRAY['XS','S','M','L','XL','2XL','3XL'], ARRAY['#1a1a1a'], '/images/gp-onyx-statement.png',   true),
(gen_random_uuid(), 'Ivory Sovereign',   42000, 'solid', 'New',        ARRAY['S','M','L','XL'],                  ARRAY['#f5f0e8'], '/images/gp-ivory-sovereign.png',  true),
(gen_random_uuid(), 'Sahara Wide',       36000, 'solid', 'New',        ARRAY['XS','S','M','L','XL','2XL'],       ARRAY['#c4a882'], '/images/gp-sahara-wide.png',      true),
(gen_random_uuid(), 'Petal Pleat',       40000, 'solid', 'New',        ARRAY['XS','S','M','L','XL','2XL'],       ARRAY['#f4a7b9'], '/images/gp-petal-pleat.png',      true),
(gen_random_uuid(), 'Eden Wide',         40000, 'solid', 'New',        ARRAY['S','M','L','XL','2XL'],            ARRAY['#4CAF50'], '/images/gp-eden-wide.png',        true),
(gen_random_uuid(), 'Solar Statement',   38000, 'solid', 'New',        ARRAY['XS','S','M','L','XL'],             ARRAY['#FFC107'], '/images/gp-solar-statement.png',  true),
(gen_random_uuid(), 'Nude Palazzo',      44000, 'solid', NULL,         ARRAY['S','M','L','XL','2XL'],            ARRAY['#d4b896'], '/images/gp-nude-palazzo.png',     true),
(gen_random_uuid(), 'Cacao Wide',        44000, 'solid', NULL,         ARRAY['XS','S','M','L','XL'],             ARRAY['#3E1C0D'], '/images/gp-cacao-wide.png',       true),
(gen_random_uuid(), 'Blush Ultra Wide',  46000, 'solid', 'New',        ARRAY['S','M','L','XL','2XL','3XL'],      ARRAY['#E8A0A0'], '/images/gp-blush-ultra-wide.png', true),
(gen_random_uuid(), 'Peach Sovereign',   42000, 'solid', NULL,         ARRAY['XS','S','M','L','XL'],             ARRAY['#FFAB76'], '/images/gp-peach-sovereign.png',  true),
(gen_random_uuid(), 'Lemon Luxe',        40000, 'solid', 'New',        ARRAY['S','M','L','XL','2XL'],            ARRAY['#F9F06B'], '/images/gp-lemon-luxe.png',       true);
