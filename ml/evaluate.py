"""
evaluate.py
Honest metric reporting for SIH26017.
Reports both overall metrics and delayed-class (is_delayed=1) metrics so
class imbalance cannot hide poor recall.
"""

from sklearn.metrics import (
    accuracy_score,
    average_precision_score,
    classification_report,
    confusion_matrix,
    precision_recall_fscore_support,
    roc_auc_score,
)


def evaluate_model(model, X_test, y_test) -> dict:
    y_pred = model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    weighted_precision, weighted_recall, weighted_f1, _ = precision_recall_fscore_support(
        y_test, y_pred, average="weighted", zero_division=0
    )
    delayed_precision, delayed_recall, delayed_f1, delayed_support = precision_recall_fscore_support(
        y_test, y_pred, average="binary", pos_label=1, zero_division=0
    )

    metrics = {
        "accuracy": float(acc),
        "weighted_precision": float(weighted_precision),
        "weighted_recall": float(weighted_recall),
        "weighted_f1": float(weighted_f1),
        "delayed_precision": float(delayed_precision),
        "delayed_recall": float(delayed_recall),
        "delayed_f1": float(delayed_f1),
        "delayed_support": int(delayed_support),
    }

    if hasattr(model, "predict_proba"):
        y_prob = model.predict_proba(X_test)[:, 1]
        metrics["roc_auc"] = float(roc_auc_score(y_test, y_prob))
        metrics["average_precision"] = float(average_precision_score(y_test, y_prob))

    print(f"Accuracy:             {acc:.3f}")
    print(f"Weighted precision:   {weighted_precision:.3f}")
    print(f"Weighted recall:      {weighted_recall:.3f}")
    print(f"Weighted F1:          {weighted_f1:.3f}")
    print(f"Delayed precision:    {delayed_precision:.3f}")
    print(f"Delayed recall:       {delayed_recall:.3f}")
    print(f"Delayed F1:           {delayed_f1:.3f}")
    print(f"Delayed support:      {delayed_support}")
    if "roc_auc" in metrics:
        print(f"ROC AUC:              {metrics['roc_auc']:.3f}")
        print(f"Average precision:    {metrics['average_precision']:.3f}")

    print("\nClassification report:\n", classification_report(y_test, y_pred, zero_division=0))
    print("Confusion matrix:\n", confusion_matrix(y_test, y_pred))

    return metrics


if __name__ == "__main__":
    import sys
    import joblib
    from preprocess import load_raw_data, clean_data, TARGET_COLUMN, NUMERIC_FEATURES, CATEGORICAL_FEATURES
    from sklearn.model_selection import train_test_split

    data_path = sys.argv[1] if len(sys.argv) > 1 else "sih26017_synthetic_land_acquisition_dataset.csv"
    df = clean_data(load_raw_data(data_path))
    X = df[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
    y = df[TARGET_COLUMN]
    _, X_test, _, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    pipeline = joblib.load("model/pipeline.joblib")
    model = joblib.load("model/model.joblib")
    evaluate_model(model, pipeline.transform(X_test), y_test)
