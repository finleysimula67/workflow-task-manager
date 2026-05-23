import axios from './axios';
import type { User } from '../types';

export interface UserWithStats extends User {
  taskStats?: {
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    completedTasks: number;
  };
}

export interface AdminUserUpdateData {
  username?: string;
  email?: string;
  enabled?: boolean;
  roles?: string[];
}

export const adminApi = {
  getUsers: async () => {
    const response = await axios.get('/admin/users');
    return response;
  },

  getUserStats: async (userId: number) => {
    const response = await axios.get(`/admin/users/${userId}/stats`);
    return response;
  },

  getUser: async (userId: number) => {
    const response = await axios.get(`/admin/users/${userId}`);
    return response;
  },

  updateUser: async (userId: number, data: AdminUserUpdateData) => {
    const response = await axios.put(`/admin/users/${userId}`, data);
    return response;
  },

  deleteUser: async (userId: number) => {
    const response = await axios.delete(`/admin/users/${userId}`);
    return response;
  },
};
