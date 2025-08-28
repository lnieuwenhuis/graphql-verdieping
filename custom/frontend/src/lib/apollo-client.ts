import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Create Apollo Client instance configured for Go GraphQL backend
const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:8080/query', // Go GraphQL server endpoint
  }),
  cache: new InMemoryCache(),
});

export default client;