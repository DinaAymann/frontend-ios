alter table "public"."conversations_users"
  add constraint "conversations_users_conversation_id_fkey"
  foreign key ("old_conversation_id")
  references "public"."conversations"
  ("conversation_id") on update no action on delete no action;
