import apiClient from './client';

function normalizeRecommendations(items = []) {
  return items.map((item, index) => {
    if (typeof item !== 'string') return item;

    return {
      id: `REC-${String(index + 1).padStart(2, '0')}`,
      title: item,
      authority: 'Project coordination team',
      impactEstimate: 'Risk-focused action',
      timeframe: 'Near term',
      statutoryRef: 'Rule-based risk factor',
      urgency: index === 0 ? 'CRITICAL' : 'HIGH',
      description: item,
      action: item,
      basis: 'Recorded project risk factor',
    };
  });
}

export async function fetchRecommendations(projectId) {
  const response = await apiClient.get(`/recommendations/${projectId}`);
  return normalizeRecommendations(response.data?.recommendations || []);
}
