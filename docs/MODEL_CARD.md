# Model Card — BhoomiIQ Risk Model

## Model purpose

The model estimates whether a land-acquisition project record is likely to fall into the delayed class, producing a risk score used for prioritization, explanation, and What-If comparison in the BhoomiIQ prototype.

It is a **decision-support model**, not an autonomous decision maker.

## Model details

| Item | Current prototype |
|---|---|
| Selected algorithm | XGBoost classifier |
| Baseline | RandomForest |
| Source dataset | SIH26017 synthetic prototype dataset |
| Rows | 1,200 |
| Target | `is_delayed` |
| Positive class | 339 |
| Negative class | 861 |
| Test set | 240 rows (20%) |
| Split | Stratified `train_test_split(random_state=42)` |
| Prediction features | 68 (36 numeric + 32 categorical) |
| Explainability | SHAP TreeExplainer |

## Current leakage-safe evaluation

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

Only 8 of 68 delayed records were identified in this fresh leakage-safe evaluation. The model therefore has **weak current predictive signal** and must be presented as a prototype.

## Inputs

The model uses 68 prediction-time features spanning project/acquisition indicators, green-zone/environmental constraints, GIS/spatial context, land use, social impact, ownership/legal status, administration/approvals, financial indicators, infrastructure, and hazards.

Outcome/leakage fields including `is_delayed` and `delay_days` are excluded. Additional demo/provenance fields are also excluded from prediction.

The expanded feature values are synthetic prototype values until authoritative source data is legitimately ingested.

## Preprocessing

- Numeric values: median imputation + standard scaling.
- Categorical values: most-frequent imputation + one-hot encoding.
- The fitted preprocessing pipeline is persisted and reused during backend inference.
- Backend inference validates the saved pipeline schema and can retrain a compatible prototype model if stale artifacts are detected.

## Risk categories

The dashboard/API use the same provisional presentation bands:

- **Low:** probability < 0.40
- **Medium:** 0.40 to < 0.70
- **High:** >= 0.70

These are presentation thresholds, not calibrated probabilities.

## Explainability

SHAP TreeExplainer provides feature-level contribution signals for individual predictions. A SHAP contribution explains the model's behavior for that prediction; it does **not** prove that a factor caused a real-world delay.

## Intended use

Appropriate prototype uses:

- prioritizing projects for human review;
- exploring risk factors;
- comparing model outputs under What-If scenarios;
- demonstrating an AI-assisted land-acquisition workflow.

## Out-of-scope use

The model must not be used by itself to:

- approve or reject land acquisition;
- determine compensation or rehabilitation entitlement;
- make legal findings;
- declare an official project delay;
- replace government officers, legal review, public consultation, or due process.

## Limitations and risks

1. The training/evaluation dataset is synthetic.
2. Current delayed-class recall is low.
3. Risk categories are provisional and not calibrated probabilities.
4. Synthetic data may not represent regional, legal, social, or administrative conditions in real projects.
5. Model performance may change materially on authoritative historical data.
6. Correlation in model features should not be interpreted as causation.

## Improvement plan

Before production use, the model should be retrained and independently validated on representative historical acquisition data, calibrated against the intended operational target, evaluated across regions and project types, checked for subgroup/error disparities, monitored after deployment, and reviewed under appropriate government data-governance and security processes.

See [`ML.md`](./ML.md), [`../ml/MODEL_EVALUATION.md`](../ml/MODEL_EVALUATION.md), and [`REAL_DATA_SCHEMA.md`](./REAL_DATA_SCHEMA.md).