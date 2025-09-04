import React from 'react';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      content
      slug
      published
      createdAt
      author {
        id
        name
      }
      categories {
        id
        name
      }
    }
  }
`;

interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
  categories: {
    id: string;
    name: string;
  }[];
}

interface PostsData {
  posts: Post[];
}

export function Home() {
  const { data, loading, error } = useQuery<PostsData>(GET_POSTS);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Posts</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const posts = data?.posts?.filter(post => post.published) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const renderCategories = (categories: { id: string; name: string; }[], maxVisible: number = 2) => {
    const visibleCategories = categories.slice(0, maxVisible);
    const remainingCount = categories.length - maxVisible;
    
    return (
      <div className="flex gap-2 flex-wrap">
        {visibleCategories.map(category => (
          <span 
            key={category.id}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap"
          >
            {category.name}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap">
            +{remainingCount}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              GraphQL Blog
              <span className="block text-blue-600">Platform</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover amazing stories, insights, and ideas from our community of writers
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/about"
                className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-100 rounded-full opacity-50"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-purple-100 rounded-full opacity-30"></div>
      </div>

      {/* Posts Section with Asymmetrical Cube Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Stories</h2>
          <p className="text-gray-600">Explore our collection of featured articles</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Posts Yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share your story with the community!</p>
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Start Writing
            </Link>
          </div>
        ) : (
          /* Asymmetrical Cube Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
            {posts.map((post, index) => {
              // Create asymmetrical layout patterns
              const isLarge = index % 7 === 0 || index % 7 === 3;
              const isMedium = index % 7 === 1 || index % 7 === 5;
              const isWide = index % 7 === 2 || index % 7 === 6;
              
              let cardClasses = "group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden";
              
              if (isLarge) {
                cardClasses += " md:col-span-2 md:row-span-2";
              } else if (isMedium) {
                cardClasses += " md:row-span-1";
              } else if (isWide) {
                cardClasses += " lg:col-span-2";
              }

              return (
                <Link key={post.id} to={`/post/${post.slug}`} className={cardClasses}>
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative p-6 h-full flex flex-col">
                    {/* Category badge */}
                    <div className="flex items-start justify-between mb-4 gap-2">
                      <div className="flex-1 min-w-0">
                        {renderCategories(post.categories, isLarge ? 3 : 2)}
                      </div>
                      <time className="text-sm text-gray-500 whitespace-nowrap flex-shrink-0">
                        {formatDate(post.createdAt)}
                      </time>
                    </div>

                    {/* Title */}
                    <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 ${
                      isLarge ? 'text-2xl' : isMedium ? 'text-xl' : 'text-lg'
                    }`}>
                      {post.title}
                    </h3>

                    {/* Content preview */}
                    <p className={`text-gray-600 mb-4 flex-grow line-clamp-3 ${
                      isLarge ? 'text-base line-clamp-4' : 'text-sm'
                    }`}>
                      {truncateContent(post.content, isLarge ? 300 : isMedium ? 180 : 120)}
                    </p>

                    {/* Author and read more */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {post.author.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-2 text-sm text-gray-700">
                          {post.author.name}
                        </span>
                      </div>
                      <span className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                        Read more
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full"></div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Call to action */}
        {posts.length > 0 && (
          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Share Your Story?</h3>
            <p className="text-gray-600 mb-6">Join our community of writers and start creating amazing content</p>
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              Start Writing Today
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}