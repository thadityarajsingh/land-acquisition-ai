# SIH26017 Model Evaluation

## Evaluation setup

- Dataset: SIH26017 synthetic prototype dataset
- Rows: 1,200
- Target: `is_delayed`
- Positive class (`is_delayed=1`): 339
- Negative class (`is_delayed=0`): 861
- Test split: 20% (240 rows)
- Split: stratified `train_test_split(random_state=42)`
- Preprocessing: median imputation + standard scaling for numeric features; most-frequent imputation + one-hot encoding for categorical features
- Class imbalance handling for XGBoost: `scale_pos_weight = 2.54`
- No target leakage: `is_delayed` and `delay_days` are excluded from model inputs

## Results

| Model | Accuracy | Weighted F1 | Delayed Precision | Delayed Recall | Delayed F1 | ROC-AUC | Average Precision |
|---|---:|---:|---:|---:|---:|---:|---:|
| RandomForest (balanced) | 0.7083 | 0.5943 | 0.0000 | 0.0000 | 0.0000 | 0.5077 | 0.2962 |
| XGBoost (selected) | 0.6708 | 0.6551 | 0.3922 | 0.2941 | 0.3361 | 0.5729 | 0.3756 |

## Selected model

XGBoost remains the selected model because it detects the delayed class, while the RandomForest baseline at the default 0.5 decision threshold predicted no delayed test cases in this evaluation.

### XGBoost confusion matrix

```text
                 Predicted
                 0     1
Actual 0       141    31
Actual 1        48    20
```

The model correctly identifies 20 of 68 delayed projects in this held-out split, giving delayed-class recall of 0.2941. It misses 48 delayed projects in this evaluation.

## Interpretation

This model should be presented as a **prototype decision-support model**, not as a calibrated production predictor. The current feature set and synthetic dataset provide limited predictive signal. Accuracy alone should not be used to claim model quality because the target is imbalanced.

The current evaluation supports these claims:

- The pipeline is reproducible and uses a held-out stratified test set.
- XGBoost performs better than the RandomForest baseline for identifying the delayed class.
- The model can provide a risk score useful for prioritization and What-If experimentation.
- Delayed-class recall is currently modest, so the model should not be represented as reliably detecting every delayed project.

## Known limitations

- Dataset is synthetic prototype data, not official government records.
- Risk-category thresholds are provisional and are not calibrated probabilities.
- Delayed-class recall is only 29.41% on the current held-out split.
- More representative historical data and stronger feature engineering are needed before production use.
- GIS coordinates are prototype district-reference coordinates and are not official cadastral geometry.
