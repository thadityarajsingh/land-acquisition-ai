# Model Card — BhoomiIQ Risk Model

## Model purpose

The model estimates whether a land-acquisition project record is likely to fall into the delayed class, producing a risk score used for prioritization, explanation, and What-If comparison in the BhoomiIQ prototype.

It is a **decision-support model**, not an autonomous decision maker.

## Model details

| Item | Current prototype |
|---|---|
| Selected algorithm | XGBoost classifier |
| Baseline | Balanced RandomForest |
| Dataset | SIH26017 synthetic prototype dataset |
| Dataset rows | 1,200 |
| Target | `is_delayed` |
| Positive class | 339 |
| Negative class | 861 |
| Test set | 240 rows (20%) |
| Split | Stratified `train_test_split(random_state=42)` |
| Imbalance handling | `scale_pos_weight = 2.54` for XGBoost |
| Explainability | SHAP TreeExplainer |

## Evaluation

| Model | Accuracy | Weighted F1 | Delayed Precision | Delayed Recall | Delayed F1 | ROC-AUC | Average Precision |
|---|---:|---:|---:|---:|---:|---:|---:|
| RandomForest (balanced) | 0.7083 | 0.5943 | 0.0000 | 0.0000 | 0.0000 | 0.5077 | 0.2962 |
| XGBoost (selected) | 0.6708 | 0.6551 | 0.3922 | 0.2941 | 0.3361 | 0.5729 | 0.3756 |

The selected XGBoost model correctly identified 20 of 68 delayed records in the documented held-out split. Delayed-class recall was therefore 29.41%.

## Inputs

The model uses project/acquisition indicators such as location categories, project type, land area, affected families, compensation status, approval delay, legal disputes, possession, rehabilitation progress, stakeholder responsiveness, historical performance, documentation, notification, departments involved, acquisition stage, and historical delay count.

`is_delayed` and `delay_days` are excluded from model inputs to avoid target leakage.

## Preprocessing

- Numeric values: median imputation + standard scaling.
- Categorical values: most-frequent imputation + one-hot encoding.
- The fitted preprocessing pipeline is persisted and reused during backend inference.

## Explainability

SHAP TreeExplainer is used to provide feature-level contribution signals for individual predictions. A SHAP contribution explains the model's behavior for that prediction; it does **not** prove that a factor caused a real-world delay.

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
2. The current delayed-class recall is modest.
3. Risk categories are provisional bands, not calibrated probabilities.
4. Synthetic data may not represent regional, legal, social, or administrative conditions in real projects.
5. Model performance may change materially on authoritative historical data.
6. Correlation in model features should not be interpreted as causation.

## Improvement plan

Before any production use, the model should be retrained and independently validated on representative historical data, calibrated against the intended operational target, evaluated across regions and project types, checked for subgroup/error disparities, monitored after deployment, and reviewed under appropriate government data-governance and security processes.

See [`ML.md`](./ML.md) and [`../ml/MODEL_EVALUATION.md`](../ml/MODEL_EVALUATION.md) for implementation and evaluation details.