alter table "public"."messages"
  add constraint "messages_sender_id_fkey"
  foreign key ("sender_id")
  references "auth"."users"
  ("id") on update restrict on delete restrict;
