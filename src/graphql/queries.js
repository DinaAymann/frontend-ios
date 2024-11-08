import { gql } from '@apollo/client';

export const CREATE_CHAT = gql`
  mutation CreateChat($user1_id: uuid!, $user2_id: uuid!) {
    insert_Chats_one(object: { user1_id: $user1_id, user2_id: $user2_id }) {
      id
    }
  }
`;


export const SEND_MESSAGE = gql`
  mutation SendMessage($chat_id: uuid!, $sender_id: uuid!, $content: String!) {
    insert_messages_one(object: { chat_id: $chat_id, sender_id: $sender_id, content: $content }) {
      id
      content
      created_at
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($name: String!, $nickname: String!, $birthdate: String!) {
    createUser(input: { name: $name, nickname: $nickname, birthdate: $birthdate }) {
      user {
        id
        name
        nickname
        birthdate
      }
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { timestamp: asc }) {
      id
      content
      sender_id
      created_at
    }
  }
`;

export const NEW_MESSAGES_SUBSCRIPTION = gql`
  subscription OnNewMessage($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { timestamp: asc }) {
      id
      content
      sender_id
            created_at

    }
  }
`;
