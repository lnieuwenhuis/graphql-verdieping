'use client';

import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import Link from 'next/link';

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      content
      slug
      author {
        id
        name
      }
    }
  }
`;

interface Author {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  author: Author;
}

interface PostsData {
  posts: Post[];
}

export function PostList() {
  const { loading, error, data } = useQuery<PostsData>(GET_POSTS);

  if (loading) return <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>;
  if (error) return <p className="text-red-500">Error loading posts: {error.message}</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {data?.posts.map((post) => (
        <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform hover:scale-[1.02]">
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            <Link href={`/post/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
              {post.title}
            </Link>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {post.content}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              By {post.author.name}
            </span>
            <Link 
              href={`/post/${post.slug}`}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Read more →
            </Link>
          </div>
        </div>
      ))}
      
      {data?.posts.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400 col-span-2 text-center py-8">
          No posts found. Create your first post!
        </p>
      )}
    </div>
  );
}