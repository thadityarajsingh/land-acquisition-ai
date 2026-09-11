import pandas as pd

from backend.services.model_service import model, pipeline


def predict_project(features: dict) -> dict:
    row = pd.DataFrame([features])

    transformed = pipeline.transform(row)

    probability = float(model.predict_proba(transformed)[0][1])
    predicted_class = int(model.predict(transformed)[0])

    if probability < 0.33:
        risk_category = "Low"
    elif probability < 0.66:
        risk_category = "Medium"
    else:
        risk_category = "High"

    return {
        "risk_score": probability,
        "risk_category": risk_category,
        "predicted_delayed": bool(predicted_class),
    }
