from fastapi import APIRouter, HTTPException
import pandas as pd

from backend.services.prediction_service import predict_project, predict_projects


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
    try:
        return predict_projects(records)
    except Exception:
        # Keep the listing available if the model cannot score the full batch.
        enriched = []
        for record in records:
            item = dict(record)
            try:
                prediction = predict_project({column: item.get(column) for column in FEATURE_COLUMNS})
                item.update(prediction)
            except Exception:
                item["risk_score"] = None
                item["risk_category"] = None
                item["predicted_delayed"] = None
            enriched.append(item)
        return enriched


@router.get("")
def get_projects():
    records = add_model_risk(load_projects())
    return {"count": len(records), "projects": records}


@router.get("/{project_id}")
def get_project(project_id: str):
    df = load_projects()
    project = df[df["project_id"] == project_id]

    if project.empty:
        raise HTTPException(status_code=404, detail="Project not found")

    records = add_model_risk(project)
    return records[0]
