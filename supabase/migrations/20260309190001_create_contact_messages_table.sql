-- Contact messages from the public contact form
create table contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text not null,
  message    text not null,
  read       boolean default false,
  created_at timestamptz default now()
);

-- RLS
alter table contact_messages enable row level security;

-- Anyone can submit a message (public insert)
create policy "Public insert" on contact_messages for insert with check (true);

-- Only authenticated users can read/update/delete
create policy "Auth read" on contact_messages for select using (auth.role() = 'authenticated');
create policy "Auth update" on contact_messages for update using (auth.role() = 'authenticated');
create policy "Auth delete" on contact_messages for delete using (auth.role() = 'authenticated');
