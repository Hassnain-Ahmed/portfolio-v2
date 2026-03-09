-- Projects table
create table projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  file_name   text not null,
  folder      text not null check (folder in ('Websites','Open Source','Experiments')),
  description text,
  image_url   text,
  tech_stack  text[] default '{}',
  url         text,
  year        text,
  sort_order  int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Process steps table
create table process_steps (
  id          uuid primary key default gen_random_uuid(),
  step_number int not null unique,
  label       text not null,
  icon_name   text not null,
  image_url   text,
  description text,
  bullets     text[] default '{}',
  updated_at  timestamptz default now()
);

-- Profile table (single-row)
create table profile (
  id           uuid primary key default gen_random_uuid(),
  name         text,
  handle       text,
  title        text,
  bio          text,
  avatar_url   text,
  location     text,
  email        text,
  status_emoji text,
  status_text  text,
  highlights   text[] default '{}',
  updated_at   timestamptz default now()
);

-- Experience table
create table experience (
  id          uuid primary key default gen_random_uuid(),
  role        text not null,
  company     text not null,
  period      text,
  description text,
  sort_order  int default 0
);

-- Skills table
create table skills (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  sort_order int default 0
);

-- updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply triggers
create trigger projects_updated_at before update on projects
  for each row execute function update_updated_at();
create trigger process_steps_updated_at before update on process_steps
  for each row execute function update_updated_at();
create trigger profile_updated_at before update on profile
  for each row execute function update_updated_at();

-- RLS
alter table projects enable row level security;
alter table process_steps enable row level security;
alter table profile enable row level security;
alter table experience enable row level security;
alter table skills enable row level security;

-- Public read policies
create policy "Public read" on projects for select using (true);
create policy "Public read" on process_steps for select using (true);
create policy "Public read" on profile for select using (true);
create policy "Public read" on experience for select using (true);
create policy "Public read" on skills for select using (true);

-- Authenticated write policies
create policy "Auth write" on projects for all using (auth.role() = 'authenticated');
create policy "Auth write" on process_steps for all using (auth.role() = 'authenticated');
create policy "Auth write" on profile for all using (auth.role() = 'authenticated');
create policy "Auth write" on experience for all using (auth.role() = 'authenticated');
create policy "Auth write" on skills for all using (auth.role() = 'authenticated');

-- Storage bucket
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Public read" on storage.objects for select using (bucket_id = 'portfolio-images');
create policy "Auth upload" on storage.objects for insert with check (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');
create policy "Auth update" on storage.objects for update using (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');
create policy "Auth delete" on storage.objects for delete using (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');
