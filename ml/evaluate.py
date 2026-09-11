"""
evaluate.py
Honest metric reporting — no fabricated numbers. Used by train.py during
training and can be re-run standalone against saved artifacts.
"""

from sklearn.metrics import (
    accuracy_score, precision_recall_fscore_support,
    classification_report, confusion_matrix,
)


def evaluate_model(model, X_test, y_test) -> dict:
    y_pred = model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(
        y_test, y_pred, average="weighted", zero_division=0
    )

    print(f"Accuracy:  {acc:.3f}")
    print(f"Precision: {precision:.3f}")
    print(f"Recall:    {recall:.3f}")
    print(f"F1:        {f1:.3f}")
    print("\nClassification report:\n", classification_report(y_test, y_pred, zero_division=0))
    print("Confusion matrix:\n", confusion_matrix(y_test, y_pred))

    return {"accuracy": acc, "precision": precision, "recall": recall, "f1": f1}


if __name__ == "__main__":
    import sys
    import joblib
    from preprocess import load_raw_data, clean_data, TARGET_COLUMN, NUMERIC_FEATURES, CATEGORICAL_FEATURES
    from sklearn.model_selection import train_test_split

    data_path = sys.argv[1] if len(sys.argv) > 1 else "data/sih_dataset.csv"
    df = clean_data(load_raw_data(data_path))
    X = df[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
    y = df[TARGET_COLUMN]
    _, X_test, _, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    pipeline = joblib.load("model/pipeline.joblib")
    model = joblib.load("model/model.joblib")
    evaluate_model(model, pipeline.transform(X_test), y_test)
