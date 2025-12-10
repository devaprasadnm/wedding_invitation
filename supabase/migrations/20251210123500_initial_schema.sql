-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, service_role;

-- 1. Admins Table (Linked to Supabase Auth)
create table admins (
  id uuid primary key default gen_random_uuid(),
  supabase_auth_uid uuid references auth.users(id) on delete cascade not null,
  email text not null,
  name text,
  created_at timestamptz default now()
);
alter table admins enable row level security;

-- 2. Templates Table
create table templates (
  id text primary key, -- stored as 'simple', 'elegant', etc.
  name text not null,
  slug text unique not null,
  config jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
alter table templates enable row level security;

-- Insert default templates
insert into templates (id, name, slug) values
('simple', 'Simple Clean', 'simple'),
('elegant', 'Classic Elegant', 'elegant'),
('motion', 'Motion Story', 'motion');

-- 3. Clients Table
create table clients (
  id uuid primary key default gen_random_uuid(),
  couple_name text not null,
  contact_email text,
  slug text unique not null,
  template_id text references templates(id) on delete set null,
  created_at timestamptz default now()
);
alter table clients enable row level security;
create index clients_slug_idx on clients (slug);

-- 4. Ceremonies Table
create table ceremonies (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade not null,
  title text not null,
  date_time timestamptz not null,
  venue text,
  map_url text,
  notes text,
  created_at timestamptz default now()
);
alter table ceremonies enable row level security;

-- 5. Photos Table
create table photos (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade not null,
  storage_path text not null,
  filename text not null,
  width int,
  height int,
  created_at timestamptz default now()
);
alter table photos enable row level security;

-- 6. RSVPs Table
create table rsvps (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade not null,
  name text not null,
  email text,
  response text check (response in ('yes', 'no', 'maybe')),
  message text,
  created_at timestamptz default now()
);
alter table rsvps enable row level security;

-- --- RLS POLICIES ---

-- Admins can do everything
create policy "Admins have full access" on admins
  for all using (auth.uid() = supabase_auth_uid);

-- For now, let's assume we implement a server-side check or use a service key for admin operations.
-- But if using Supabase client on frontend for admin:
-- (We will add strict policies later or rely on backend services with SERVICE_ROLE_KEY)

-- Public Access Policies (for the Invite Page)
-- Clients: Public read by slug
create policy "Public can view clients" on clients
  for select using (true);

-- Ceremonies: Public read
create policy "Public can view ceremonies" on ceremonies
  for select using (true);

-- Photos: Public read
create policy "Public can view photos" on photos
  for select using (true);

-- Templates: Public read
create policy "Public can view templates" on templates
  for select using (true);

-- RSVPs: Public create (Insert only)
create policy "Public can create rsvps" on rsvps
  for insert with check (true);
