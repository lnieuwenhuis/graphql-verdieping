import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
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
    }
  }
`;



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
    published: false
  });

  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    refetchQueries: ['GetPosts'], // Refetch posts after creating
  });

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
        authorId: "1", // Default to first author for now
      };
      
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
        published: false
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
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Brief description of the post"
          />
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
            disabled={loading || !formData.title.trim() || !formData.content.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}