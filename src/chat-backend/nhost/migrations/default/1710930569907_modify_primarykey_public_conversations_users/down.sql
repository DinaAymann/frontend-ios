alter table "public"."conversations_users" drop constraint "conversations_users_pkey";
alter table "public"."conversations_users"
    add constraint "conversations_users_pkey"
    primary key ("old_conversation_id", "user_id");
