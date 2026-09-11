from fastapi import APIRouter
from pydantic import BaseModel

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


@router.post("")
def get_recommendations(request: RecommendationRequest):

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

    return {
        "recommendations": recommendations,
        "count": len(recommendations)
    }
