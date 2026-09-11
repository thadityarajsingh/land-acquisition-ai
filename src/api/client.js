import axios from 'axios';

// Base API Client pointing to the local FastAPI backend.
// Use 127.0.0.1 explicitly on Windows to avoid localhost resolution issues.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default apiClient;
