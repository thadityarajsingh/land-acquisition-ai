from fastapi import APIRouter
from pydantic import BaseModel

from backend.services.prediction_service import predict_project

router = APIRouter(prefix="/predict", tags=["Prediction"])


class PredictionRequest(BaseModel):
    land_area_acres: float
    affected_families: int
    approval_delay_days: int
    legal_disputes: int
    rehab_progress_pct: float
    stakeholder_responsiveness_pct: float
    historical_performance_score: float
    departments_involved: int
    historical_delay_count: int

    state: str
    district: str
    project_type: str
    compensation_status: str
    possession_status: str
    documentation_status: str
    notification_status: str
    acquisition_stage: str


@router.post("")
def predict(request: PredictionRequest):
    features = request.model_dump()
    return predict_project(features)
