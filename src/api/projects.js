import apiClient from './client';
import { MOCK_PROJECTS, MOCK_PROJECT_DATA } from '../mockData';

export async function fetchProjects() {
  try {
    const response = await apiClient.get('/projects');
    return response.data;
  } catch (error) {
    console.warn('[BhoomiIQ API] Fallback to mock projects list:', error.message);
    return MOCK_PROJECTS;
  }
}

export async function fetchProjectById(projectId) {
  try {
    const response = await apiClient.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.warn(`[BhoomiIQ API] Fallback to mock project details for ${projectId}:`, error.message);
    const found = MOCK_PROJECTS.find(p => p.id === projectId);
    return {
      ...MOCK_PROJECT_DATA,
      id: projectId,
      name: found ? found.name : MOCK_PROJECT_DATA.name,
      corridor: found ? found.corridor : MOCK_PROJECT_DATA.corridor,
      riskScore: found ? found.baseRiskScore : MOCK_PROJECT_DATA.riskScore,
    };
  }
}
