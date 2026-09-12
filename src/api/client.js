import axios from 'axios';

// Use the configured API URL in deployment. When VITE_API_URL is not set,
// use the live FastAPI backend for the deployed site and the local backend
// during local development.
const apiBaseUrl = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8000'
    : 'https://bhoomi-ai-backend-4zod.onrender.com');

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default apiClient;
