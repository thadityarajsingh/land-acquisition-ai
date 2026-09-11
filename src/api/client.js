import axios from 'axios';

// Base API Client pointing to backend (FastAPI default port 8000 or env variable)
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default apiClient;
