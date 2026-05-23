import axiosInstance from './axios';
import type { Task, TaskRequestDTO, TaskFilterDTO, TaskStats, ApiResponse } from '../types';

export const taskApi = {
  createTask: (taskData: TaskRequestDTO): Promise<ApiResponse<Task>> => 
    axiosInstance.post<Task>('/tasks', taskData),

  getAllTasks: (): Promise<ApiResponse<Task[]>> => 
    axiosInstance.get<Task[]>('/tasks'),

  getTaskById: (taskId: number): Promise<ApiResponse<Task>> => 
    axiosInstance.get<Task>(`/tasks/${taskId}`),

  getTasksByStatus: (status: string): Promise<ApiResponse<Task[]>> => 
    axiosInstance.get<Task[]>(`/tasks/status/${status}`),

  getTaskStats: (): Promise<ApiResponse<TaskStats>> => 
    axiosInstance.get<TaskStats>('/tasks/stats'),

  searchTasks: (query: string): Promise<ApiResponse<Task[]>> => 
    axiosInstance.get<Task[]>(`/tasks/search?q=${encodeURIComponent(query)}`),

  getTasksByCategories: (categoryIds: number[]): Promise<ApiResponse<Task[]>> => 
    axiosInstance.get<Task[]>(`/tasks?category=${categoryIds.join(',')}`),

  updateTask: (taskId: number, taskData: TaskRequestDTO): Promise<ApiResponse<Task>> => 
    axiosInstance.put<Task>(`/tasks/${taskId}`, taskData),

  updateTaskStatus: (taskId: number, status: string): Promise<ApiResponse<Task>> => 
    axiosInstance.patch<Task>(`/tasks/${taskId}/status?status=${status}`),

  deleteTask: (taskId: number): Promise<ApiResponse<null>> => 
    axiosInstance.delete(`/tasks/${taskId}`),

  filterTasks: (filterData: TaskFilterDTO): Promise<ApiResponse<{ content: Task[]; totalElements: number; totalPages: number }>> => 
    axiosInstance.post('/tasks/filter', filterData),

  getOverdueTasks: (): Promise<ApiResponse<Task[]>> => 
    axiosInstance.get<Task[]>('/tasks/overdue'),

  getTasksDueSoon: (days = 7): Promise<ApiResponse<Task[]>> => 
    axiosInstance.get<Task[]>(`/tasks/due-soon?days=${days}`),

  getProductivity: (): Promise<ApiResponse<{
    currentStreak: number; longestStreak: number; tasksCompletedToday: number;
    weeklyGoal: number; weeklyProgress: number;
    weeklyChart: { label: string; value: number }[];
    monthlyChart: { label: string; value: number }[];
  }>> => axiosInstance.get('/tasks/productivity'),

  reorderTasks: (order: { id: number; position: number }[]): Promise<ApiResponse<null>> =>
    axiosInstance.put('/tasks/reorder', { order }),
};
