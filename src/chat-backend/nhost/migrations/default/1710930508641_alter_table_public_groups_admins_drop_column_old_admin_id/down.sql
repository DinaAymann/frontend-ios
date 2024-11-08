alter table "public"."groups_admins" alter column "old_admin_id" drop not null;
alter table "public"."groups_admins" add column "old_admin_id" varchar;
