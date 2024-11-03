alter table "public"."conversation_users" drop constraint "conversation_users_conversation_id_fkey",
  add constraint "conversation_users_conversation_id_fkey"
  foreign key ("conversation_id")
  references "public"."conversations"
  ("id") on update restrict on delete restrict;
