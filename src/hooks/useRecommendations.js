import { useState, useEffect } from 'react';
import { fetchRecommendations } from '../api/recommendations';

export function useRecommendations(projectId) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) {
      setRecommendations([]);
      setError(null);
      return;
    }

    let cancelled = false;

    async function loadRecommendations() {
      setLoading(true);
      setError(null);
      setRecommendations([]);

      try {
        const data = await fetchRecommendations(projectId);
        if (!cancelled) setRecommendations(data);
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Failed to load recommendations');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadRecommendations();
    return () => { cancelled = true; };
  }, [projectId]);

  return { recommendations, loading, error };
}
