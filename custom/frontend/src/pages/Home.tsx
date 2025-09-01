import { GraphQLDemo } from '../components/GraphQLDemo';
import { CreatePostForm } from '../components/CreatePostForm';

export function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          GraphQL Blog Platform
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Create and manage blog posts with GraphQL and Go backend
        </p>
      </div>
      
      <CreatePostForm />
      
      <GraphQLDemo />
    </div>
  );
}