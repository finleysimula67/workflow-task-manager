export const API_URL: string =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const API_ORIGIN: string = API_URL.replace(/\/api\/?$/, '');

export const buildApiUrl = (path: string): string =>
  path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
