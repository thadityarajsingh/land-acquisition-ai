"""
train.py
Train/test split, baseline model, XGBoost, save artifacts to ml/model/.
Run: python train.py sih26017_synthetic_land_acquisition_dataset.csv
"""

import sys
import os
import joblib
from sklearn.model_selection import train_test_split

from preprocess import (
    load_raw_data, clean_data, build_pipeline,
    TARGET_COLUMN, NUMERIC_FEATURES, CATEGORICAL_FEATURES,
)
from evaluate import evaluate_model


def main(data_path: str):
    df = load_raw_data(data_path)
    df = clean_data(df)

    X = df[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    pipeline = build_pipeline()
    X_train_t = pipeline.fit_transform(X_train)
    X_test_t = pipeline.transform(X_test)

    from sklearn.ensemble import RandomForestClassifier
    baseline = RandomForestClassifier(
        n_estimators=200, random_state=42, class_weight="balanced"
    )
    baseline.fit(X_train_t, y_train)
    print("=== Baseline (RandomForest, class_weight=balanced) ===")
    evaluate_model(baseline, X_test_t, y_test)

    # scale_pos_weight tells XGBoost to weigh the minority class (delayed=1)
    # more heavily — ratio of negative to positive examples in training data
    neg = (y_train == 0).sum()
    pos = (y_train == 1).sum()
    weight = neg / pos

    from xgboost import XGBClassifier
    xgb = XGBClassifier(
        n_estimators=300, max_depth=5, learning_rate=0.05,
        eval_metric="logloss", random_state=42,
        scale_pos_weight=weight,
    )
    xgb.fit(X_train_t, y_train)
    print(f"\n=== XGBoost (scale_pos_weight={weight:.2f}) ===")
    evaluate_model(xgb, X_test_t, y_test)

    best_model = xgb

    os.makedirs("model", exist_ok=True)
    joblib.dump(pipeline, "model/pipeline.joblib")
    joblib.dump(best_model, "model/model.joblib")
    print("\nSaved pipeline.joblib and model.joblib to model/")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "sih26017_synthetic_land_acquisition_dataset.csv")
