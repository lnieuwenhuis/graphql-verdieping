'use client';

import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import Link from 'next/link';

const GET_POST = gql`
  query GetPost($slug: String!) {
    post(slug: $slug) {
      id
      title
      content
      slug
      category
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
  category: string;
  author: Author;
}

interface PostData {
  post: Post;
}

interface PostDetailProps {
  slug: string;
}

export function PostDetail({ slug }: PostDetailProps) {
  const { loading, error, data } = useQuery<PostData>(GET_POST, {
    variables: { slug },
  });

  if (loading) return <p className="text-gray-600 dark:text-gray-400">Loading post...</p>;
  if (error) return <p className="text-red-500">Error loading post: {error.message}</p>;
  if (!data?.post) return <p className="text-red-500">Post not found</p>;

  const { post } = data;

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-4xl mx-auto">
      <Link 
        href="/"
        className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block"
      >
        ← Back to posts
      </Link>
      
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        {post.title}
      </h1>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          By {post.author.name}
        </div>
        <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
          {post.category}
        </span>
      </div>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {post.content}
        </p>
      </div>
    </article>
  );
}