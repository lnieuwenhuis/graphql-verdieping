import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: '/api/graphql', // Use relative path for same-origin requests
  }),
  cache: new InMemoryCache(),
});

export default client;