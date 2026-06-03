-- Track signup source (newsletter, waitlist, etc.)
alter table newsletter_subscribers
  add column if not exists source text default 'newsletter';
