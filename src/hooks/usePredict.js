import { useState, useEffect } from 'react';
import { predictRisk, explainRisk } from '../api/predict';

const FEATURE_LABELS = {
  land_area_acres: 'Land Area',
  affected_families: 'Affected Families',
  approval_delay_days: 'Approval Delay',
  legal_disputes: 'Legal Disputes',
  rehab_progress_pct: 'Rehabilitation Progress',
  stakeholder_responsiveness_pct: 'Stakeholder Responsiveness',
  historical_performance_score: 'Historical Performance',
  departments_involved: 'Departments Involved',
  historical_delay_count: 'Historical Delay Count',
};

const FEATURE_EXPLANATIONS = {
  land_area_acres: 'Size of the land area involved in the project.',
  affected_families: 'Number of families affected by the land acquisition.',
  approval_delay_days: 'Number of days approvals have already been delayed.',
  legal_disputes: 'Number of legal disputes connected with the project.',
  rehab_progress_pct: 'Progress made in rehabilitation and resettlement work.',
  stakeholder_responsiveness_pct: 'How responsive departments, landowners, and other project participants are.',
  historical_performance_score: 'How well similar past projects performed on schedule.',
  departments_involved: 'Number of departments involved in the acquisition process.',
  historical_delay_count: 'Number of delays recorded in similar past projects.',
};

function formatFeatureName(feature) {
  if (FEATURE_LABELS[feature]) return FEATURE_LABELS[feature];
  const known = Object.keys(FEATURE_LABELS).find(key => feature.startsWith(`${key}_`));
  if (known) return `${FEATURE_LABELS[known]}: ${feature.slice(known.length + 1)}`;
  return feature.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

function toDrivers(topFactors = {}) {
  return Object.entries(topFactors).map(([feature, shapValue]) => {
    const impact = Number(Number(shapValue).toFixed(3));
    return {
      name: formatFeatureName(feature),
      impact,
      displayImpact: `${impact >= 0 ? '+' : ''}${impact}`,
      direction: impact >= 0 ? 'up' : 'down',
      category: feature.includes('legal') || feature.includes('dispute') ? 'Legal / Judicial' : 'Model Feature',
      description: FEATURE_EXPLANATIONS[feature] || 'A project factor considered by the AI when estimating delay risk.',
    };
  });
}

export function usePredict(projectData) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectData) return;

    async function runPrediction() {
      const payload = {
        land_area_acres: projectData.land_area_acres,
        affected_families: projectData.affected_families,
        approval_delay_days: projectData.approval_delay_days,
        legal_disputes: projectData.legal_disputes,
        rehab_progress_pct: projectData.rehab_progress_pct,
        stakeholder_responsiveness_pct: projectData.stakeholder_responsiveness_pct,
        historical_performance_score: projectData.historical_performance_score,
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
      };

      try {
        setLoading(true);
        setError(null);
        const result = await predictRisk(payload);
        let drivers = [];

        try {
          const explanation = await explainRisk(payload);
          drivers = toDrivers(explanation.top_factors);
        } catch (explainError) {
          console.warn('[BhoomiIQ API] SHAP explanation unavailable:', explainError.message);
        }

        setPrediction({
          ...result,
          riskScore: Math.round(Number(result.risk_score) * 100),
          riskCategory: result.risk_category,
          drivers,
        });
      } catch (err) {
        console.error('[BhoomiIQ API] Prediction failed:', err);
        setPrediction(null);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    runPrediction();
  }, [projectData?.project_id]);

  return { prediction, loading, error };
}
