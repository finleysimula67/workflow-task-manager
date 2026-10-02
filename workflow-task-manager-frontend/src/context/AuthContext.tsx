import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi } from '../api/authApi';
import axios from '../api/axios';
import { isTokenExpired } from '../utils/jwtUtils';

interface AuthState {
  isAuthenticated: boolean;
  isInitializing: boolean;
  user: any | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: any) => Promise<any>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isInitializing: true,
    user: null
  });

  const refreshAuth = async () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('user');

    if (!token || !refreshToken) {
      setState({
        isAuthenticated: false,
        isInitializing: false,
        user: null
      });
      return;
    }

    // If token is still valid, restore state
    if (!isTokenExpired(token)) {
      try {
        const user = storedUser ? JSON.parse(storedUser) : null;
        setState({
          isAuthenticated: !!user,
          isInitializing: false,
          user
        });
        return;
      } catch (e) {
        // Fall through to refresh
      }
    }

    // Token is expired, try to refresh
    try {
      await authApi.refreshToken();
      const user = storedUser ? JSON.parse(storedUser) : authApi.getCurrentUser();
      setState({
        isAuthenticated: !!user,
        isInitializing: false,
        user
      });
    } catch (error) {
      console.error('Failed to refresh token on startup:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setState({
        isAuthenticated: false,
        isInitializing: false,
        user: null
      });
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const login = async (credentials: any) => {
    const result = await authApi.login(credentials);
    if (result.success) {
      const user = authApi.getCurrentUser();
      setState({
        isAuthenticated: true,
        isInitializing: false,
        user
      });
    }
    return result;
  };

  const logout = async () => {
    await authApi.logout();
    setState({
      isAuthenticated: false,
      isInitializing: false,
      user: null
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
