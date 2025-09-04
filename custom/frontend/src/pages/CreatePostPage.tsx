import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const CREATE_POST = gql`
  mutation CreatePost($input: NewPost!) {
    createPost(input: $input) {
      id
      title
      content
      slug
      published
      author {
        id
        name
      }
      categories {
        id
        name
      }
      createdAt
    }
  }
`;

const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      id
      name
    }
  }
`;

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

interface Author {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface AuthorsData {
  authors: Author[];
}

interface CategoriesData {
  categories: Category[];
}

interface PostFormData {
  title: string;
  content: string;
  slug: string;
  published: boolean;
  authorId: string;
  categoryIds: string[];
}

interface CreatePostData {
  createPost: {
    id: string;
    title: string;
    content: string;
    slug: string;
    published: boolean;
    author: Author;
    categories: Category[];
    createdAt: string;
  };
}

const CreatePostPage: React.FC = () => {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    slug: '',
    published: false,
    authorId: '',
    categoryIds: []
  });
  const [error, setError] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const navigate = useNavigate();
  
  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (!token || !user) {
      navigate('/login');
      return;
    }
    
    setIsAuthenticated(true);
    const userData = JSON.parse(user);
    setFormData(prev => ({ ...prev, authorId: userData.id }));
  }, [navigate]);
  
  const [createPost, { loading }] = useMutation<CreatePostData>(CREATE_POST, {
    onCompleted: (data) => {
      // Navigate to admin panel with the new post data
      navigate('/admin', { state: { newPost: data.createPost } });
    },
    onError: (err) => {
      setError(err.message);
    }
  });
  
  const { data: authorsData, loading: authorsLoading } = useQuery<AuthorsData>(GET_AUTHORS);
  const { data: categoriesData, loading: categoriesLoading } = useQuery<CategoriesData>(GET_CATEGORIES);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || formData.categoryIds.length === 0) {
      setError('Please fill in all required fields and select at least one category.');
      return;
    }
    
    try {
      await createPost({
        variables: {
          input: {
            title: formData.title,
            content: formData.content,
            slug: formData.slug,
            published: formData.published,
            authorId: formData.authorId,
            categoryIds: formData.categoryIds
          }
        }
      });
    } catch {
      // Error handled by onError callback
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to create a post.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (authorsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const authors = authorsData?.authors || [];
  const categories = categoriesData?.categories || [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
              <p className="text-gray-600 mt-2">Share your thoughts with the world</p>
            </div>
            <button
              onClick={() => navigate('/admin')}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back to Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter post title"
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="post-slug (auto-generated from title)"
              />
              <p className="text-sm text-gray-500 mt-1">URL-friendly version of the title</p>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                placeholder="Write your post content here..."
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Categories * (Select one or more)
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={formData.categoryIds.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            categoryIds: [...prev.categoryIds, category.id]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            categoryIds: prev.categoryIds.filter(id => id !== category.id)
                          }));
                        }
                        if (error) setError('');
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
              {formData.categoryIds.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Selected: {formData.categoryIds.length} categor{formData.categoryIds.length === 1 ? 'y' : 'ies'}
                </p>
              )}
            </div>

            {/* Author (Read-only for current user) */}
            <div>
              <label htmlFor="authorId" className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <select
                id="authorId"
                name="authorId"
                value={formData.authorId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled
              >
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">Posts are created under your account</p>
            </div>

            {/* Published */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                Publish immediately
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  formData.published ? 'Publish Post' : 'Save Draft'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;