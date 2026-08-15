import axiosInstance from './axios';
import type { ApiResponse } from '../types';

export interface TaskTemplate {
  id: number;
  name: string;
  titlePrefix: string;
  description: string;
  priority: string;
  categoryIds: string;
  createdAt: string;
}

export interface TaskTemplateRequestDTO {
  name: string;
  titlePrefix?: string;
  description?: string;
  priority?: string;
  categoryIds?: string;
}

export const taskTemplateApi = {
  getTemplates: (): Promise<ApiResponse<TaskTemplate[]>> =>
    axiosInstance.get<TaskTemplate[]>('/task-templates'),

  createTemplate: (dto: TaskTemplateRequestDTO): Promise<ApiResponse<TaskTemplate>> =>
    axiosInstance.post<TaskTemplate>('/task-templates', dto),

  updateTemplate: (id: number, dto: TaskTemplateRequestDTO): Promise<ApiResponse<TaskTemplate>> =>
    axiosInstance.put<TaskTemplate>(`/task-templates/${id}`, dto),

  deleteTemplate: (id: number): Promise<ApiResponse<null>> =>
    axiosInstance.delete(`/task-templates/${id}`),
};
