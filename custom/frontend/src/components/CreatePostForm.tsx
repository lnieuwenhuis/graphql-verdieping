import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

const CREATE_POST = gql`
  mutation CreatePost($input: NewPost!) {
    createPost(input: $input) {
      id
      title
      description
      slug
      content
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

const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      id
      name
      email
    }
  }
`;

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
    }
  }
`;



interface Author {
  id: string;
  name: string;
  email: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface AuthorsData {
  authors: Author[];
}

interface CategoriesData {
  categories: Category[];
}

interface CreatePostInput {
  title: string;
  slug: string;
  description?: string;
  content: string;
  published?: boolean;
  authorId: string;
  categoryIds?: string[];
}

export function CreatePostForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    published: false,
    authorId: '',
    categoryIds: [] as string[]
  });

  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    refetchQueries: ['GetPosts'], // Refetch posts after creating
  });
  const { data: authorsData, loading: authorsLoading } = useQuery<AuthorsData>(GET_AUTHORS);
  const { data: categoriesData, loading: categoriesLoading } = useQuery<CategoriesData>(GET_CATEGORIES);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Generate slug from title
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const input: CreatePostInput = {
        title: formData.title,
        slug: slug,
        content: formData.content,
        published: formData.published,
        authorId: formData.authorId,
      };
      
      if (formData.categoryIds.length > 0) {
        input.categoryIds = formData.categoryIds;
      }
      
      if (formData.description.trim()) {
        input.description = formData.description;
      }

      await createPost({
        variables: { input }
      });

      // Reset form on success
      setFormData({
        title: '',
        description: '',
        content: '',
        published: false,
        authorId: '',
        categoryIds: []
      });

      alert('Post created successfully!');
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      categoryIds: selectedOptions
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Blog Post</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Enter post title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Brief description of your post..."
          />
        </div>

        <div>
          <label htmlFor="authorId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Author *
          </label>
          <select
             id="authorId"
             name="authorId"
             value={formData.authorId}
             onChange={handleSelectChange}
             required
             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
           >
            <option value="">Select an author...</option>
            {authorsLoading ? (
              <option disabled>Loading authors...</option>
            ) : (
              authorsData?.authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name} ({author.email})
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label htmlFor="categoryIds" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Categories
          </label>
          <select
            id="categoryIds"
            name="categoryIds"
            multiple
            value={formData.categoryIds}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[100px]"
          >
            {categoriesLoading ? (
              <option disabled>Loading categories...</option>
            ) : (
              categoriesData?.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Hold Ctrl/Cmd to select multiple categories
          </p>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Write your blog post content here..."
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleCheckboxChange}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Publish immediately</span>
          </label>
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            Error: {error.message}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !formData.title.trim() || !formData.content.trim() || !formData.authorId.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}