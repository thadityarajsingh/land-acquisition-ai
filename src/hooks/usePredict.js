import { useState, useEffect } from 'react';
import { predictRisk } from '../api/predict';

export function usePredict(projectData) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectData) return;
    
    async function runPrediction() {
      try {
        setLoading(true);
        const result = await predictRisk({
          projectId: projectData.id,
          parcelsCount: projectData.parcels?.length || 48,
          corridor: projectData.corridor,
        });
        setPrediction(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    runPrediction();
  }, [projectData?.id]);

  return { prediction, loading, error };
}
