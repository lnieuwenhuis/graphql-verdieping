import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import client from './lib/apollo-client';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { About } from './pages/About';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navigation />
          <main className="max-w-4xl mx-auto p-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ApolloProvider>
  )
}

export default App
