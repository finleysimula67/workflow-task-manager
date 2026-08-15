import axiosInstance from './axios';
import type { ApiResponse } from '../types';

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  taskId: number | null;
  actorId: number | null;
  actorName: string;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface UnreadCount {
  count: number;
}

export const notificationApi = {
  getNotifications: (page = 0, size = 20): Promise<ApiResponse<{ content: Notification[]; totalElements: number }>> =>
    axiosInstance.get(`/notifications?page=${page}&size=${size}`),

  getUnreadNotifications: (): Promise<ApiResponse<Notification[]>> =>
    axiosInstance.get('/notifications/unread'),

  getUnreadCount: (): Promise<ApiResponse<UnreadCount>> =>
    axiosInstance.get('/notifications/unread/count'),

  markAsRead: (id: number): Promise<ApiResponse<null>> =>
    axiosInstance.put(`/notifications/${id}/read`),

  markAllAsRead: (): Promise<ApiResponse<null>> =>
    axiosInstance.put('/notifications/read-all'),
};
