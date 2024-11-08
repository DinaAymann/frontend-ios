alter table "public"."messages_status"
  add constraint "messages_status_recipient_id_fkey"
  foreign key ("recipient_id")
  references "public"."users"
  ("user_id") on update no action on delete no action;
