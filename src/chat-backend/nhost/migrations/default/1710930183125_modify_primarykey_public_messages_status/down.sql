alter table "public"."messages_status" drop constraint "messages_status_pkey";
alter table "public"."messages_status"
    add constraint "messages_status_pkey"
    primary key ("message_id", "old_recipient_id");
