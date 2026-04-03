export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  status: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
  status: number;
  data?: unknown;
}

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  roles: Role[];
  createdAt?: string;
  enabled?: boolean;
  provider?: string;
  totalTasks?: number;
  completedTasks?: number;
  totalCategories?: number;
  profileImage?: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: number;
  categories: Category[];
  attachments: FileAttachment[];
  comments: Comment[];
  overdue?: boolean;
}

export interface TaskRequestDTO {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  categoryIds?: number[];
}

export interface TaskFilterDTO {
  status?: TaskStatus;
  priority?: TaskPriority;
  categoryId?: number;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface TaskStats {
  totalTasks?: number;
  todoTasks?: number;
  inProgressTasks?: number;
  completedTasks?: number;
  overdueTasks?: number;
  total?: number;
  todo?: number;
  inProgress?: number;
  completed?: number;
  dueSoon?: number;
  dueSoonTasks?: number;
  activeTasks?: number;
  archivedTasks?: number;
  urgentPriorityTasks?: number;
  highPriorityTasks?: number;
  mediumPriorityTasks?: number;
  lowPriorityTasks?: number;
  completionRate?: number;
  statusDistribution?: {
    TODO?: number;
    IN_PROGRESS?: number;
    COMPLETED?: number;
    ARCHIVED?: number;
  };
  priorityDistribution?: {
    URGENT?: number;
    HIGH?: number;
    MEDIUM?: number;
    LOW?: number;
  };
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  color: string;
  userId: number;
  taskCount?: number;
}

export interface CategoryRequestDTO {
  name: string;
  description?: string;
  color: string;
}

export interface Comment {
  id: number;
  content: string;
  taskId: number;
  userId: number;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileAttachment {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  downloadUrl: string;
  taskId: number;
  uploadedAt: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  taskStats: TaskStats;
  provider?: string;
  enabled?: boolean;
}

export interface CategoryFormData {
  name: string;
  description: string;
  color: string;
}
