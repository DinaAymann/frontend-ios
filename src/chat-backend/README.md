# Messenger Project Backend Documentation

## Overview
Welcome to the backend documentation for the Messenger project. This document is designed to help the UI team start developing the frontend using React.js with a backend powered by Nhost and Hasura. This guide covers the essentials to get you started, including API usage examples and development setup.

## Table of Contents
1. [Introduction](#introduction)
2. [Setting Up the Development Environment](#setting-up-the-development-environment)
3. [API Usage Examples](#api-usage-examples)
    - [Authentication](#authentication)
        - [Sign In](#sign-in)
        - [Sign Up](#sign-up)
    - [GraphQL Queries and Mutations](#graphql-queries-and-mutations)
4. [Known Limitations](#known-limitations)
5. [Additional Resources](#additional-resources)

## Introduction
The backend for our Messenger project is hosted on Nhost, which utilizes Hasura for GraphQL APIs. Nhost can be self-hosted in the future if needed. This documentation will guide you through setting up your development environment and using various API endpoints necessary for building the frontend in React.js.

## Setting Up the Development Environment
To set up the development environment locally, follow these steps:

1. **Install Nhost CLI**: The Nhost CLI allows you to run the Nhost environment locally.

2. **Register on the Nhost Website**: Go to [Nhost](https://app.nhost.io) and register for an account.

3. **Provide Account Information**: Share your Nhost account details with the project manager or the person in charge to get access to the project resources.

4. **Start Project Locally Using Nhost CLI**: For detailed instructions, refer to the [Nhost CLI Getting Started Guide](https://docs.nhost.io/development/cli/getting-started).

## API Usage Examples

### Authentication

#### Sign In
Use the following shell script to sign in a user.
Refer to [sign_in.sh](examples/sign_in.sh) for getting the login token.

#### Sign Up
Use the following shell script to sign up a new user.
Refer to [sign_up.sh](examples/sign_up.sh) to create new user.


### GraphQL Queries and Mutations

#### Create Group Chat
Refer to [create_group_chat.graphql](examples/graphql/create_group_chat.graphql) for the GraphQL mutation to create a group chat.

#### Create One-to-One Chat
Refer to [create_one_to_one_chat.graphql](examples/graphql/create_one_to_one_chat.graphql) for the GraphQL mutation to create a one-to-one chat.

#### Get Conversations List
Refer to [get_conversations_list.graphql](examples/graphql/get_conversations_list.graphql) for the GraphQL query to get the list of conversations.

#### Get Enums List
Refer to [get_enums_list.graphql](examples/graphql/get_enums_list.graphql) for the GraphQL query to get the list of enums. Enums are currently divided into two categories: enum_conversation_role and enum_conversation_type. `enum_conversation_role` represents the roles within group chats (e.g., admin, member, etc.). `enum_conversation_type` defines the type of conversation (e.g., group or one-to-one). These enums help UI developers avoid hardcoding roles and types, ensuring consistency and maintainability in the application.

#### Get Users List
Refer to [get_users_list.graphql](examples/graphql/get_users_list.graphql) for the GraphQL query to get the list of users.

#### Send Message
Refer to [send_message.graphql](examples/graphql/send_message.graphql) for the GraphQL mutation to send a message in a chat.

#### Send Message With Fle
Refer to [send_message_with_file.graphql](examples/graphql/send_message_with_file.graphql) for the GraphQL mutation to send a message that has attachment in a chat. Before sending the message you should obtain the file id by uploading the file to the backend storage. See [more info](https://docs.nhost.io/reference/javascript/storage/upload). 

#### Watch Conversation
Refer to [watch_conversation.graphql](examples/graphql/watch_conversation.graphql) for the GraphQL subscription to watch a conversation.

## Known Limitations
- **Group Chats**: Group chats currently do not respect user chat roles. You can add roles, but they do not affect backend operations. This limitation should not significantly impact the development of the user interface.
- **Message Attachments**: Currently only one attachment can be added to the message in chat. 
- **Unread Messages**: Messages aren't marked as read/unread at the moment.

## Additional Resources
- [Hasura Documentation](https://hasura.io/docs/latest/getting-started/overview/)
- [Nhost Documentation](https://docs.nhost.io/)
- [React Quick Start](https://docs.nhost.io/guides/quickstarts/react)

This document should provide the necessary information to get started with frontend development. If you have any questions or need further assistance, please reach out.