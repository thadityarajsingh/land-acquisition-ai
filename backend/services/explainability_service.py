import pandas as pd
import shap

from ml.preprocess import NUMERIC_FEATURES, CATEGORICAL_FEATURES
from backend.services.model_service import model as _model, pipeline as _pipeline


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


_explainer = shap.TreeExplainer(_model)


def explain_single_prediction(features: dict, top_n: int = 5) -> dict:
    feature_columns = NUMERIC_FEATURES + CATEGORICAL_FEATURES
    row = pd.DataFrame(
        [{column: features.get(column) for column in feature_columns}],
        columns=feature_columns,
    )

    row_transformed = _pipeline.transform(row)
    shap_values = _explainer.shap_values(row_transformed)[0]
    feature_names = _feature_names_after_encoding()

    contributions = pd.Series(
        shap_values,
        index=feature_names,
    ).sort_values(
        key=abs,
        ascending=False,
    )

    return contributions.head(top_n).to_dict()
