import axiosInstance from './axios';
import type { Comment, ApiResponse } from '../types';

export const commentApi = {
  addComment: (taskId: number, content: string): Promise<ApiResponse<Comment>> =>
    axiosInstance.post<Comment>(`/comments/task/${taskId}`, { content }),

  getTaskComments: (taskId: number): Promise<ApiResponse<Comment[]>> =>
    axiosInstance.get<Comment[]>(`/comments/task/${taskId}`),

  updateComment: (commentId: number, content: string): Promise<ApiResponse<Comment>> =>
    axiosInstance.put<Comment>(`/comments/${commentId}`, { content }),

  deleteComment: (commentId: number): Promise<ApiResponse<null>> =>
    axiosInstance.delete(`/comments/${commentId}`)
};
