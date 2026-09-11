"""
predict.py
Loads the saved pipeline + model once, exposes predict() for the FastAPI
/predict endpoint. Also used by the What-If module — same function, same
pipeline, so baseline and scenario results stay comparable (per SRS 4.4).
"""

import joblib
import pandas as pd
from preprocess import NUMERIC_FEATURES, CATEGORICAL_FEATURES

_pipeline = joblib.load("model/pipeline.joblib")
_model = joblib.load("model/model.joblib")

def _risk_category(probability: float) -> str:
    if probability < 0.33:
        return "Low"
    elif probability < 0.66:
        return "Medium"
    return "High"


def predict(features: dict) -> dict:
    """
    features: dict of raw input values, keyed by the same column names
    used in training. Missing keys are fine — the pipeline's imputer fills them.

    Returns:
        {
            "risk_score": float,        # probability of delay (0-1)
            "risk_category": str,       # "Low" / "Medium" / "High"
            "predicted_delayed": bool,  # model's binary prediction
        }
    """
    row = pd.DataFrame([features], columns=NUMERIC_FEATURES + CATEGORICAL_FEATURES)
    transformed = _pipeline.transform(row)

    probability = float(_model.predict_proba(transformed)[0][1])
    predicted_class = int(_model.predict(transformed)[0])

    return {
        "risk_score": probability,
        "risk_category": _risk_category(probability),
        "predicted_delayed": bool(predicted_class),
    }


if __name__ == "__main__":
    example = {
        "land_area_acres": 12.5,
        "affected_families": 40,
        "approval_delay_days": 30,
        "legal_disputes": 1,
        "rehab_progress_pct": 55.0,
        "stakeholder_responsiveness_pct": 60.0,
        "historical_performance_score": 0.7,
        "departments_involved": 3,
        "historical_delay_count": 2,
        "state": "Maharashtra",
        "district": "Pune",
        "project_type": "Highway",
        "compensation_status": "Partial",
        "possession_status": "Pending",
        "documentation_status": "Incomplete",
        "notification_status": "Issued",
        "acquisition_stage": "Compensation",
    }
    print(predict(example))
