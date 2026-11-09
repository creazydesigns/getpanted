-- ── Executive Edit pre-orders ─────────────────────────────────────────────────

create table if not exists executive_edit_orders (
  id                 uuid primary key default gen_random_uuid(),
  package            text not null check (package in ('classic', 'signature')),
  amount             numeric(10,2) not null,
  customer_name      text not null,
  customer_email     text not null,
  customer_phone     text not null,
  shipping_address   jsonb not null default '{}',
  selections         jsonb not null default '[]',
  customer_notes     text,
  payment_status     text not null default 'pending',
  paystack_reference text,
  payment_reference  text,
  status             text not null default 'pending',
  admin_notes        text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists executive_edit_orders_created_at_idx
  on executive_edit_orders (created_at desc);

create index if not exists executive_edit_orders_paystack_ref_idx
  on executive_edit_orders (paystack_reference);

alter table executive_edit_orders enable row level security;

drop policy if exists "executive_edit_service_all" on executive_edit_orders;
create policy "executive_edit_service_all"
  on executive_edit_orders for all using (true) with check (true);
