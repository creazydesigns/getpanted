-- Support tickets from client area feedback & queries

create table if not exists support_tickets (
  id              uuid primary key default gen_random_uuid(),
  ticket_number   text not null unique,
  user_id         uuid not null references auth.users(id) on delete cascade,
  customer_name   text not null,
  customer_email  text not null,
  subject         text not null,
  ticket_type     text not null check (ticket_type in ('query', 'feedback')),
  category        text not null,
  message         text not null,
  status          text not null default 'open',
  created_at      timestamptz not null default now()
);

create index if not exists support_tickets_user_id_idx on support_tickets (user_id);
create index if not exists support_tickets_ticket_number_idx on support_tickets (ticket_number);

alter table support_tickets enable row level security;

drop policy if exists "support_tickets_own_read" on support_tickets;
create policy "support_tickets_own_read"
  on support_tickets for select
  using (auth.uid() = user_id);

drop policy if exists "support_tickets_own_insert" on support_tickets;
create policy "support_tickets_own_insert"
  on support_tickets for insert
  with check (auth.uid() = user_id);
