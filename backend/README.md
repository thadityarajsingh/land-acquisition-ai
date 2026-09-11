# Backend — SIH26017

FastAPI backend for the Predictive Analytics System for Early Detection of Land Acquisition Delays.

## Responsibilities
- Project listing and project detail APIs
- ML risk prediction
- SHAP-based explainability
- What-If scenario simulation
- Rule-based recommendations

## Run
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Swagger: `http://localhost:8000/docs`

The ML model consumes the 17 supported prediction features. Dataset-only fields such as `project_id`, `delay_days`, and future GIS coordinates are not sent to the classifier.
