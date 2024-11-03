alter table "public"."groups_admins" drop constraint "groups_admins_pkey";
alter table "public"."groups_admins"
    add constraint "groups_admins_pkey"
    primary key ("old_admin_id", "group_id");
