BEGIN TRANSACTION;
ALTER TABLE "public"."groups_admins" DROP CONSTRAINT "groups_admins_pkey";

ALTER TABLE "public"."groups_admins"
    ADD CONSTRAINT "groups_admins_pkey" PRIMARY KEY ("admin_id", "group_id");
COMMIT TRANSACTION;
