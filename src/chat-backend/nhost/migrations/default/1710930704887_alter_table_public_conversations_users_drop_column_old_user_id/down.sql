alter table "public"."conversations_users"
  add constraint "conversations_users_user_id_fkey"
  foreign key (old_user_id)
  references "public"."users"
  (user_id) on update no action on delete no action;
alter table "public"."conversations_users" alter column "old_user_id" drop not null;
alter table "public"."conversations_users" add column "old_user_id" varchar;
