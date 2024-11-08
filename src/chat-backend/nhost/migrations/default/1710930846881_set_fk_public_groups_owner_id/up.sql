alter table "public"."groups"
  add constraint "groups_owner_id_fkey"
  foreign key ("owner_id")
  references "auth"."users"
  ("id") on update restrict on delete restrict;
