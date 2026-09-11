from pathlib import Path
import joblib

BASE_DIR = Path(__file__).resolve().parents[1]

MODEL_PATH = BASE_DIR / "models" / "model.joblib"
PIPELINE_PATH = BASE_DIR / "models" / "pipeline.joblib"

model = joblib.load(MODEL_PATH)
pipeline = joblib.load(PIPELINE_PATH)
