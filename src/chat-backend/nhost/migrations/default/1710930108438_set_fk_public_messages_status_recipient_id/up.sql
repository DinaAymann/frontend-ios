alter table "public"."messages_status"
  add constraint "messages_status_recipient_id_fkey"
  foreign key ("recipient_id")
  references "auth"."users"
  ("id") on update restrict on delete restrict;
