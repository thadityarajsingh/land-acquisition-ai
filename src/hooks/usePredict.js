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
        setError(null);

        const result = await predictRisk({
          land_area_acres: projectData.land_area_acres,
          affected_families: projectData.affected_families,
          approval_delay_days: projectData.approval_delay_days,
          legal_disputes: projectData.legal_disputes,
          rehab_progress_pct: projectData.rehab_progress_pct,
          stakeholder_responsiveness_pct:
            projectData.stakeholder_responsiveness_pct,
          historical_performance_score:
            projectData.historical_performance_score,
          departments_involved: projectData.departments_involved,
          historical_delay_count: projectData.historical_delay_count,

          state: projectData.state,
          district: projectData.district,
          project_type: projectData.project_type,
          compensation_status: projectData.compensation_status,
          possession_status: projectData.possession_status,
          documentation_status: projectData.documentation_status,
          notification_status: projectData.notification_status,
          acquisition_stage: projectData.acquisition_stage,
        });

        setPrediction({
          ...result,

          // Backend returns probability between 0 and 1.
          // Dashboard displays risk on a 0-100 scale.
          riskScore: Math.round(result.risk_score * 100),

          riskCategory: result.risk_category,

          // Backend currently does not return drivers.
          drivers: [],
        });
      } catch (err) {
        console.error('[BhoomiIQ API] Prediction failed:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    runPrediction();
  }, [projectData?.project_id]);

  return { prediction, loading, error };
}
