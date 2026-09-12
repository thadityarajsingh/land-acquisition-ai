import apiClient from './client';

function normalizeRecommendations(items = []) {
  return items.map((item, index) => {
    if (typeof item !== 'string') return item;

    return {
      id: `REC-${String(index + 1).padStart(2, '0')}`,
      title: item,
      authority: 'Land Acquisition Administration',
      impactEstimate: 'Model-derived action',
      timeframe: 'Immediate',
      statutoryRef: 'Project risk mitigation workflow',
      urgency: index === 0 ? 'CRITICAL' : 'HIGH',
      description: item,
    };
  });
}

export async function fetchRecommendations(projectId) {
  const response = await apiClient.get(`/recommendations/${projectId}`);
  return normalizeRecommendations(response.data?.recommendations || []);
}
