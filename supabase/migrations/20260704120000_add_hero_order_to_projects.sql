-- Featured hero-slider selection + ordering for projects.
-- Projects with a non-null hero_order appear in the homepage hero L-path
-- slider, sorted ascending. Managed from /admin/hero.
alter table projects add column if not exists hero_order integer;

create index if not exists idx_projects_hero_order
  on projects (hero_order)
  where hero_order is not null;
