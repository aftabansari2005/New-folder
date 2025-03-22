import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'voter' | 'admin';
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthState({ isAuthenticated: false, user: null, loading: false });
        return;
      }

      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAuthState({
        isAuthenticated: true,
        user: response.data,
        loading: false,
      });
    } catch (error) {
      localStorage.removeItem('token');
      setAuthState({ isAuthenticated: false, user: null, loading: false });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setAuthState({ isAuthenticated: true, user, loading: false });
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({ isAuthenticated: false, user: null, loading: false });
  };

  return {
    ...authState,
    login,
    logout,
  };
}; 