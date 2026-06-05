-- Admin dashboard: extended schema, site content, storage bucket

-- ── orders ────────────────────────────────────────────────────────────────────
alter table orders add column if not exists tracking_number text;
alter table orders add column if not exists admin_notes text;
alter table orders add column if not exists shipping_amount numeric(10,2) default 0;

-- ── products (CMS fields) ───────────────────────────────────────────────────
alter table products add column if not exists slug text unique;
alter table products add column if not exists description text default '';
alter table products add column if not exists status text not null default 'active';
alter table products add column if not exists stock_by_size jsonb not null default '{}';
alter table products add column if not exists images text[] not null default '{}';
alter table products add column if not exists total_stock integer not null default 0;

-- Backfill slug from name for existing rows
update products set slug = lower(regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g'))
where slug is null;

update products set images = array[image]
where (images is null or images = '{}') and image is not null and image <> '';

update products set total_stock = 10 where total_stock = 0 and in_stock = true;
update products set total_stock = 0 where in_stock = false;

-- ── bespoke_orders ────────────────────────────────────────────────────────────
alter table bespoke_orders add column if not exists admin_notes text;
alter table bespoke_orders add column if not exists contacted_at timestamptz;

update bespoke_orders set status = 'new' where status = 'pending';

-- ── site_content ──────────────────────────────────────────────────────────────
create table if not exists site_content (
  key         text primary key,
  value       text not null default '',
  updated_at  timestamptz not null default now()
);

alter table site_content enable row level security;

create policy "site_content_public_read" on site_content for select using (true);
create policy "site_content_service_all" on site_content for all using (true) with check (true);

-- ── Storage: product-images bucket ──────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set public = true;

create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "product_images_service_upload" on storage.objects
  for all using (bucket_id = 'product-images') with check (bucket_id = 'product-images');

-- Service role policies for admin API (products write)
create policy "products_service_all" on products for all using (true) with check (true);
create policy "orders_service_all" on orders for all using (true) with check (true);
create policy "bespoke_service_all" on bespoke_orders for all using (true) with check (true);
