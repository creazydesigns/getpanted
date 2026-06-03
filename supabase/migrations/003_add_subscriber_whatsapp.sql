-- WhatsApp number for waitlist / ad landing signups
alter table newsletter_subscribers
  add column if not exists whatsapp text;
