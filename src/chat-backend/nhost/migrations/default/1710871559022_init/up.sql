SET check_function_bodies = false;
CREATE TABLE public.conversations (
    conversation_id character varying NOT NULL,
    type character varying
);
CREATE TABLE public.conversations_messages (
    message_id character varying NOT NULL,
    conversation_id character varying NOT NULL
);
CREATE TABLE public.conversations_users (
    conversation_id character varying NOT NULL,
    user_id character varying NOT NULL
);
CREATE TABLE public.groups (
    group_id character varying NOT NULL,
    group_name character varying,
    conversation_id character varying,
    owner_id character varying
);
CREATE TABLE public.groups_admins (
    admin_id character varying NOT NULL,
    group_id character varying NOT NULL
);
CREATE TABLE public.media_messages (
    media_message_id character varying NOT NULL,
    message_id character varying NOT NULL,
    media_content bytea,
    media_type character varying
);
CREATE TABLE public.messages (
    message_id character varying NOT NULL,
    sender_id character varying,
    "timestamp" timestamp without time zone,
    type character varying
);
CREATE TABLE public.messages_status (
    message_id character varying NOT NULL,
    recipient_id character varying NOT NULL,
    status character varying
);
CREATE TABLE public.text_messages (
    text_message_id character varying NOT NULL,
    message_id character varying NOT NULL,
    content character varying
);
CREATE TABLE public.users (
    user_id character varying NOT NULL,
    name character varying,
    phone character varying,
    "isActive" boolean
);
ALTER TABLE ONLY public.conversations_messages
    ADD CONSTRAINT conversations_messages_pkey PRIMARY KEY (message_id, conversation_id);
ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (conversation_id);
ALTER TABLE ONLY public.conversations_users
    ADD CONSTRAINT conversations_users_pkey PRIMARY KEY (conversation_id, user_id);
ALTER TABLE ONLY public.groups_admins
    ADD CONSTRAINT groups_admins_pkey PRIMARY KEY (admin_id, group_id);
ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (group_id);
ALTER TABLE ONLY public.media_messages
    ADD CONSTRAINT media_messages_pkey PRIMARY KEY (media_message_id, message_id);
ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (message_id);
ALTER TABLE ONLY public.messages_status
    ADD CONSTRAINT messages_status_pkey PRIMARY KEY (message_id, recipient_id);
ALTER TABLE ONLY public.text_messages
    ADD CONSTRAINT text_messages_pkey PRIMARY KEY (text_message_id, message_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
CREATE INDEX ix_media_messages_media_message_id ON public.media_messages USING btree (media_message_id);
CREATE INDEX ix_text_messages_text_message_id ON public.text_messages USING btree (text_message_id);
CREATE UNIQUE INDEX ix_users_phone ON public.users USING btree (phone);
CREATE INDEX ix_users_user_id ON public.users USING btree (user_id);
ALTER TABLE ONLY public.conversations_messages
    ADD CONSTRAINT conversations_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(conversation_id);
ALTER TABLE ONLY public.conversations_messages
    ADD CONSTRAINT conversations_messages_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.messages(message_id);
ALTER TABLE ONLY public.conversations_users
    ADD CONSTRAINT conversations_users_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(conversation_id);
ALTER TABLE ONLY public.conversations_users
    ADD CONSTRAINT conversations_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
ALTER TABLE ONLY public.groups_admins
    ADD CONSTRAINT groups_admins_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(user_id);
ALTER TABLE ONLY public.groups_admins
    ADD CONSTRAINT groups_admins_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(group_id);
ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(conversation_id);
ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(user_id);
ALTER TABLE ONLY public.media_messages
    ADD CONSTRAINT media_messages_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.messages(message_id);
ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(user_id);
ALTER TABLE ONLY public.messages_status
    ADD CONSTRAINT messages_status_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.messages(message_id);
ALTER TABLE ONLY public.messages_status
    ADD CONSTRAINT messages_status_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.users(user_id);
ALTER TABLE ONLY public.text_messages
    ADD CONSTRAINT text_messages_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.messages(message_id);
