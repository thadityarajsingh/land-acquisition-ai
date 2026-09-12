# Machine Learning Documentation

## Purpose

The ML layer estimates the likelihood that a land-acquisition project will be delayed. The output is used for prioritization, explanation, and What-If experimentation.

## Dataset

The current prototype uses `ml/sih26017_synthetic_land_acquisition_dataset.csv`.

The target is:

```text
is_delayed
```

The preprocessing intentionally excludes:

- `is_delayed` — the target being predicted
- `delay_days` — directly encodes the outcome and would leak target information
- `project_id` — identifier only

The current evaluation contains 1,200 rows: 339 delayed and 861 non-delayed records.

## Features

### Numeric

- `land_area_acres`
- `affected_families`
- `approval_delay_days`
- `legal_disputes`
- `rehab_progress_pct`
- `stakeholder_responsiveness_pct`
- `historical_performance_score`
- `departments_involved`
- `historical_delay_count`

### Categorical

- `state`
- `district`
- `project_type`
- `compensation_status`
- `possession_status`
- `documentation_status`
- `notification_status`
- `acquisition_stage`

## Preprocessing

`ml/preprocess.py` builds a `ColumnTransformer`:

- Numeric values: median imputation followed by `StandardScaler`.
- Categorical values: most-frequent imputation followed by `OneHotEncoder(handle_unknown="ignore")`.

The fitted pipeline must be used for inference so training and serving transformations remain consistent.

## Model training

`ml/train.py`:

1. Loads and cleans the dataset.
2. Performs a stratified 80/20 train/test split with `random_state=42`.
3. Fits the preprocessing pipeline on training data.
4. Trains a balanced RandomForest baseline.
5. Trains XGBoost with `scale_pos_weight` based on the training class ratio.
6. Evaluates both models.
7. Persists the selected XGBoost model and preprocessing pipeline as joblib artifacts.

The selected model is XGBoost because it detects the delayed class on the held-out evaluation split, unlike the RandomForest baseline at its default decision threshold.

## Risk score

The backend obtains the probability of the delayed class using `predict_proba`.

Provisional categories:

| Probability | Category |
|---:|---|
| `< 0.33` | Low |
| `0.33–<0.66` | Medium |
| `>= 0.66` | High |

These thresholds are demonstration thresholds, not calibrated probability bands.

The frontend displays the probability as a percentage-style score from 0 to 100.

## Explainability

`backend/services/explainability_service.py` uses SHAP `TreeExplainer` on the trained tree model after applying the fitted preprocessing pipeline.

The API returns the largest absolute SHAP contributions for a single prediction.

SHAP values describe model contribution; they do not prove that a feature caused a delay.

## What-If model

The What-If endpoint evaluates the same model twice:

```text
baseline features -> model -> baseline risk
scenario features -> model -> scenario risk
```

The difference is reported as the scenario risk change. The prototype also derives a model-based delay comparison from the risk scores. This is a scenario estimate, not a guaranteed operational outcome.

## Current evaluation

From `ml/MODEL_EVALUATION.md`:

| Model | Accuracy | Weighted F1 | Delayed Precision | Delayed Recall | Delayed F1 | ROC-AUC | Average Precision |
|---|---:|---:|---:|---:|---:|---:|---:|
| RandomForest (balanced) | 0.7083 | 0.5943 | 0.0000 | 0.0000 | 0.0000 | 0.5077 | 0.2962 |
| XGBoost (selected) | 0.6708 | 0.6551 | 0.3922 | 0.2941 | 0.3361 | 0.5729 | 0.3756 |

The delayed-class recall is currently 29.41% on the held-out split.

## Limitations

- The dataset is synthetic prototype data, not official government records.
- Predictive signal is limited by the current feature set and dataset.
- Delayed-class recall is modest.
- Risk categories are not calibrated probabilities.
- Model outputs should support human prioritization, not replace legal/administrative judgment.
- Model performance must be re-evaluated on representative historical data before production decision-making.
