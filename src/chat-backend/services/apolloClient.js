import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({
  uri: 'https://ddddhshkcmplqkdeivjc.graphql.eu-central-1.nhost.run/v1',
});

const wsLink = new WebSocketLink({
  uri: 'wss://ddddhshkcmplqkdeivjc.graphql.eu-central-1.nhost.run/v1', 
  options: {
    reconnect: true,
   
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
