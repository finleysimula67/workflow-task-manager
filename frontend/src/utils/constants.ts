export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
};

export const TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

export const STATUS_OPTIONS = [
  { value: 'TODO', label: 'To Do', color: '#3498db' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: '#f39c12' },
  { value: 'DONE', label: 'Done', color: '#2ecc71' },
];

export const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low', color: '#95a5a6' },
  { value: 'MEDIUM', label: 'Medium', color: '#f39c12' },
  { value: 'HIGH', label: 'High', color: '#e74c3c' },
];

export const API_BASE_URL = 'http://localhost:8080/api';