BEGIN TRANSACTION;
ALTER TABLE "public"."messages_status" DROP CONSTRAINT "messages_status_pkey";

ALTER TABLE "public"."messages_status"
    ADD CONSTRAINT "messages_status_pkey" PRIMARY KEY ("message_id", "recipient_id");
COMMIT TRANSACTION;
