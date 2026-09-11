from pathlib import Path

import joblib
import pandas as pd
import shap

from ml.preprocess import NUMERIC_FEATURES, CATEGORICAL_FEATURES


BASE_DIR = Path(__file__).resolve().parents[1]

PIPELINE_PATH = BASE_DIR / "models" / "pipeline.joblib"
MODEL_PATH = BASE_DIR / "models" / "model.joblib"

_pipeline = joblib.load(PIPELINE_PATH)
_model = joblib.load(MODEL_PATH)

_explainer = shap.TreeExplainer(_model)


def _feature_names_after_encoding():
    num_names = NUMERIC_FEATURES

    cat_encoder = (
        _pipeline.named_transformers_["cat"]
        .named_steps["onehot"]
    )

    cat_names = cat_encoder.get_feature_names_out(
        CATEGORICAL_FEATURES
    ).tolist()

    return num_names + cat_names


def explain_single_prediction(features: dict, top_n: int = 5) -> dict:
    row = pd.DataFrame(
        [features],
        columns=NUMERIC_FEATURES + CATEGORICAL_FEATURES
    )

    row_transformed = _pipeline.transform(row)

    shap_values = _explainer.shap_values(row_transformed)[0]

    feature_names = _feature_names_after_encoding()

    contributions = pd.Series(
        shap_values,
        index=feature_names
    ).sort_values(
        key=abs,
        ascending=False
    )

    return contributions.head(top_n).to_dict()
