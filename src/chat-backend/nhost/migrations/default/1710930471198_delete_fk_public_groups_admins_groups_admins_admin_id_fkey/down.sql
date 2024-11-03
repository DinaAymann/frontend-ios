alter table "public"."groups_admins"
  add constraint "groups_admins_admin_id_fkey"
  foreign key ("old_admin_id")
  references "public"."users"
  ("user_id") on update no action on delete no action;
