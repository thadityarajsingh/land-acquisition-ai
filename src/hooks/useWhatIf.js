import { useState } from 'react';
import { simulateWhatIf } from '../api/whatIf';

const MODEL_FIELDS = [
  'land_area_acres',
  'affected_families',
  'approval_delay_days',
  'legal_disputes',
  'rehab_progress_pct',
  'stakeholder_responsiveness_pct',
  'historical_performance_score',
  'departments_involved',
  'historical_delay_count',
  'state',
  'district',
  'project_type',
  'compensation_status',
  'possession_status',
  'documentation_status',
  'notification_status',
  'acquisition_stage',
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function buildScenario(projectData, parameters) {
  const scenario = {};
  MODEL_FIELDS.forEach(field => {
    scenario[field] = projectData?.[field];
  });

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

      const baseline = {};
      MODEL_FIELDS.forEach(field => {
        baseline[field] = projectData[field];
      });

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
