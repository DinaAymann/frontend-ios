alter table "public"."conversations" drop constraint "conversation_title_check";
alter table "public"."conversations" add constraint "conversation_title_check" check (CHECK (title IS NULL AND type = 'ONE_TO_ONE'::text OR title IS NOT NULL AND type <> 'ONE_TO_ONE'::text));
