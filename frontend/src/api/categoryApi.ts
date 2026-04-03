import axiosInstance from './axios';
import type { Category, CategoryRequestDTO, ApiResponse } from '../types';

export const categoryApi = {
  createCategory: (categoryData: CategoryRequestDTO): Promise<ApiResponse<Category>> =>
    axiosInstance.post<Category>('/categories', categoryData),

  getAllCategories: (): Promise<ApiResponse<Category[]>> =>
    axiosInstance.get<Category[]>('/categories'),

  getCategoryById: (categoryId: number): Promise<ApiResponse<Category>> =>
    axiosInstance.get<Category>(`/categories/${categoryId}`),

  updateCategory: (categoryId: number, categoryData: CategoryRequestDTO): Promise<ApiResponse<Category>> =>
    axiosInstance.put<Category>(`/categories/${categoryId}`, categoryData),

  deleteCategory: (categoryId: number): Promise<ApiResponse<null>> =>
    axiosInstance.delete(`/categories/${categoryId}`)
};
