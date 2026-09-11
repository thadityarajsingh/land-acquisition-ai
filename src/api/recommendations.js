import apiClient from './client';
import { MOCK_PROJECT_DATA } from '../mockData';

export async function fetchRecommendations(projectId) {
  try {
    const response = await apiClient.get(`/recommendations/${projectId}`);
    return response.data;
  } catch (error) {
    console.warn(`[BhoomiIQ API] Fallback to mock recommendations for ${projectId}:`, error.message);
    return MOCK_PROJECT_DATA.recommendations;
  }
}
