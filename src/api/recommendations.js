import apiClient from './client';
import { MOCK_PROJECT_DATA } from '../mockData';

function normalizeRecommendations(items = []) {
  return items.map((item, index) => {
    if (typeof item !== 'string') return item;

    return {
      id: `REC-${String(index + 1).padStart(2, '0')}`,
      title: item,
      authority: 'Land Acquisition Administration',
      impactEstimate: 'Risk reduction action',
      timeframe: 'Immediate',
      statutoryRef: 'Project risk mitigation workflow',
      urgency: index === 0 ? 'CRITICAL' : 'HIGH',
      description: item,
    };
  });
}

export async function fetchRecommendations(projectId) {
  try {
    const response = await apiClient.get(`/recommendations/${projectId}`);
    return normalizeRecommendations(response.data?.recommendations || []);
  } catch (error) {
    console.warn(`[BhoomiIQ API] Fallback to mock recommendations for ${projectId}:`, error.message);
    return MOCK_PROJECT_DATA.recommendations;
  }
}
