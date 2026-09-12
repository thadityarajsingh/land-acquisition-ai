import apiClient from './client';

export async function predictRisk(payload) {
  const response = await apiClient.post('/predict', payload);
  return response.data;
}

export async function explainRisk(payload) {
  const response = await apiClient.post('/predict/explain', payload);
  return response.data;
}
