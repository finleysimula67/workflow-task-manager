import axios from 'axios';
import { API_URL } from './config';
import { authApi } from './authApi';
import type { ApiResponse } from '../types';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => ({
    success: true as const,
    data: response.data.data || response.data,
    message: response.data.message || 'Success',
    status: response.status
  }) as any,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        isRefreshing = false;
        authApi.logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.success && response.data.data) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('token', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          isRefreshing = false;
          return axiosInstance(originalRequest);
        }
        throw new Error('Refresh failed');
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        authApi.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject({
      success: false as const,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

// Typed wrapper — tells TypeScript that all responses are { success, data, message, status }
// matching what the interceptor above always returns at runtime.
const typedAxios = {
  get: <T = any>(url: string, config?: object): Promise<ApiResponse<T>> =>
    axiosInstance.get(url, config) as unknown as Promise<ApiResponse<T>>,

  post: <T = any>(url: string, data?: unknown, config?: object): Promise<ApiResponse<T>> =>
    axiosInstance.post(url, data, config) as unknown as Promise<ApiResponse<T>>,

  put: <T = any>(url: string, data?: unknown, config?: object): Promise<ApiResponse<T>> =>
    axiosInstance.put(url, data, config) as unknown as Promise<ApiResponse<T>>,

  patch: <T = any>(url: string, data?: unknown, config?: object): Promise<ApiResponse<T>> =>
    axiosInstance.patch(url, data, config) as unknown as Promise<ApiResponse<T>>,

  delete: <T = any>(url: string, config?: object): Promise<ApiResponse<T>> =>
    axiosInstance.delete(url, config) as unknown as Promise<ApiResponse<T>>,

  defaults: axiosInstance.defaults,
  interceptors: axiosInstance.interceptors,
};

export default typedAxios;
export type { ApiResponse };
