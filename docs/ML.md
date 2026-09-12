# Machine Learning Documentation

## Purpose

The ML layer estimates the likelihood that a land-acquisition project will be delayed. The output is used for prioritization, explanation, and What-If experimentation.

## Dataset

The current prototype starts from `ml/sih26017_synthetic_land_acquisition_dataset.csv` and deterministically expands it with `ml/expand_dataset.py` when the enhanced dataset is needed.

The source dataset contains 1,200 rows: 339 delayed and 861 non-delayed records. The added fields are **synthetic prototype features** and are not official cadastral or government records.

The target is:

```text
is_delayed
```

The preprocessing excludes:

- `is_delayed` — the target being predicted
- `delay_days` — directly encodes the outcome and would leak target information
- `project_id` — identifier only
- other outcome/post-outcome fields such as `risk_score_demo`, `risk_band_demo`, `data_status`, and `provenance_note`

## Prediction-time feature schema

The current leakage-safe prediction schema contains **68 features: 36 numeric and 32 categorical**. The authoritative lists are defined in `ml/preprocess.py` and are reused by backend inference, explainability, tests, and the frontend payload builders.

The expanded feature groups cover:

- project/location and acquisition indicators;
- green-zone and environmental constraints;
- GIS/spatial context;
- land use and agriculture;
- social impact;
- ownership and legal status;
- administration and approvals;
- financial/compensation indicators;
- infrastructure and natural hazards.

This expanded schema is still synthetic until authoritative source data is ingested.

## Preprocessing

`ml/preprocess.py` builds a `ColumnTransformer`:

- Numeric values: median imputation followed by `StandardScaler`.
- Categorical values: most-frequent imputation followed by `OneHotEncoder(handle_unknown="ignore")`.

The fitted pipeline must be used for inference so training and serving transformations remain consistent.

## Model training

The training pipeline:

1. Loads and cleans the dataset.
2. Performs a stratified 80/20 train/test split with `random_state=42`.
3. Fits the preprocessing pipeline on training data only.
4. Trains a RandomForest baseline.
5. Trains XGBoost with `scale_pos_weight` based on the training class ratio.
6. Evaluates both models on the held-out split.
7. Persists the selected XGBoost model and preprocessing pipeline as joblib artifacts.

The backend also validates the saved pipeline feature schema and can retrain a compatible prototype model when stale/incompatible artifacts are detected.

## Risk score

The backend obtains the probability of the delayed class using `predict_proba`.

The dashboard uses these provisional presentation bands:

| Score / probability | Category |
|---:|---|
| `< 0.40` | Low |
| `0.40–<0.70` | Medium |
| `>= 0.70` | High |

These are demonstration thresholds, **not calibrated probability bands**.

The frontend displays the probability as a 0–100 score.

## Explainability

`backend/services/explainability_service.py` uses SHAP `TreeExplainer` on the trained tree model after applying the fitted preprocessing pipeline.

The API returns the largest absolute SHAP contributions for a single prediction. SHAP values describe model contribution; they do not prove that a feature caused a real-world delay.

## What-If model

The What-If endpoint evaluates the same model twice:

```text
baseline features -> model -> baseline risk
scenario features -> model -> scenario risk
```

The difference is reported as the scenario risk change. The prototype also derives a model-based delay comparison from the risk scores. This is a scenario estimate, not a guaranteed operational outcome.

## Current leakage-safe evaluation

A fresh local evaluation using the current 68 prediction features and the leakage-safe pipeline produced:

| Metric | XGBoost selected model |
|---|---:|
| Accuracy | 0.6333 |
| Weighted F1 | 0.5925 |
| Delayed Precision | 0.2222 |
| Delayed Recall | 0.1176 |
| Delayed F1 | 0.1538 |
| ROC-AUC | 0.5300 |
| Average Precision | 0.3131 |

Held-out confusion matrix:

```text
                 Predicted
                 0     1
Actual 0       144    28
Actual 1        60     8
```

Only 8 of 68 delayed records were identified in this fresh evaluation. This confirms that the model is a **prototype decision-support model with weak predictive signal**, not a production-grade predictor.

## Limitations

- The dataset and expanded fields are synthetic prototype data, not official government records.
- Predictive signal is limited and delayed-class recall is currently low.
- Risk categories are not calibrated probabilities.
- Synthetic feature correlations should not be interpreted as causal relationships.
- Model performance may change materially on authoritative historical data.
- Model outputs should support human prioritization, not replace legal/administrative judgment.
- Production use requires representative historical data, calibration, regional validation, governance, privacy/security review, and monitoring.
