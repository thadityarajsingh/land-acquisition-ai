import shap
import pandas as pd
import joblib

# Load model once, at module level (not inside the function) — faster if called repeatedly
model = joblib.load("fake_delay_model.pkl")
feature_names = ["pending_approval", "incomplete_documents", "compensation_status"]

# Human-readable labels — update these once you get real feature names from your ML teammate
LABELS = {
    "pending_approval": "Pending approval",
    "incomplete_documents": "Incomplete documents",
    "compensation_status": "Compensation status",
}

RULES = {
    "pending_approval": "Recommend approval follow-up",
    "incomplete_documents": "Recommend document verification",
    "compensation_status": "Recommend compensation review",
}

explainer = shap.TreeExplainer(model)


def explain_and_recommend(input_row: dict, threshold: float = 0.15, top_n: int = 3):
    """
    input_row: dict of feature_name -> value, e.g.
        {"pending_approval": 1, "incomplete_documents": 4, "compensation_status": 0.2}
    Returns a dict with top risk factors and recommendations.
    """
    X = pd.DataFrame([input_row])[feature_names]  # enforce correct column order

    shap_values = explainer(X)
    values = shap_values.values[0][:, 1] if shap_values.values.ndim == 3 else shap_values.values[0]

    pairs = list(zip(feature_names, values))
    pairs.sort(key=lambda x: abs(x[1]), reverse=True)
    top_factors = pairs[:top_n]

    recommendations = [
        RULES[feature] for feature, value in top_factors
        if value > threshold and feature in RULES
    ]

    return {
        "top_risk_factors": [
            {"factor": LABELS.get(f, f), "impact": round(float(v), 2)}
            for f, v in top_factors
        ],
        "recommendations": recommendations,
    }


if __name__ == "__main__":
    # Quick test with a couple of different sample cases
    test_cases = [
        {"pending_approval": 1, "incomplete_documents": 4, "compensation_status": 0.2},
        {"pending_approval": 0, "incomplete_documents": 0, "compensation_status": 0.9},
    ]

    for i, case in enumerate(test_cases, 1):
        result = explain_and_recommend(case)
        print(f"\n--- Test case {i}: {case} ---")
        print("Top Risk Factors")
        for f in result["top_risk_factors"]:
            sign = "+" if f["impact"] > 0 else ""
            print(f"{f['factor']:<25} {sign}{f['impact']}")
        print("Recommendations")
        for r in result["recommendations"]:
            print("->", r)