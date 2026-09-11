from fastapi import APIRouter, HTTPException
import pandas as pd

from backend.services.geo_service import enrich_project_geo


DATASET_PATH = "ml/sih26017_synthetic_land_acquisition_dataset.csv"

router = APIRouter(prefix="/projects", tags=["Projects"])


def load_projects():
    df = pd.read_csv(DATASET_PATH)

    # Convert pandas NaN values to JSON-compatible None/null.
    df = df.astype(object).where(pd.notna(df), None)

    records = df.to_dict(orient="records")
    return [enrich_project_geo(record) for record in records]


@router.get("")
def get_projects():
    projects = load_projects()

    return {
        "count": len(projects),
        "projects": projects,
    }


@router.get("/{project_id}")
def get_project(project_id: str):
    projects = load_projects()
    project = next((item for item in projects if item["project_id"] == project_id), None)

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    return project
