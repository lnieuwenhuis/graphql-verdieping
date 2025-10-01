'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define User interface
interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

// Define AuthContext interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Use a try-catch block for localStorage operations since they can fail in some environments
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('currentUser');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        // Short delay to ensure state is properly set before rendering
        setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call
      // In a real app, this would be a fetch to your GraphQL API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock successful login for demo purposes
      if (email && password) {
        const mockUser = {
          id: '1',
          name: 'Demo User',
          email: email,
          token: 'mock-jwt-token'
        };
        
        localStorage.setItem('authToken', mockUser.token);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock successful registration
      if (name && email && password) {
        const mockUser = {
          id: '2',
          name: name,
          email: email,
          token: 'mock-jwt-token'
        };
        
        localStorage.setItem('authToken', mockUser.token);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}