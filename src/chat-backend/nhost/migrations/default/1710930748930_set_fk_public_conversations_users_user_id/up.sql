alter table "public"."conversations_users"
  add constraint "conversations_users_user_id_fkey"
  foreign key ("user_id")
  references "auth"."users"
  ("id") on update restrict on delete restrict;
