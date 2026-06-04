-- ── GetPanted — Waitlist (newsletter_subscribers) ─────────────────────────────
-- Run in Supabase Dashboard → SQL Editor → New query → Run
--
-- Stores signups from /waitlist (source = 'waitlist', optional whatsapp).

create extension if not exists "pgcrypto";

create table if not exists newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  first_name    text,
  source        text default 'newsletter',
  whatsapp      text,
  subscribed_at timestamptz not null default now(),
  active        boolean not null default true
);

-- Safe if you already ran older migrations without these columns
alter table newsletter_subscribers
  add column if not exists source text default 'newsletter';

alter table newsletter_subscribers
  add column if not exists whatsapp text;

alter table newsletter_subscribers enable row level security;

drop policy if exists "newsletter_service_all" on newsletter_subscribers;

create policy "newsletter_service_all"
  on newsletter_subscribers
  for all
  using (true)
  with check (true);
