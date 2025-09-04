import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create auth link to add authorization header
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Create HTTP link
const httpLink = new HttpLink({
  uri: 'http://localhost:8080/query', // Go GraphQL server endpoint
});

// Create Apollo Client instance configured for Go GraphQL backend
const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;