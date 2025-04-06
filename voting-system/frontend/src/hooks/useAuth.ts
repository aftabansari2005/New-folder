import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../components/NotificationSystem';

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showNotification } = useNotification();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token validity with backend
          const response = await fetch('/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setAuthState({
              user: userData,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Token is invalid or expired
            localStorage.removeItem('token');
            setAuthState({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } else {
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(t('auth.invalidCredentials'));
      }

      const { token, user } = await response.json();
      localStorage.setItem('token', token);
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      showNotification(t('auth.loginSuccess'), 'success');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      showNotification(error instanceof Error ? error.message : t('common.error'), 'error');
      throw error;
    }
  }, [navigate, t, showNotification]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    showNotification(t('auth.logoutSuccess'), 'success');
    navigate('/login');
  }, [navigate, t, showNotification]);

  const refreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/auth/refresh', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { token: newToken } = await response.json();
        localStorage.setItem('token', newToken);
        setAuthState((prev) => ({
          ...prev,
          token: newToken,
        }));
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
    }
  }, [logout]);

  return {
    ...authState,
    login,
    logout,
    refreshToken,
  };
}; 