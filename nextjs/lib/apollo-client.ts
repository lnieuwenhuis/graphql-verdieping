import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create auth link to add authorization header
const authLink = setContext((_, { headers }) => {
  // Get auth token from local storage if available
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('authToken');
  }
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Create HTTP link
const httpLink = new HttpLink({
  uri: '/api/graphql', // Local Next.js API route
});

// Create Apollo Client instance configured for Go GraphQL backend
const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;