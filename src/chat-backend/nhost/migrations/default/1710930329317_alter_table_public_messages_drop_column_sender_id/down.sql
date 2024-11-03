alter table "public"."messages"
  add constraint "messages_sender_id_fkey"
  foreign key (sender_id)
  references "public"."users"
  (user_id) on update no action on delete no action;
alter table "public"."messages" alter column "sender_id" drop not null;
alter table "public"."messages" add column "sender_id" varchar;
