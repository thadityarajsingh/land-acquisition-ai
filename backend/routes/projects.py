from fastapi import APIRouter, HTTPException
import pandas as pd


DATASET_PATH = "ml/sih26017_synthetic_land_acquisition_dataset.csv"

router = APIRouter(prefix="/projects", tags=["Projects"])


def load_projects():
    df = pd.read_csv(DATASET_PATH)

    # Convert pandas NaN values to JSON-compatible None/null
    df = df.astype(object).where(pd.notna(df), None)

    return df


@router.get("")
def get_projects():
    df = load_projects()

    return {
        "count": len(df),
        "projects": df.to_dict(orient="records")
    }


@router.get("/{project_id}")
def get_project(project_id: str):
    df = load_projects()

    project = df[df["project_id"] == project_id]

    if project.empty:
        raise HTTPException(status_code=404, detail="Project not found")

    return project.iloc[0].to_dict()
