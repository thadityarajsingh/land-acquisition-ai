import pandas as pd

from backend.services.model_service import model, pipeline
from ml.preprocess import NUMERIC_FEATURES, CATEGORICAL_FEATURES

FEATURE_COLUMNS = NUMERIC_FEATURES + CATEGORICAL_FEATURES


def _category(probability: float) -> str:
    if probability < 0.40:
        return "Low"
    if probability < 0.70:
        return "Medium"
    return "High"


def _feature_row(features: dict) -> pd.DataFrame:
    # Build the exact schema expected by the retrained pipeline. Missing
    # features are intentionally left as None so the pipeline imputers
    # handle them consistently.
    return pd.DataFrame(
        [{column: features.get(column) for column in FEATURE_COLUMNS}],
        columns=FEATURE_COLUMNS,
    )


def predict_project(features: dict) -> dict:
    row = _feature_row(features)
    transformed = pipeline.transform(row)
    probability = float(model.predict_proba(transformed)[0][1])
    predicted_class = int(model.predict(transformed)[0])
    return {
        "risk_score": probability,
        "risk_category": _category(probability),
        "predicted_delayed": bool(predicted_class),
    }


def predict_projects(records: list[dict]) -> list[dict]:
    if not records:
        return []

    rows = pd.DataFrame(
        [{column: record.get(column) for column in FEATURE_COLUMNS} for record in records],
        columns=FEATURE_COLUMNS,
    )
    transformed = pipeline.transform(rows)
    probabilities = model.predict_proba(transformed)[:, 1]
    predicted_classes = model.predict(transformed)

    enriched = []
    for record, probability, predicted_class in zip(records, probabilities, predicted_classes):
        probability = float(probability)
        item = dict(record)
        item["risk_score"] = probability
        item["risk_category"] = _category(probability)
        item["predicted_delayed"] = bool(predicted_class)
        enriched.append(item)
    return enriched
