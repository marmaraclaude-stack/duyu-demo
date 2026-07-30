-- Duyu Konutları CRM · temel şema
-- lib/types.ts ile birebir eşleşir; uygulama lib/queries.ts üzerinden bağlanır.

create extension if not exists pgcrypto;

create type user_role as enum ('yonetici', 'temsilci');

create type lead_status as enum (
  'arandi', 'cevapsiz', 'mesgul', 'beklemede', 'tekrar-aranacak',
  'butce-asiyor', 'ofise-gelecek', 'formu-dolduran', 'ilgilenmiyor'
);

create type lead_source as enum (
  'instagram-form', 'facebook-form', 'web-form', 'referans', 'telefon'
);

create type blok as enum ('A', 'B', 'C');
create type unit_type as enum ('1+1', '2+1', '3+1');
create type reminder_type as enum ('arama', 'randevu');

create table app_users (
  id text primary key,
  name text not null,
  role user_role not null,
  title text not null,
  initials text not null,
  phone text not null
);

create table leads (
  id text primary key default ('l-' || substr(gen_random_uuid()::text, 1, 8)),
  name text not null,
  phone text not null,
  email text,
  status lead_status not null default 'formu-dolduran',
  source lead_source not null,
  blok blok,
  unit_no integer,
  unit_type unit_type,
  budget numeric(14, 2),
  assigned_to text not null references app_users (id),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_assigned_to_idx on leads (assigned_to);
create index leads_status_idx on leads (status);
create index leads_phone_idx on leads ((replace(phone, ' ', '')));

create table calls (
  id text primary key default ('c-' || substr(gen_random_uuid()::text, 1, 8)),
  lead_id text not null references leads (id) on delete cascade,
  agent_id text not null references app_users (id),
  at timestamptz not null default now(),
  result lead_status not null,
  note text not null,
  next_call_at timestamptz
);

create index calls_lead_id_idx on calls (lead_id, at desc);
create index calls_at_idx on calls (at desc);

create table reminders (
  id text primary key default ('r-' || substr(gen_random_uuid()::text, 1, 8)),
  lead_id text not null references leads (id) on delete cascade,
  agent_id text not null references app_users (id),
  type reminder_type not null default 'arama',
  due_at timestamptz not null,
  note text,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create index reminders_due_at_idx on reminders (due_at) where not done;
create index reminders_agent_idx on reminders (agent_id, due_at);

create table payment_plans (
  id text primary key default ('p-' || substr(gen_random_uuid()::text, 1, 8)),
  name text not null,
  blok blok not null,
  unit_type unit_type not null,
  list_price numeric(14, 2) not null,
  down_payment_pct integer not null,
  installment_months integer not null,
  cash_price numeric(14, 2),
  highlights text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table print_logs (
  id text primary key default ('pl-' || substr(gen_random_uuid()::text, 1, 8)),
  plan_id text not null references payment_plans (id) on delete cascade,
  agent_id text not null references app_users (id),
  lead_id text references leads (id) on delete set null,
  at timestamptz not null default now()
);

create table audit_logs (
  id text primary key default ('a-' || substr(gen_random_uuid()::text, 1, 8)),
  user_id text not null references app_users (id),
  action text not null,
  target text not null,
  detail text,
  at timestamptz not null default now()
);

create index audit_logs_at_idx on audit_logs (at desc);

-- updated_at bakımı
create or replace function set_updated_at()
returns trigger language plpgsql
set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger leads_set_updated_at
  before update on leads
  for each row execute function set_updated_at();

-- RLS: demo kurulumunda okuma anon'a açık, yazma service_role üzerinden.
-- Gerçek kullanıcı girişi eklendiğinde politikalar rollere göre daraltılmalı.
alter table app_users enable row level security;
alter table leads enable row level security;
alter table calls enable row level security;
alter table reminders enable row level security;
alter table payment_plans enable row level security;
alter table print_logs enable row level security;
alter table audit_logs enable row level security;

create policy "demo read app_users" on app_users for select using (true);
create policy "demo read leads" on leads for select using (true);
create policy "demo read calls" on calls for select using (true);
create policy "demo read reminders" on reminders for select using (true);
create policy "demo read payment_plans" on payment_plans for select using (true);
create policy "demo read print_logs" on print_logs for select using (true);
create policy "demo read audit_logs" on audit_logs for select using (true);
