import { GraphQLDemo } from '../components/GraphQLDemo';

export function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to React + GraphQL
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          This is the home page demonstrating GraphQL integration with a Go backend
        </p>
      </div>
      
      <GraphQLDemo />
    </div>
  );
}