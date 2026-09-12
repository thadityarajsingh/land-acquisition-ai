from pathlib import Path
import joblib

ROOT_DIR = Path(__file__).resolve().parents[2]

# Use the single canonical model artifacts produced by the ML training pipeline.
MODEL_PATH = ROOT_DIR / "ml" / "model" / "model.joblib"
PIPELINE_PATH = ROOT_DIR / "ml" / "model" / "pipeline.joblib"

model = joblib.load(MODEL_PATH)
pipeline = joblib.load(PIPELINE_PATH)
