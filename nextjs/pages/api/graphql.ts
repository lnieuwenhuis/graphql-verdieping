import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';
import { NextApiRequest } from 'next';

// Define your GraphQL schema
const typeDefs = gql`
  type Query {
    hello: String
    users: [User!]!
    posts: [Post!]!
    post(slug: String!): Post
    me: User
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
    token: String
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    slug: String!
    category: String!
    author: User!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  type Mutation {
    login(input: LoginInput!): User
    register(input: RegisterInput!): User
  }
`;

// Sample data
const users = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
];

const posts = [
  { id: '1', title: 'Post 1', content: 'Content of post 1', slug: 'post-1', category: 'Technology', authorId: '1' },
  { id: '2', title: 'Post 2', content: 'Content of post 2', slug: 'post-2', category: 'Design', authorId: '2' },
  { id: '3', title: 'Post 3', content: 'Content of post 3', slug: 'post-3', category: 'Business', authorId: '3' },
];

// Resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL in Next.js!',
    users: () => users,
    posts: () => posts,
    post: (_: any, { slug }: { slug: string }) => {
      return posts.find(post => post.slug === slug);
    },
  },
  Post: {
    author: (post: { authorId: string }) => {
      return users.find(user => user.id === post.authorId);
    },
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