drop table if exists "new_groups_users" cascade;
drop table if exists "new_groups" cascade;
drop table if exists "messages" cascade;
drop table if exists "conversations_users" cascade;
drop table if exists "conversations" cascade;
drop table if exists "conversations_messages" cascade;
drop table if exists "users" cascade;
drop table if exists "media_messages" cascade;
drop table if exists "text_messages" cascade;
drop table if exists "messages_status" cascade;
drop table if exists "groups_admins" cascade;
drop table if exists "groups" cascade;

CREATE TABLE "public"."enum_conversation_type" ("value" text NOT NULL, "comment" text NOT NULL, PRIMARY KEY ("value") );COMMENT ON TABLE "public"."enum_conversation_type" IS E'Describes possible conversation types: group, one-to-one etc';

INSERT INTO enum_conversation_type (value, comment) VALUES
  ('GROUP', 'Grouop chats'),
  ('ONE_TO_ONE', 'One to one chats');

CREATE TABLE "public"."conversations" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "author_id" uuid NOT NULL, "type" text NOT NULL, "title" varchar, PRIMARY KEY ("id") , FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id") ON UPDATE restrict ON DELETE restrict);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_conversations_updated_at"
BEFORE UPDATE ON "public"."conversations"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_conversations_updated_at" ON "public"."conversations"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table public.conversations
    add constraint title_is_not_for_one_to_one
        check ((title is NULL AND type = 'ONE_TO_ONE') OR (title is not null AND type <> 'ONE_TO_ONE'));

alter table public.conversations
    rename constraint title_is_not_for_one_to_one to conversation_title_check;

CREATE TABLE "public"."enum_conversation_role" ("value" text NOT NULL, "comment" text NOT NULL, PRIMARY KEY ("value") );COMMENT ON TABLE "public"."enum_conversation_role" IS E'Defines possible user roles in conversations.';

INSERT INTO enum_conversation_role (value, comment) VALUES
  ('GROUP_OWNER', 'Owner of group'),
  ('GROUP_ADMIN', 'Group admin'),
  ('GROUP_MEMBER', 'Member in group');

CREATE TABLE "public"."conversation_users" ("created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "conversation_id" uuid NOT NULL, "role" text NOT NULL, PRIMARY KEY ("user_id","conversation_id") , FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("role") REFERENCES "public"."enum_conversation_role"("value") ON UPDATE restrict ON DELETE restrict);COMMENT ON TABLE "public"."conversation_users" IS E'Table to link users and conversations and to define their roles in conversation.';
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_conversation_users_updated_at"
BEFORE UPDATE ON "public"."conversation_users"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_conversation_users_updated_at" ON "public"."conversation_users"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
