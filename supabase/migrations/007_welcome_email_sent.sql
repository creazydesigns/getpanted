-- Track account welcome email (avoid duplicate sends on OAuth callback + signup)

alter table customer_profiles add column if not exists welcome_email_sent_at timestamptz;
