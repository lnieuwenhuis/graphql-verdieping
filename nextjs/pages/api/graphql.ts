import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';
import { NextApiRequest } from 'next';

// Define your GraphQL schema
const typeDefs = gql`
  type Query {
    hello: String
    users: [User!]!
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
  }
`;

// Sample data
const users = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
];

// Define resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL in Next.js!',
    users: () => users,
  },
};

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create the handler for Next.js API routes (Pages Router)
const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextApiRequest) => ({ req }),
});

// Default export for Pages Router
export default handler;