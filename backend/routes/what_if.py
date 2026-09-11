from fastapi import APIRouter
from pydantic import BaseModel

from backend.services.prediction_service import predict_project


router = APIRouter(prefix="/what-if", tags=["What-If"])


class WhatIfRequest(BaseModel):
    baseline: dict
    scenario: dict


@router.post("")
def what_if(request: WhatIfRequest):
    baseline_result = predict_project(request.baseline)
    scenario_result = predict_project(request.scenario)

    baseline_score = baseline_result["risk_score"]
    scenario_score = scenario_result["risk_score"]
    score_delta = scenario_score - baseline_score

    # This is a model-derived scenario estimate, not a guaranteed project outcome.
    estimated_baseline_delay = round(baseline_score * 180)
    estimated_scenario_delay = round(scenario_score * 180)
    days_saved = max(0, estimated_baseline_delay - estimated_scenario_delay)

    return {
        "baseline": baseline_result,
        "scenario": scenario_result,
        "risk_score_change": score_delta,
        "originalScore": round(baseline_score * 100),
        "simulatedScore": round(scenario_score * 100),
        "scoreDelta": round(score_delta * 100),
        "originalDelay": f"{estimated_baseline_delay} model-estimated days",
        "simulatedDelay": f"{estimated_scenario_delay} model-estimated days",
        "daysSaved": days_saved,
        "simulatedCategory": scenario_result["risk_category"].upper(),
        "modelScenario": True,
    }
