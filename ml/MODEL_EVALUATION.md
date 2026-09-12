# SIH26017 Model Evaluation

## Evaluation setup

- Dataset: SIH26017 synthetic prototype dataset with deterministic synthetic feature expansion
- Rows: 1,200
- Target: `is_delayed`
- Positive class (`is_delayed=1`): 339
- Negative class (`is_delayed=0`): 861
- Test split: 20% (240 rows)
- Split: stratified `train_test_split(random_state=42)`
- Prediction features: 68 (36 numeric + 32 categorical)
- Preprocessing: median imputation + standard scaling for numeric features; most-frequent imputation + one-hot encoding for categorical features
- Class imbalance handling for XGBoost: training-set `scale_pos_weight`
- Leakage controls: `is_delayed`, `delay_days`, `project_id`, and demo/provenance outcome fields are excluded from prediction inputs

## Current leakage-safe results

| Metric | XGBoost selected model |
|---|---:|
| Accuracy | 0.6333 |
| Weighted F1 | 0.5925 |
| Delayed Precision | 0.2222 |
| Delayed Recall | 0.1176 |
| Delayed F1 | 0.1538 |
| ROC-AUC | 0.5300 |
| Average Precision | 0.3131 |

### Confusion matrix

```text
                 Predicted
                 0     1
Actual 0       144    28
Actual 1        60     8
```

The model correctly identifies 8 of 68 delayed records in this held-out split. This is weak predictive performance and is the primary reason the current system must remain a prototype decision-support tool.

## Interpretation

The evaluation supports these claims:

- The preprocessing and model inference pipeline is reproducible on a held-out stratified split.
- The selected XGBoost model can produce a continuous risk score for prioritization and What-If experimentation.
- Delayed-class recall is currently low, so the model must not be represented as reliably detecting delayed projects.
- The current dataset is synthetic, so these metrics do not establish real-world government deployment performance.

## Known limitations

- Dataset is synthetic prototype data, not official government records.
- Risk-category thresholds are provisional and are not calibrated probabilities.
- Predictive signal is weak on the current held-out split.
- Synthetic feature correlations are not causal evidence.
- More representative historical data, calibration, regional validation, and governance review are required before production use.
- GIS coordinates and parcel geometry in the prototype are not authoritative cadastral data.
