import apiClient from './client';
import { MOCK_PROJECT_DATA } from '../mockData';

export async function predictRisk(payload) {
  try {
    const response = await apiClient.post('/predict', payload);
    return response.data;
  } catch (error) {
    console.warn('[BhoomiIQ API] Fallback to mock prediction:', error.message);
    return {
      riskScore: MOCK_PROJECT_DATA.riskScore,
      riskCategory: MOCK_PROJECT_DATA.riskCategory,
      estimatedDelay: MOCK_PROJECT_DATA.estimatedDelay,
      confidenceScore: MOCK_PROJECT_DATA.confidenceScore,
      drivers: MOCK_PROJECT_DATA.drivers,
    };
  }
}
