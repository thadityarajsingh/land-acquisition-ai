# ML → Backend Handoff — SIH26017

## Model files
- `ml/model/model.joblib` — trained XGBoost classifier (selected over the RandomForest baseline because it detects the delayed class on the held-out evaluation split)
- `ml/model/pipeline.joblib` — fitted preprocessing pipeline (imputation + scaling + one-hot encoding). **Must** be used to transform any new input before calling the model — do not feed raw values directly into `model.joblib`.

## Required Python packages
pandas
numpy
scikit-learn
xgboost
joblib
shap

## How to use it
Import and call the existing function directly — do not reimplement prediction logic in the backend:
```python
from ml.predict import predict

result = predict(features_dict)
```

## Exact input format
`predict()` takes a single `dict` with these keys. All must be present (the pipeline imputes missing values internally, but the dict itself must have every key, even if the value is `None`/blank).

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

**Categorical (string):**
- `state`
- `district`
- `project_type`
- `compensation_status`
- `possession_status`
- `documentation_status`
- `notification_status`
- `acquisition_stage`

**NOT included as inputs** (excluded intentionally to prevent leakage):
- `is_delayed` (this is what we're predicting)
- `delay_days` (directly encodes the outcome)
- `project_id` (identifier only, not predictive)

## Output format
```python
{
    "risk_score": 0.144,
    "risk_category": "Low",
    "predicted_delayed": False
}
```

## Risk category logic (provisional)
- `risk_score < 0.33` → `Low`
- `0.33 <= risk_score < 0.66` → `Medium`
- `risk_score >= 0.66` → `High`

These fixed thresholds are **not calibrated probability thresholds**. Treat them as provisional demo categories.

## Current held-out evaluation
Evaluation uses a stratified 80/20 split with `random_state=42` and the same preprocessing/model recipe used by `train.py`.

| Model | Accuracy | Weighted F1 | Delayed Precision | Delayed Recall | Delayed F1 | ROC-AUC | Average Precision |
|---|---:|---:|---:|---:|---:|---:|---:|
| RandomForest (balanced) | 0.7083 | 0.5943 | 0.0000 | 0.0000 | 0.0000 | 0.5077 | 0.2962 |
| XGBoost (selected) | 0.6708 | 0.6551 | 0.3922 | 0.2941 | 0.3361 | 0.5729 | 0.3756 |

XGBoost is retained because it identifies delayed projects on the held-out split, whereas the RandomForest baseline predicted no delayed cases at the default threshold.

### XGBoost confusion matrix
```text
                 Predicted
                 0     1
Actual 0       141    31
Actual 1        48    20
```

The delayed-class recall is 29.41%, so the model misses 48 of 68 delayed projects in this evaluation split. This limitation must be disclosed in technical discussions.

## Explainability
The backend now provides SHAP-based per-prediction explanations through the prediction explainability route. SHAP values are calculated using the same fitted preprocessing pipeline and TreeExplainer model. They are model contributions on the model's log-odds scale; they should not be described as causal effects.

## Known limitations
- Dataset is synthetic prototype data, not official government records.
- Delayed-class recall is currently modest (29.41% on the held-out split).
- Risk categories use provisional fixed thresholds and are not calibrated probabilities.
- More representative historical data and feature engineering are needed before production use.
- GIS coordinates are prototype district-reference coordinates and are not official cadastral geometry.
