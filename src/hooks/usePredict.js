import { useState, useEffect } from 'react';
import { predictRisk, explainRisk } from '../api/predict';

const MODEL_FIELDS = [
  'land_area_acres', 'affected_families', 'approval_delay_days', 'legal_disputes',
  'rehab_progress_pct', 'stakeholder_responsiveness_pct', 'historical_performance_score',
  'departments_involved', 'historical_delay_count',
  'green_zone_pct', 'forest_area_pct', 'tree_cover_pct', 'protected_area_distance_km',
  'waterbody_distance_m', 'elevation_m', 'slope_degree', 'distance_to_road_km',
  'distance_to_highway_km', 'distance_to_railway_km', 'distance_to_city_km',
  'agricultural_area_pct', 'residential_area_pct', 'commercial_area_pct', 'industrial_area_pct',
  'landowners_count', 'displaced_families', 'vulnerable_households', 'livelihood_dependency_pct',
  'record_completeness_pct', 'required_clearances_count', 'documentation_completeness_pct',
  'estimated_land_value_lakh', 'market_value_variance_pct', 'distance_to_school_km',
  'distance_to_hospital_km', 'distance_to_market_km',
  'state', 'district', 'project_type', 'compensation_status', 'possession_status',
  'documentation_status', 'notification_status', 'acquisition_stage', 'green_zone_status',
  'eco_sensitive_zone', 'wetland_present', 'environmental_clearance_required',
  'tree_cutting_required', 'land_use_type', 'land_conversion_required', 'ownership_type',
  'ownership_conflict', 'title_verification_status', 'encumbrance_status', 'inheritance_dispute',
  'mutation_status', 'boundary_dispute', 'court_case_status', 'public_hearing_status',
  'authority_approval_status', 'gazette_notification_status', 'flood_risk', 'waterlogging_risk',
  'erosion_risk', 'seismic_zone', 'soil_type', 'drainage_quality',
];

const FEATURE_LABELS = {
  land_area_acres: 'Land Area', affected_families: 'Affected Families',
  approval_delay_days: 'Approval Delay', legal_disputes: 'Legal Disputes',
  rehab_progress_pct: 'Rehabilitation Progress', stakeholder_responsiveness_pct: 'Stakeholder Responsiveness',
  historical_performance_score: 'Historical Performance', departments_involved: 'Departments Involved',
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

function buildPayload(projectData) {
  return Object.fromEntries(MODEL_FIELDS.map(field => [field, projectData?.[field]]));
}

export function usePredict(projectData) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectData) return;

    async function runPrediction() {
      const payload = buildPayload(projectData);

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
