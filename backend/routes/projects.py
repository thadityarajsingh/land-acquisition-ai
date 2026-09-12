from pathlib import Path

from fastapi import APIRouter, HTTPException
import pandas as pd

from backend.services.prediction_service import predict_project, predict_projects
from ml.expand_dataset import expand
from ml.preprocess import NUMERIC_FEATURES, CATEGORICAL_FEATURES


ROOT_DIR = Path(__file__).resolve().parents[2]
DATASET_PATH = ROOT_DIR / "ml" / "sih26017_synthetic_land_acquisition_dataset.csv"
ENHANCED_DATASET_PATH = ROOT_DIR / "ml" / "sih26017_enhanced_land_acquisition_dataset.csv"
FEATURE_COLUMNS = NUMERIC_FEATURES + CATEGORICAL_FEATURES

router = APIRouter(prefix="/projects", tags=["Projects"])


def load_projects():
    if ENHANCED_DATASET_PATH.exists():
        df = pd.read_csv(ENHANCED_DATASET_PATH)
    else:
        source = pd.read_csv(DATASET_PATH)
        df = expand(source)
        df.to_csv(ENHANCED_DATASET_PATH, index=False)

    return df.astype(object).where(pd.notna(df), None)


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
