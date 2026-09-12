from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel, ConfigDict

from backend.services.prediction_service import predict_project
from backend.services.explainability_service import explain_single_prediction


router = APIRouter(prefix="/predict", tags=["Prediction"])


class PredictionRequest(BaseModel):
    # Keep the existing API fields for frontend compatibility while allowing
    # the expanded dataset features to be passed through when available.
    model_config = ConfigDict(extra="allow")

    land_area_acres: Optional[float] = None
    affected_families: Optional[int] = None
    approval_delay_days: Optional[int] = None
    legal_disputes: Optional[int] = None
    rehab_progress_pct: Optional[float] = None
    stakeholder_responsiveness_pct: Optional[float] = None
    historical_performance_score: Optional[float] = None
    departments_involved: Optional[int] = None
    historical_delay_count: Optional[int] = None

    state: Optional[str] = None
    district: Optional[str] = None
    project_type: Optional[str] = None
    compensation_status: Optional[str] = None
    possession_status: Optional[str] = None
    documentation_status: Optional[str] = None
    notification_status: Optional[str] = None
    acquisition_stage: Optional[str] = None


@router.post("")
def predict(request: PredictionRequest):
    features = request.model_dump()
    return predict_project(features)


@router.post("/explain")
def explain(request: PredictionRequest):
    features = request.model_dump()
    return {
        "top_factors": explain_single_prediction(features)
    }
