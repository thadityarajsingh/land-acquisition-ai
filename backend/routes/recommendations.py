from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd

from backend.routes.projects import load_projects

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


class RecommendationRequest(BaseModel):
    compensation_status: str
    approval_delay_days: int
    legal_disputes: int
    rehab_progress_pct: float
    stakeholder_responsiveness_pct: float
    documentation_status: str
    notification_status: str
    possession_status: str


def build_recommendations(request: RecommendationRequest):
    recommendations = []

    if request.compensation_status != "Fully Paid":
        recommendations.append(
            "Prioritize pending compensation payments and resolve payment-related issues."
        )

    if request.approval_delay_days > 30:
        recommendations.append(
            "Escalate delayed approvals and coordinate with the concerned departments."
        )

    if request.legal_disputes > 0:
        recommendations.append(
            "Review pending legal disputes and initiate legal resolution with stakeholders."
        )

    if request.rehab_progress_pct < 60:
        recommendations.append(
            "Accelerate rehabilitation and resettlement activities for affected families."
        )

    if request.stakeholder_responsiveness_pct < 60:
        recommendations.append(
            "Increase stakeholder coordination and follow-up to improve responsiveness."
        )

    if request.documentation_status != "Complete":
        recommendations.append(
            "Complete missing or incomplete land acquisition documentation."
        )

    if request.notification_status != "Completed":
        recommendations.append(
            "Ensure pending statutory notifications are completed."
        )

    if request.possession_status != "Complete":
        recommendations.append(
            "Resolve outstanding possession issues before proceeding to the next stage."
        )

    if not recommendations:
        recommendations.append(
            "No major intervention required. Continue monitoring the project."
        )

    return recommendations


@router.post("")
def get_recommendations(request: RecommendationRequest):
    recommendations = build_recommendations(request)
    return {
        "recommendations": recommendations,
        "count": len(recommendations),
    }


@router.get("/{project_id}")
def get_project_recommendations(project_id: str):
    df = load_projects()
    project = df[df["project_id"] == project_id]

    if project.empty:
        raise HTTPException(status_code=404, detail="Project not found")

    row = project.iloc[0]

    def value(column, default):
        raw = row[column]
        return default if pd.isna(raw) else raw

    request = RecommendationRequest(
        compensation_status=str(value("compensation_status", "Pending")),
        approval_delay_days=int(value("approval_delay_days", 0)),
        legal_disputes=int(value("legal_disputes", 0)),
        rehab_progress_pct=float(value("rehab_progress_pct", 0)),
        stakeholder_responsiveness_pct=float(value("stakeholder_responsiveness_pct", 0)),
        documentation_status=str(value("documentation_status", "Incomplete")),
        notification_status=str(value("notification_status", "Pending")),
        possession_status=str(value("possession_status", "Partial")),
    )

    recommendations = build_recommendations(request)
    return {
        "project_id": project_id,
        "recommendations": recommendations,
        "count": len(recommendations),
    }
