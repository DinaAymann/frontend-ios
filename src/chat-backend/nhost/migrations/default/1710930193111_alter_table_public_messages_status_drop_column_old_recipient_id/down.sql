alter table "public"."messages_status" alter column "old_recipient_id" drop not null;
alter table "public"."messages_status" add column "old_recipient_id" varchar;
