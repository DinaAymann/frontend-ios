BEGIN TRANSACTION;
ALTER TABLE "public"."conversations_users" DROP CONSTRAINT "conversations_users_pkey";

ALTER TABLE "public"."conversations_users"
    ADD CONSTRAINT "conversations_users_pkey" PRIMARY KEY ("conversation_id", "user_id");
COMMIT TRANSACTION;
