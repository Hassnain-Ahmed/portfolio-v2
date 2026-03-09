-- Contact info table (single-row, like profile)
create table contact_info (
  id              uuid primary key default gen_random_uuid(),
  location        text,
  email           text,
  availability    text,
  socials         jsonb default '[]'::jsonb,
  updated_at      timestamptz default now()
);

-- Trigger
create trigger contact_info_updated_at before update on contact_info
  for each row execute function public.update_updated_at();

-- RLS
alter table contact_info enable row level security;
create policy "Public read" on contact_info for select using (true);
create policy "Auth write" on contact_info for all using (auth.role() = 'authenticated');

-- Seed with current hardcoded data
insert into contact_info (location, email, availability, socials) values (
  'Islamabad, Pakistan',
  'dev.hassnain77@gmail.com',
  'Available for freelance projects',
  '[
    {"icon": "Github", "label": "GitHub", "href": "https://github.com/Hassnain-Ahmed", "handle": "@Hassnain-Ahmed"},
    {"icon": "Linkedin", "label": "LinkedIn", "href": "https://linkedin.com/in/hassnain-ahmed", "handle": "Hassnain Ahmed"},
    {"icon": "Mail", "label": "Email", "href": "mailto:dev.hassnain77@gmail.com", "handle": "dev.hassnain77@gmail.com"}
  ]'::jsonb
);
