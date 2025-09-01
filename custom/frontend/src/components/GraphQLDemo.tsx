import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
    }
  }
`;

interface User {
  id: string;
  name: string;
}

interface UsersData {
  users: User[];
}

export function GraphQLDemo() {
  const { loading: usersLoading, error: usersError, data: usersData } = useQuery<UsersData>(GET_USERS);

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">GraphQL Users Query</h2>
        {usersLoading && <p className="text-blue-600">Loading users...</p>}
        {usersError && <p className="text-red-600">Error: {usersError.message}</p>}
        {usersData && (
          <div className="space-y-3">
            {usersData.users.map((user: User) => (
              <div key={user.id} className="border border-gray-200 dark:border-gray-600 p-3 rounded">
                <p className="font-medium">{user.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}