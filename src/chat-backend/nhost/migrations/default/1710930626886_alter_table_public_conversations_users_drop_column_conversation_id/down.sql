alter table "public"."conversations_users" alter column "conversation_id" drop not null;
alter table "public"."conversations_users" add column "conversation_id" uuid;
