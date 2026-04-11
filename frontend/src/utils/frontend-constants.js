// Uses VITE_API_BASE_URL build arg when deployed to Render
// Falls back to localhost for local development
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
