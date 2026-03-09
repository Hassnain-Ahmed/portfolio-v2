-- Remove the CHECK constraint on projects.folder to allow dynamic folder creation
alter table projects drop constraint if exists projects_folder_check;
