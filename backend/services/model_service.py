from pathlib import Path

import joblib
import pandas as pd

from ml.preprocess import (
    TARGET_COLUMN,
    NUMERIC_FEATURES,
    CATEGORICAL_FEATURES,
    clean_data,
    build_pipeline,
)

ROOT_DIR = Path(__file__).resolve().parents[2]
MODEL_PATH = ROOT_DIR / "ml" / "model" / "model.joblib"
PIPELINE_PATH = ROOT_DIR / "ml" / "model" / "pipeline.joblib"
DATA_PATH = ROOT_DIR / "ml" / "sih26017_synthetic_land_acquisition_dataset.csv"
ENHANCED_PATH = ROOT_DIR / "ml" / "sih26017_enhanced_land_acquisition_dataset.csv"
FEATURE_COLUMNS = NUMERIC_FEATURES + CATEGORICAL_FEATURES


def _train_model():
    from sklearn.model_selection import train_test_split
    from xgboost import XGBClassifier
    from ml.expand_dataset import expand

    if ENHANCED_PATH.exists():
        df = pd.read_csv(ENHANCED_PATH)
    else:
        source = pd.read_csv(DATA_PATH)
        df = expand(source)
        df.to_csv(ENHANCED_PATH, index=False)

    df = clean_data(df)
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]
    X_train, _, y_train, _ = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    fitted_pipeline = build_pipeline()
    X_train_t = fitted_pipeline.fit_transform(X_train)
    neg = (y_train == 0).sum()
    pos = (y_train == 1).sum()
    weight = neg / pos if pos else 1.0

    fitted_model = XGBClassifier(
        n_estimators=300,
        max_depth=5,
        learning_rate=0.05,
        eval_metric="logloss",
        random_state=42,
        scale_pos_weight=weight,
    )
    fitted_model.fit(X_train_t, y_train)

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(fitted_pipeline, PIPELINE_PATH)
    joblib.dump(fitted_model, MODEL_PATH)
    return fitted_model, fitted_pipeline


def _load_or_retrain():
    try:
        fitted_model = joblib.load(MODEL_PATH)
        fitted_pipeline = joblib.load(PIPELINE_PATH)
        expected = set(FEATURE_COLUMNS)
        actual = set(getattr(fitted_pipeline, "feature_names_in_", []))
        if actual == expected:
            return fitted_model, fitted_pipeline
    except Exception:
        pass

    return _train_model()


# Keep one canonical model/pipeline pair and automatically repair stale
# artifacts when the preprocessing feature schema changes.
model, pipeline = _load_or_retrain()
