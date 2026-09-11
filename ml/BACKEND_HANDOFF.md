# ML → Backend Handoff — SIH26017

## Model files
- `ml/model/model.joblib` — trained XGBoost classifier (selected over RandomForest baseline, better recall on the delayed class)
- `ml/model/pipeline.joblib` — fitted preprocessing pipeline (imputation + scaling + one-hot encoding). **Must** be used to transform any new input before calling the model — don't feed raw values directly into `model.joblib`.

## Required Python packages
pandas
numpy
scikit-learn
xgboost
joblib
(from `ml/requirements.txt` — SHAP is also listed there but only needed if you also load the explanation function once Checkpoint 8 lands)

## How to use it
Import and call the existing function directly — don't reimplement prediction logic in the backend:
```python
from ml.predict import predict

result = predict(features_dict)
```

## Exact input format
`predict()` takes a single `dict` with these keys. **All must be present** (the pipeline imputes missing values internally, but the dict itself must have every key, even if the value is `None`/blank):

**Numeric (int or float):**
- `land_area_acres`
- `affected_families`
- `approval_delay_days`
- `legal_disputes`
- `rehab_progress_pct`
- `stakeholder_responsiveness_pct`
- `historical_performance_score`
- `departments_involved`
- `historical_delay_count`

**Categorical (string, must match training values):**
- `state` — one of 10 Indian states in the dataset (e.g. "Maharashtra")
- `district` — one of 50 districts
- `project_type` — one of: Highway, Metro, Power, Airport, Railway, Irrigation, Industrial
- `compensation_status` — one of: Not Started, Partially Paid, Mostly Paid, Fully Paid
- `possession_status` — one of: Not Started, Partial, Mostly Obtained, Full
- `documentation_status` — one of: Incomplete, Partially Complete, Complete
- `notification_status` — one of: Pending, Partially Completed, Completed
- `acquisition_stage` — one of: Planning, Notification, Compensation, Possession, Rehabilitation, Closure

**NOT included as inputs** (excluded intentionally to prevent leakage):
- `is_delayed` (this is what we're predicting)
- `delay_days` (directly encodes the outcome)
- `project_id` (identifier only, not predictive)

## Output format
```python
{
    "risk_score": 0.144,          # float, probability of delay (0-1)
    "risk_category": "Low",       # str, "Low" / "Medium" / "High"
    "predicted_delayed": False    # bool, model's binary prediction
}
```

## Risk category logic (provisional)
risk_score < 0.33 → "Low"
0.33 <= risk_score < 0.66 → "Medium"
risk_score >= 0.66 → "High"
These are fixed round-number thresholds, **not yet tuned** against validated outcome data — flag this as a known limitation if asked, don't present it as calibrated.

## Known limitations (report honestly, don't hide)
- Recall on the delayed class (`is_delayed=1`) is currently ~0.29 — the model misses roughly 7 out of 10 actually-delayed projects. Precision on delayed predictions is also modest (~0.36).
- Class imbalance in training data (861 not-delayed / 339 delayed) partially addressed via `scale_pos_weight`, but signal strength in available features limits further gains without more data or engineered features.
- Numeric features individually show weak correlation with the target; most signal comes from categorical status fields (compensation_status, documentation_status, etc. — see EDA in Checkpoint 2).

## Explainability (pending)
SHAP-based explanation function (global feature importance + per-prediction explanation) is Checkpoint 8, in progress on a separate branch/teammate. Not yet available — this doc will be updated once merged.
