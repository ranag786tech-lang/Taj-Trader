-- Taj Traders FSD catalog schema and RLS
create extension if not exists pgcrypto;

do $$ begin
  create type public.quote_status as enum ('NEW', 'CONTACTED', 'COMPLETED', 'CANCELLED');
exception when duplicate_object then null;
end $$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  image text,
  icon text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  logo text,
  description text,
  is_verified boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  category_id uuid not null references public.categories(id) on delete restrict,
  brand_id uuid not null references public.brands(id) on delete restrict,
  sizes text[] not null default '{}',
  finish_type text,
  coverage text,
  price numeric(12,2),
  ask_price boolean not null default true,
  images text[] not null default '{}',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  stock_status text not null default 'IN_STOCK' check (stock_status in ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_price_nonnegative check (price is null or price >= 0)
);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  project_type text not null,
  area_size text,
  products text,
  delivery boolean not null default false,
  message text,
  status public.quote_status not null default 'NEW',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_brand_id_idx on public.products(brand_id);
create index if not exists products_featured_active_idx on public.products(is_featured, is_active);
create index if not exists quote_requests_status_created_at_idx on public.quote_requests(status, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at before update on public.categories for each row execute function public.set_updated_at();
drop trigger if exists brands_set_updated_at on public.brands;
create trigger brands_set_updated_at before update on public.brands for each row execute function public.set_updated_at();
drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products for each row execute function public.set_updated_at();
drop trigger if exists quote_requests_set_updated_at on public.quote_requests;
create trigger quote_requests_set_updated_at before update on public.quote_requests for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.quote_requests enable row level security;

drop policy if exists "public can view active categories" on public.categories;
create policy "public can view active categories" on public.categories for select to anon, authenticated using (is_active = true);
drop policy if exists "public can view active brands" on public.brands;
create policy "public can view active brands" on public.brands for select to anon, authenticated using (is_active = true and is_verified = true);
drop policy if exists "public can view active products" on public.products;
create policy "public can view active products" on public.products for select to anon, authenticated using (is_active = true);
drop policy if exists "public can submit quote requests" on public.quote_requests;
create policy "public can submit quote requests" on public.quote_requests for insert to anon, authenticated with check (length(trim(name)) between 2 and 100 and length(trim(phone)) between 7 and 30);

grant usage on schema public to anon, authenticated;
grant select on public.categories, public.brands, public.products to anon, authenticated;
grant insert on public.quote_requests to anon, authenticated;
revoke update, delete on public.categories, public.brands, public.products, public.quote_requests from anon, authenticated;

-- Admin mutations are intentionally reserved for trusted server-side code using the Supabase secret key.
-- Never expose SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY to browser code.
