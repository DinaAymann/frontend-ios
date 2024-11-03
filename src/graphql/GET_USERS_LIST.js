import { gql } from '@apollo/client';

const GET_USERS_LIST = gql`
 query GetUsersList {
 
    users {
        createdAt
        id
        displayName
    }
}
`;

export default GET_USERS_LIST;
