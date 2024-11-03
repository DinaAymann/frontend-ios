alter table "public"."groups_admins"
  add constraint "groups_admins_admin_id_fkey"
  foreign key ("admin_id")
  references "auth"."users"
  ("id") on update restrict on delete restrict;
