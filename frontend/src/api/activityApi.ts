import axiosInstance from './axios';
import type { ApiResponse } from '../types';

export interface Activity {
  id: number;
  userId: number;
  username: string;
  userEmail: string;
  userProfileImage: string | null;
  taskId: number | null;
  taskTitle: string | null;
  entityType: string;
  entityId: number;
  action: string;
  summary: string;
  details: string | null;
  createdAt: string;
}

export const activityApi = {
  getRecent: (limit = 10): Promise<ApiResponse<Activity[]>> =>
    axiosInstance.get(`/activities/recent?limit=${limit}`),

  getTaskActivities: (taskId: number, page = 0, size = 20): Promise<ApiResponse<{ content: Activity[]; totalElements: number }>> =>
    axiosInstance.get(`/activities/task/${taskId}?page=${page}&size=${size}`),

  getAll: (page = 0, size = 20): Promise<ApiResponse<{ content: Activity[]; totalPages: number; totalElements: number; currentPage: number; first: boolean; last: boolean }>> =>
    axiosInstance.get(`/activities?page=${page}&size=${size}`),
};
