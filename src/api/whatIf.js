import apiClient from './client';

export async function simulateWhatIf(payload) {
  const response = await apiClient.post('/what-if', payload);
  return response.data;
}
