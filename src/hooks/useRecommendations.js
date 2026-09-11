import { useState, useEffect } from 'react';
import { fetchRecommendations } from '../api/recommendations';

export function useRecommendations(projectId) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    async function loadRecommendations() {
      try {
        setLoading(true);
        const data = await fetchRecommendations(projectId);
        setRecommendations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, [projectId]);

  return { recommendations, loading, error };
}
