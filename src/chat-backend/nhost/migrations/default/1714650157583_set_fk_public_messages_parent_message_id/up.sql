alter table "public"."messages"
  add constraint "messages_parent_message_id_fkey"
  foreign key ("parent_message_id")
  references "public"."messages"
  ("id") on update restrict on delete restrict;
