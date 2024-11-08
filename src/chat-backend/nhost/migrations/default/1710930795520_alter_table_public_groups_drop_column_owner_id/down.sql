alter table "public"."groups"
  add constraint "groups_owner_id_fkey"
  foreign key (owner_id)
  references "public"."users"
  (user_id) on update no action on delete no action;
alter table "public"."groups" alter column "owner_id" drop not null;
alter table "public"."groups" add column "owner_id" varchar;
