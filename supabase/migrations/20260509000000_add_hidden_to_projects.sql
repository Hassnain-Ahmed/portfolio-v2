-- Add hidden flag to projects for admin hide/unhide control.
-- Defaults to false so existing projects remain visible.
alter table projects
  add column hidden boolean not null default false;
