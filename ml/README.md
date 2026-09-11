# ML — SIH26017

Machine-learning pipeline for early detection of land acquisition delays.

## Pipeline
1. Load the SIH26017 prototype dataset.
2. Select the documented 17 prediction features.
3. Impute missing numeric/categorical values and encode categorical features.
4. Train and evaluate baseline/tree models.
5. Persist the trained model and preprocessing pipeline.
6. Use `predict.py` for inference.

Target: `is_delayed`.

`delay_days` is retained as a secondary dataset target/analysis field and must not be used as a classifier feature.

The current dataset is a synthetic prototype because the public SIH26017 dataset link did not provide row-level CSV/Excel data. It must not be represented as official government data.
