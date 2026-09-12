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


def add_recommendation(items, *, title, action, basis, priority="HIGH", timeframe="Near term"):
    items.append({
        "id": f"REC-{len(items) + 1:02d}",
        "title": title,
        "description": action,
        "action": action,
        "authority": "Project coordination team",
        "impactEstimate": "Risk-focused action",
        "timeframe": timeframe,
        "statutoryRef": basis,
        "basis": basis,
        "urgency": priority,
    })


def build_recommendations(request: RecommendationRequest):
    recommendations = []

    if request.compensation_status != "Fully Paid":
        add_recommendation(
            recommendations,
            title="Resolve pending compensation",
            action="Review unpaid compensation cases, verify payment blockers, and assign follow-up owners.",
            basis="Compensation status is not Fully Paid",
            priority="CRITICAL",
            timeframe="Immediate",
        )

    if request.legal_disputes > 0:
        add_recommendation(
            recommendations,
            title="Prioritize dispute resolution",
            action="Review open legal disputes, classify blockers, and coordinate the next documented resolution step with the concerned stakeholders.",
            basis=f"{request.legal_disputes} legal dispute(s) recorded",
            priority="CRITICAL",
            timeframe="Immediate",
        )

    if request.approval_delay_days > 30:
        add_recommendation(
            recommendations,
            title="Escalate approval backlog",
            action="Identify the pending approval stage, assign an owner, and schedule inter-department follow-up until the recorded delay is resolved.",
            basis=f"Approval delay is {request.approval_delay_days} days",
            priority="HIGH",
            timeframe="Near term",
        )

    if request.rehab_progress_pct < 60:
        add_recommendation(
            recommendations,
            title="Accelerate rehabilitation progress",
            action="Review incomplete rehabilitation activities, affected-family dependencies, and the next measurable completion milestone.",
            basis=f"Rehabilitation progress is {request.rehab_progress_pct:.0f}%",
            priority="HIGH",
            timeframe="Near term",
        )

    if request.stakeholder_responsiveness_pct < 60:
        add_recommendation(
            recommendations,
            title="Increase stakeholder follow-up",
            action="Schedule structured follow-ups with unresponsive stakeholders and record pending decisions or document requests.",
            basis=f"Stakeholder responsiveness is {request.stakeholder_responsiveness_pct:.0f}%",
            priority="HIGH",
            timeframe="Near term",
        )

    if request.documentation_status != "Complete":
        add_recommendation(
            recommendations,
            title="Complete documentation gaps",
            action="Identify missing acquisition records, assign document owners, and verify completeness before the next workflow stage.",
            basis=f"Documentation status is {request.documentation_status}",
            priority="HIGH",
            timeframe="Near term",
        )

    if request.notification_status != "Completed":
        add_recommendation(
            recommendations,
            title="Close notification gaps",
            action="Review pending notifications and record the responsible office, current status, and next completion step.",
            basis=f"Notification status is {request.notification_status}",
            priority="HIGH",
            timeframe="Near term",
        )

    if request.possession_status != "Complete":
        add_recommendation(
            recommendations,
            title="Resolve possession blockers",
            action="Review outstanding possession dependencies and coordinate the documented actions required for the next acquisition stage.",
            basis=f"Possession status is {request.possession_status}",
            priority="HIGH",
            timeframe="Near term",
        )

    if not recommendations:
        add_recommendation(
            recommendations,
            title="Continue routine monitoring",
            action="No rule-based intervention trigger is currently active; continue monitoring project indicators for changes.",
            basis="No configured risk-factor threshold was triggered",
            priority="NORMAL",
            timeframe="Ongoing",
        )

    return recommendations


@router.post("")
def get_recommendations(request: RecommendationRequest):
    recommendations = build_recommendations(request)
    return {
        "recommendations": recommendations,
        "count": len(recommendations),
        "engine": "rule-based risk-factor recommendations",
        "advisory": True,
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
        "engine": "rule-based risk-factor recommendations",
        "advisory": True,
    }
