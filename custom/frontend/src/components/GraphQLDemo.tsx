import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      description
      slug
      published
      createdAt
      author {
        id
        name
        email
      }
      categories {
        id
        name
        slug
      }
    }
  }
`;

const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      id
      name
      email
      bio
    }
  }
`;

interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  description?: string;
  slug: string;
  published: boolean;
  createdAt: string;
  author: Author;
  categories: Category[];
}

interface PostsData {
  posts: Post[];
}

interface AuthorsData {
  authors: Author[];
}

export function GraphQLDemo() {
  const { loading: postsLoading, error: postsError, data: postsData } = useQuery<PostsData>(GET_POSTS);
  const { loading: authorsLoading, error: authorsError, data: authorsData } = useQuery<AuthorsData>(GET_AUTHORS);

  return (
    <div className="space-y-8">
      {/* Blog Posts Section */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Blog Posts</h2>
        {postsLoading && <p className="text-blue-600">Loading posts...</p>}
        {postsError && <p className="text-red-600">Error: {postsError.message}</p>}
        {postsData && (
          <div className="space-y-4">
            {postsData.posts.map((post: Post) => (
              <div key={post.id} className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${
                    post.published 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                {post.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-3">{post.description}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div>
                    <span className="font-medium">By: {post.author.name}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {post.categories.map((category: Category) => (
                      <span key={category.id} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs">
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Authors Section */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Authors</h2>
        {authorsLoading && <p className="text-blue-600">Loading authors...</p>}
        {authorsError && <p className="text-red-600">Error: {authorsError.message}</p>}
        {authorsData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {authorsData.authors.map((author: Author) => (
              <div key={author.id} className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">{author.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{author.email}</p>
                {author.bio && (
                  <p className="text-gray-700 dark:text-gray-200 mt-2">{author.bio}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}