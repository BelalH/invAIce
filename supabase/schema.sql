-- Run this in: https://supabase.com/dashboard/project/hifvbptrdhzcqbtuajkw/sql/new

create table if not exists proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  client_name text not null,
  client_email text,
  client_company text,
  client_vat_number text,
  client_country_code text,
  client_address text,

  title text not null,
  engagement_type text,
  scope_summary text,
  deliverables jsonb not null default '[]',
  timeline_start date,
  timeline_end date,
  timeline_notes text,

  currency text not null default 'EUR',
  rate_type text not null default 'project' check (rate_type in ('project','monthly','daily','hourly')),
  rate_amount numeric(12,2) not null default 0,
  payment_structure text not null default 'one-time' check (payment_structure in ('one-time','milestone','retainer')),
  payment_schedule jsonb not null default '[]',
  deposit_percent numeric(5,2),

  executive_summary text,
  scope_of_work text,
  terms_and_conditions text,
  next_steps text,
  original_prompt text,

  status text not null default 'draft' check (status in ('draft','sent','viewed','signed','declined','expired')),
  public_token text not null unique default encode(gen_random_bytes(18), 'hex'),

  stripe_payment_link_id text,
  stripe_payment_link_url text,
  stripe_payment_intent_id text,
  amount_paid numeric(12,2) not null default 0,

  pdf_url text,
  pdf_generated_at timestamptz,
  sent_at timestamptz,
  first_opened_at timestamptz,
  open_count integer not null default 0,
  signed_at timestamptz,
  declined_at timestamptz,
  expires_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table proposals enable row level security;

create policy "Users manage own proposals"
  on proposals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Public read for client-facing proposal pages (by token, no auth required)
create policy "Public read by token"
  on proposals for select
  using (true);

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger proposals_updated_at
  before update on proposals
  for each row execute function set_updated_at();
