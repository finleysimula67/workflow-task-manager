import axiosInstance from './axios';
import type { FileAttachment, ApiResponse } from '../types';

export const attachmentApi = {
  uploadFile: async (taskId: number, file: File): Promise<ApiResponse<FileAttachment>> => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post<FileAttachment>(`/attachments/task/${taskId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
      maxContentLength: 52428800,
      maxBodyLength: 52428800,
    });
  },

  getTaskAttachments: (taskId: number): Promise<ApiResponse<FileAttachment[]>> =>
    axiosInstance.get<FileAttachment[]>(`/attachments/task/${taskId}`),

  downloadAttachment: (attachmentId: number): Promise<ApiResponse<Blob>> =>
    axiosInstance.get<Blob>(`/attachments/${attachmentId}/download`, {
      responseType: 'blob',
      timeout: 300000,
    }),

  deleteAttachment: (attachmentId: number): Promise<ApiResponse<null>> =>
    axiosInstance.delete(`/attachments/${attachmentId}`)
};
