"""
explain.py
SHAP-based explainability for the trained model — Checkpoint 8.
Global feature importance + per-prediction explanation.
"""

import shap
import joblib
import pandas as pd
from preprocess import NUMERIC_FEATURES, CATEGORICAL_FEATURES

_pipeline = joblib.load("model/pipeline.joblib")
_model = joblib.load("model/model.joblib")

_explainer = shap.TreeExplainer(_model)


def _feature_names_after_encoding():
    num_names = NUMERIC_FEATURES
    cat_encoder = _pipeline.named_transformers_["cat"].named_steps["onehot"]
    cat_names = cat_encoder.get_feature_names_out(CATEGORICAL_FEATURES).tolist()
    return num_names + cat_names


def global_feature_importance(X_sample: pd.DataFrame, top_n: int = 10) -> pd.Series:
    X_transformed = _pipeline.transform(X_sample)
    shap_values = _explainer.shap_values(X_transformed)

    feature_names = _feature_names_after_encoding()
    importance = pd.Series(
        abs(shap_values).mean(axis=0), index=feature_names
    ).sort_values(ascending=False)
    return importance.head(top_n)


def explain_single_prediction(features: dict, top_n: int = 5) -> dict:
    row = pd.DataFrame([features], columns=NUMERIC_FEATURES + CATEGORICAL_FEATURES)
    row_transformed = _pipeline.transform(row)
    shap_values = _explainer.shap_values(row_transformed)[0]

    feature_names = _feature_names_after_encoding()
    contributions = pd.Series(shap_values, index=feature_names).sort_values(
        key=abs, ascending=False
    )
    return contributions.head(top_n).to_dict()


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
    print("Top factors for this prediction:")
    print(explain_single_prediction(example))
