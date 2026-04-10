import axios from 'axios';
import type { LoginCredentials, RegisterData, User, AuthTokens, ApiResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthTokens>> => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (response.data.success && response.data.data) {
      const { token: accessToken, refreshToken, user, lastLoginAt } = response.data.data;
      if (!accessToken || !refreshToken || !user) {
        throw new Error('Invalid response from server');
      }
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (lastLoginAt) {
        localStorage.setItem('lastLogin', lastLoginAt);
      }
      
      if (credentials.rememberMe) {
        localStorage.setItem('rememberedEmail', credentials.email);
      }
      
      return {
        success: true,
        data: response.data.data,
        message: 'Login successful'
      };
    }
    return {
      success: false,
      data: null as unknown as AuthTokens,
      message: response.data.message || 'Login failed'
    };
  },

  register: async (userData: RegisterData): Promise<ApiResponse<AuthTokens>> => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Registration successful'
    };
  },

  refreshToken: async (): Promise<ApiResponse<AuthTokens>> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
    if (response.data.success && response.data.data) {
      const { token: accessToken, refreshToken: newRefreshToken } = response.data.data;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      return {
        success: true,
        data: response.data.data
      };
    }
    throw new Error('Token refresh failed');
  },

  logout: async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await axios.post(`${API_URL}/auth/logout`, { refreshToken });
      }
    } catch {
      // Continue with local cleanup even if server logout fails
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  isAdmin: (): boolean => {
    const user = authApi.getCurrentUser();
    if (!user || !user.roles) return false;
    return user.roles.some(role => {
      if (typeof role === 'string') {
        return role === 'ROLE_ADMIN';
      }
      return (role as { name?: string }).name === 'ROLE_ADMIN';
    });
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  uploadProfilePhoto: async (file: File): Promise<ApiResponse<{ profileImage: string }>> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/users/me/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Photo uploaded successfully'
    };
  },

  updateCurrentUser: (userData: Partial<User>): void => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      const updatedUser = { ...user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  },

  getRememberedEmail: (): string | null => {
    return localStorage.getItem('rememberedEmail');
  },

  getLastLogin: (): string | null => {
    return localStorage.getItem('lastLogin');
  },

  clearRememberedEmail: (): void => {
    localStorage.removeItem('rememberedEmail');
  }
};
