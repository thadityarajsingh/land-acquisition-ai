import { useState } from 'react';
import { simulateWhatIf } from '../api/whatIf';

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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function buildScenario(projectData, parameters) {
  const scenario = Object.fromEntries(MODEL_FIELDS.map(field => [field, projectData?.[field]]));

  const compensationMultiplier = Number(parameters.compensationMultiplier ?? 1);
  const surveyCompletionPct = Number(parameters.surveyCompletionPct ?? 58);
  const litigationCases = Number(parameters.litigationCases ?? projectData?.legal_disputes ?? 0);
  const solatiumTopUpPct = Number(parameters.solatiumTopUpPct ?? 0);

  // Map policy controls to fields the trained model actually supports.
  // These are model scenarios, not guarantees of real-world outcomes.
  scenario.legal_disputes = Math.max(0, Math.round(litigationCases));

  const surveyGain = surveyCompletionPct - 58;
  scenario.rehab_progress_pct = clamp(
    Number(projectData?.rehab_progress_pct ?? 0) + surveyGain * 0.45,
    0,
    100
  );
  scenario.stakeholder_responsiveness_pct = clamp(
    Number(projectData?.stakeholder_responsiveness_pct ?? 0) + surveyGain * 0.35,
    0,
    100
  );

  if (compensationMultiplier >= 1.5 || solatiumTopUpPct >= 15) {
    scenario.compensation_status = 'Fully Paid';
  } else if (compensationMultiplier > 1.0 || solatiumTopUpPct > 0) {
    scenario.compensation_status = 'Partially Paid';
  }

  if (surveyCompletionPct >= 90) {
    scenario.documentation_status = 'Complete';
    scenario.notification_status = 'Completed';
  } else if (surveyCompletionPct >= 70) {
    scenario.documentation_status = 'In Progress';
    scenario.notification_status = 'Pending';
  }

  return scenario;
}

export function useWhatIf(projectData) {
  const [whatIfResult, setWhatIfResult] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState(null);

  const runSimulation = async (parameters) => {
    if (!projectData) return null;

    try {
      setSimulating(true);
      setError(null);

      const baseline = Object.fromEntries(MODEL_FIELDS.map(field => [field, projectData[field]]));
      const scenario = buildScenario(projectData, parameters);
      const result = await simulateWhatIf({ baseline, scenario });
      setWhatIfResult(result);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setSimulating(false);
    }
  };

  const resetSimulation = () => {
    setWhatIfResult(null);
    setError(null);
  };

  return {
    whatIfResult,
    simulating,
    error,
    runSimulation,
    resetSimulation,
  };
}
