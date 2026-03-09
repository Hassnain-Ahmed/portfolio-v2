-- Languages table for about section
create table languages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  percentage int not null,
  color      text not null,
  sort_order int default 0
);

-- RLS
alter table languages enable row level security;
create policy "Public read" on languages for select using (true);
create policy "Auth write" on languages for all using (auth.role() = 'authenticated');

-- Seed with current defaults
insert into languages (name, percentage, color, sort_order) values
  ('TypeScript', 42, '#3178C6', 0),
  ('JavaScript', 22, '#F7DF1E', 1),
  ('Python', 14, '#3572A5', 2),
  ('CSS', 12, '#563D7C', 3),
  ('Other', 10, '#9CA3AF', 4);
