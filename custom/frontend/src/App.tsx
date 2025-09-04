import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import client from './lib/apollo-client';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { About } from './pages/About';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPanel from './pages/AdminPanel';
import CreatePostPage from './pages/CreatePostPage';
import { PostDetail } from './pages/PostDetail';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/create-post" element={<CreatePostPage />} />
              <Route path="/post/:slug" element={<PostDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ApolloProvider>
  )
}

export default App
