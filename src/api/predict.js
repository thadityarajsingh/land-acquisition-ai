import apiClient from './client';
import { MOCK_PROJECT_DATA } from '../mockData';

export async function predictRisk(payload) {
  try {
    const response = await apiClient.post('/predict', payload);
    return response.data;
  } catch (error) {
    console.warn('[BhoomiIQ API] Fallback to mock prediction:', error.message);
    return {
      risk_score: MOCK_PROJECT_DATA.riskScore / 100,
      risk_category: MOCK_PROJECT_DATA.riskCategory,
      predicted_delayed: true,
    };
  }
}

export async function explainRisk(payload) {
  const response = await apiClient.post('/predict/explain', payload);
  return response.data;
}
