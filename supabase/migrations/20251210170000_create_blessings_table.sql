-- Create Blessings Table
create table blessings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade not null,
  name text not null,
  message text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table blessings enable row level security;

-- Policies
-- Public can view blessings (so everyone can see the board)
create policy "Public can view blessings" on blessings
  for select using (true);

-- Public can insert blessings (to send wishes)
create policy "Public can insert blessings" on blessings
  for insert with check (true);
