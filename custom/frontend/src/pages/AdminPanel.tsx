import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useNavigate, Link, useLocation } from 'react-router-dom';

// GraphQL Queries and Mutations
const GET_POSTS = gql`
  query GetPosts {
    posts {
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
      email
      bio
      createdAt
    }
  }
`;

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      createdAt
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

const DELETE_AUTHOR = gql`
  mutation DeleteAuthor($id: ID!) {
    deleteAuthor(id: $id)
  }
`;

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

const CREATE_AUTHOR = gql`
  mutation CreateAuthor($input: NewAuthor!) {
    createAuthor(input: $input) {
      id
      name
      email
      bio
      createdAt
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

type TabType = 'posts' | 'authors' | 'categories';

interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  author: {
    id: string;
    name: string;
  };
  categories: {
    id: string;
    name: string;
  }[];
  createdAt: string;
}

interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

interface PostsData {
  posts: Post[];
}

interface AuthorsData {
  authors: Author[];
}

interface CategoriesData {
  categories: Category[];
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [showCreateAuthor, setShowCreateAuthor] = useState(false);
  const [newAuthor, setNewAuthor] = useState({ name: '', email: '', password: '', bio: '' });
  const [localPosts, setLocalPosts] = useState<Post[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Queries
  const { data: postsData, loading: postsLoading } = useQuery<PostsData>(GET_POSTS);
  const { data: authorsData, loading: authorsLoading, refetch: refetchAuthors } = useQuery<AuthorsData>(GET_AUTHORS);
  const { data: categoriesData, loading: categoriesLoading, refetch: refetchCategories } = useQuery<CategoriesData>(GET_CATEGORIES);
  
  // Handle new post from CreatePostPage
  useEffect(() => {
    if (location.state?.newPost) {
      const newPost = location.state.newPost as Post;
      setLocalPosts(prev => [newPost, ...prev]);
      // Clear the state to prevent re-adding on subsequent renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  // Initialize local posts when query data first loads
  useEffect(() => {
    if (postsData?.posts && localPosts.length === 0) {
      setLocalPosts(postsData.posts);
    }
  }, [postsData, localPosts.length]);
  
  // Mutations
  const [deletePost] = useMutation(DELETE_POST);
  const [deleteAuthor] = useMutation(DELETE_AUTHOR);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);
  const [createAuthor] = useMutation(CREATE_AUTHOR);
  const [logout] = useMutation(LOGOUT_MUTATION);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost({ variables: { id } });
        // Remove from local state instead of refetching
        setLocalPosts(prev => prev.filter(post => post.id !== id));
      } catch (err) {
        console.error('Failed to delete post:', err);
      }
    }
  };

  const handleDeleteAuthor = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this author?')) {
      try {
        await deleteAuthor({ variables: { id } });
        refetchAuthors();
      } catch (err) {
        console.error('Failed to delete author:', err);
      }
    }
  };

  const handleCreateAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAuthor({
        variables: {
          input: {
            name: newAuthor.name,
            email: newAuthor.email,
            password: newAuthor.password,
            bio: newAuthor.bio || undefined
          }
        }
      });
      setNewAuthor({ name: '', email: '', password: '', bio: '' });
      setShowCreateAuthor(false);
      refetchAuthors();
    } catch (err) {
      console.error('Failed to create author:', err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory({ variables: { id } });
        refetchCategories();
      } catch (err) {
        console.error('Failed to delete category:', err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderPosts = () => {
    if (postsLoading) return <div className="text-center py-8">Loading posts...</div>;
    
    const posts: Post[] = localPosts;
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Posts Management</h2>
          <Link
            to="/create-post"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Create New Post
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                    <div className="text-sm text-gray-500">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.author.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.categories.map((category) => category.name).join(', ')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(post.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-900 ml-4"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAuthors = () => {
    if (authorsLoading) return <div className="text-center py-8">Loading authors...</div>;
    
    const authors: Author[] = authorsData?.authors || [];
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Authors Management</h2>
          <button
            onClick={() => setShowCreateAuthor(!showCreateAuthor)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            {showCreateAuthor ? 'Cancel' : 'Create Author'}
          </button>
        </div>
        
        {showCreateAuthor && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Author</h3>
            <form onSubmit={handleCreateAuthor} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newAuthor.name}
                    onChange={(e) => setNewAuthor({...newAuthor, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newAuthor.email}
                    onChange={(e) => setNewAuthor({...newAuthor, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newAuthor.password}
                  onChange={(e) => setNewAuthor({...newAuthor, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Optional)</label>
                <textarea
                  value={newAuthor.bio}
                  onChange={(e) => setNewAuthor({...newAuthor, bio: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateAuthor(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Create Author
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {authors.map((author) => (
                <tr key={author.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{author.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{author.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {author.bio ? author.bio.substring(0, 50) + '...' : 'No bio'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(author.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteAuthor(author.id)}
                      className="text-red-600 hover:text-red-900 ml-4"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCategories = () => {
    if (categoriesLoading) return <div className="text-center py-8">Loading categories...</div>;
    
    const categories: Category[] = categoriesData?.categories || [];
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Categories Management</h2>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(category.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-900 ml-4"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                View Site
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'posts', label: 'Posts' },
              { key: 'authors', label: 'Authors' },
              { key: 'categories', label: 'Categories' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabType)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === 'posts' && renderPosts()}
          {activeTab === 'authors' && renderAuthors()}
          {activeTab === 'categories' && renderCategories()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;