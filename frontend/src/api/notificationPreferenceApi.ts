import axiosInstance from './axios';
import type { ApiResponse } from '../types';

export interface NotificationPreference {
  id: number;
  type: string;
  enabled: boolean;
}

export const notificationPreferenceApi = {
  getPreferences: (): Promise<ApiResponse<NotificationPreference[]>> =>
    axiosInstance.get('/users/me/notification-preferences'),

  updatePreferences: (preferences: { type: string; enabled: boolean }[]): Promise<ApiResponse<NotificationPreference[]>> =>
    axiosInstance.put('/users/me/notification-preferences', preferences),
};
