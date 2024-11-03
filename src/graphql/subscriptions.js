import { gql } from '@apollo/client';

export const WATCH_CONVERSATION = gql`
subscription WatchConversation($id: ID!) {
    conversations_by_pk(id: $id) {
        created_at
        type
        title
        messages {
            text
            created_at
            user {
                displayName
                avatarUrl
            }
            file {
                id
                mimeType
                size
            }
        }
    }
}`;
