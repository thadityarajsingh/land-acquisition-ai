import pandas as pd

from backend.services.model_service import model, pipeline

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


def _category(probability: float) -> str:
    if probability < 0.33:
        return "Low"
    if probability < 0.66:
        return "Medium"
    return "High"


def predict_project(features: dict) -> dict:
    row = pd.DataFrame([features], columns=FEATURE_COLUMNS)
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
