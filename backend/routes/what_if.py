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

    return {
        "baseline": baseline_result,
        "scenario": scenario_result,
        "risk_score_change": (
            scenario_result["risk_score"] - baseline_result["risk_score"]
        ),
    }
