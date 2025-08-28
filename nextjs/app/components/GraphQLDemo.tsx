'use client';

import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

// Define GraphQL queries
const GET_HELLO = gql`
  query GetHello {
    hello
  }
`;

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

// TypeScript interfaces for type safety
interface HelloData {
  hello: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface UsersData {
  users: User[];
}

export function GraphQLDemo() {
  const { loading: helloLoading, error: helloError, data: helloData } = useQuery<HelloData>(GET_HELLO);
  const { loading: usersLoading, error: usersError, data: usersData } = useQuery<UsersData>(GET_USERS);

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">GraphQL Hello Query</h2>
        {helloLoading && <p className="text-blue-600">Loading hello message...</p>}
        {helloError && <p className="text-red-600">Error: {helloError.message}</p>}
        {helloData && (
          <p className="text-green-600 font-medium">{helloData.hello}</p>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">GraphQL Users Query</h2>
        {usersLoading && <p className="text-blue-600">Loading users...</p>}
        {usersError && <p className="text-red-600">Error: {usersError.message}</p>}
        {usersData && (
          <div className="space-y-3">
            {usersData.users.map((user: User) => (
              <div key={user.id} className="border border-gray-200 dark:border-gray-600 p-3 rounded">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}