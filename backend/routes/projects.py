from fastapi import APIRouter, HTTPException
import pandas as pd

from backend.services.prediction_service import predict_project


DATASET_PATH = "ml/sih26017_synthetic_land_acquisition_dataset.csv"

FEATURE_COLUMNS = [
    "land_area_acres",
    "affected_families",
    "approval_delay_days",
    "legal_disputes",
    "rehab_progress_pct",
    "stakeholder_responsiveness_pct",
    "historical_performance_score",
    "departments_involved",
    "historical_delay_count",
    "state",
    "district",
    "project_type",
    "compensation_status",
    "possession_status",
    "documentation_status",
    "notification_status",
    "acquisition_stage",
]

router = APIRouter(prefix="/projects", tags=["Projects"])


def load_projects():
    df = pd.read_csv(DATASET_PATH)
    df = df.astype(object).where(pd.notna(df), None)
    return df


def add_model_risk(df):
    records = df.to_dict(orient="records")
    for record in records:
        features = {column: record.get(column) for column in FEATURE_COLUMNS}
        try:
            prediction = predict_project(features)
            record["risk_score"] = prediction["risk_score"]
            record["risk_category"] = prediction["risk_category"]
            record["predicted_delayed"] = prediction["predicted_delayed"]
        except Exception:
            # Keep project listing available even if one malformed row cannot be scored.
            record["risk_score"] = None
            record["risk_category"] = None
            record["predicted_delayed"] = None
    return records


@router.get("")
def get_projects():
    df = load_projects()
    records = add_model_risk(df)
    return {
        "count": len(records),
        "projects": records,
    }


@router.get("/{project_id}")
def get_project(project_id: str):
    df = load_projects()
    project = df[df["project_id"] == project_id]

    if project.empty:
        raise HTTPException(status_code=404, detail="Project not found")

    records = add_model_risk(project)
    return records[0]
