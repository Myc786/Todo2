'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, LoginCredentials, RegisterCredentials } from './api';

interface AuthContextType {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if token exists in localStorage on initial load
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }

    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);

      const result = await authApi.login(credentials);

      if (result.success && result.data) {
        const { access_token } = result.data;

        // Store token in localStorage
        localStorage.setItem('auth_token', access_token);

        // For now, we'll just store basic user info based on email
        // In a real app, you'd likely make another call to get user details
        const userInfo = { email: credentials.email };
        localStorage.setItem('user', JSON.stringify(userInfo));

        setToken(access_token);
        setUser(userInfo);

        return { success: true };
      } else {
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterCredentials) => {
    try {
      setLoading(true);

      const result = await authApi.register(userData);

      if (result.success && result.data) {
        // Auto-login after successful registration
        const loginResult = await authApi.login({
          email: userData.email,
          password: userData.password
        });

        if (loginResult.success && loginResult.data) {
          const { access_token } = loginResult.data;

          // Store token in localStorage
          localStorage.setItem('auth_token', access_token);

          // Store user info
          const userInfo = { email: userData.email, id: result.data.id };
          localStorage.setItem('user', JSON.stringify(userInfo));

          setToken(access_token);
          setUser(userInfo);

          return { success: true };
        } else {
          return { success: false, error: 'Registration successful but login failed' };
        }
      } else {
        return { success: false, error: result.error || 'Registration failed' };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove token and user from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};