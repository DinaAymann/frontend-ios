alter table "public"."conversations"
  add constraint "conversations_type_fkey"
  foreign key ("type")
  references "public"."enum_conversation_type"
  ("value") on update restrict on delete restrict;
