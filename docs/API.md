# API Reference

Base URL (deployed): `https://bhoomi-ai-backend-4zod.onrender.com`

Interactive OpenAPI documentation is available at `/docs` and the OpenAPI schema at `/openapi.json`.

## Health

### `GET /`

Returns a basic service message.

Example response:

```json
{"message":"Land Acquisition AI API is running"}
```

### `GET /health`

Used by deployment and uptime checks.

```json
{"status":"healthy"}
```

## Projects

### `GET /projects`

Loads the project dataset and enriches each record with the ML risk score, category, and predicted delay flag.

Response shape:

```json
{
  "count": 1200,
  "projects": [
    {
      "project_id": "LA-0001",
      "state": "Uttar Pradesh",
      "district": "...",
      "project_type": "...",
      "risk_score": 0.61,
      "risk_category": "Medium",
      "predicted_delayed": false
    }
  ]
}
```

The exact project fields are defined by `ml/sih26017_synthetic_land_acquisition_dataset.csv` and the feature list in `backend/routes/projects.py`.

### `GET /projects/{project_id}`

Returns one project by its `project_id`.

Example:

```text
GET /projects/LA-0001
```

Returns `404` when the project ID is not present in the dataset.

## Prediction

### `POST /predict`

Runs the trained model on one project feature record.

### Request fields

Numeric:

- `land_area_acres`
- `affected_families`
- `approval_delay_days`
- `legal_disputes`
- `rehab_progress_pct`
- `stakeholder_responsiveness_pct`
- `historical_performance_score`
- `departments_involved`
- `historical_delay_count`

Categorical:

- `state`
- `district`
- `project_type`
- `compensation_status`
- `possession_status`
- `documentation_status`
- `notification_status`
- `acquisition_stage`

Fields may be omitted at the HTTP/Pydantic layer and are passed through the fitted preprocessing pipeline.

Example:

```json
{
  "land_area_acres": 120.5,
  "affected_families": 80,
  "approval_delay_days": 35,
  "legal_disputes": 2,
  "rehab_progress_pct": 55,
  "stakeholder_responsiveness_pct": 62,
  "historical_performance_score": 70,
  "departments_involved": 4,
  "historical_delay_count": 3,
  "state": "Uttar Pradesh",
  "district": "Agra",
  "project_type": "Highway",
  "compensation_status": "Pending",
  "possession_status": "Partial",
  "documentation_status": "Incomplete",
  "notification_status": "Pending",
  "acquisition_stage": "Award"
}
```

Response:

```json
{
  "risk_score": 0.61,
  "risk_category": "Medium",
  "predicted_delayed": false
}
```

`risk_score` is the model probability for the delayed class. The UI converts it to a 0–100 display score.

### `POST /predict/explain`

Returns the top SHAP contributions for the supplied prediction input.

```json
{
  "top_factors": {
    "approval_delay_days": 0.42,
    "legal_disputes": 0.19
  }
}
```

SHAP contributions are model explanations, not causal effects.

## What-If simulation

### `POST /what-if`

Compares two model evaluations: a baseline feature dictionary and a scenario feature dictionary.

Request:

```json
{
  "baseline": {
    "land_area_acres": 120,
    "affected_families": 80,
    "approval_delay_days": 35,
    "legal_disputes": 2,
    "rehab_progress_pct": 55,
    "stakeholder_responsiveness_pct": 62,
    "historical_performance_score": 70,
    "departments_involved": 4,
    "historical_delay_count": 3,
    "state": "Uttar Pradesh",
    "district": "Agra",
    "project_type": "Highway",
    "compensation_status": "Pending",
    "possession_status": "Partial",
    "documentation_status": "Incomplete",
    "notification_status": "Pending",
    "acquisition_stage": "Award"
  },
  "scenario": {
    "land_area_acres": 120,
    "affected_families": 80,
    "approval_delay_days": 20,
    "legal_disputes": 0,
    "rehab_progress_pct": 80,
    "stakeholder_responsiveness_pct": 85,
    "historical_performance_score": 70,
    "departments_involved": 4,
    "historical_delay_count": 3,
    "state": "Uttar Pradesh",
    "district": "Agra",
    "project_type": "Highway",
    "compensation_status": "Fully Paid",
    "possession_status": "Complete",
    "documentation_status": "Complete",
    "notification_status": "Completed",
    "acquisition_stage": "Award"
  }
}
```

The response includes baseline/scenario model results, score change, and a model-estimated delay comparison. The delay estimate is a prototype calculation derived from the model score and must not be presented as a guaranteed number of days saved.

## Recommendations

### `GET /recommendations/{project_id}`

Generates advisory, rule-based recommendations from the selected project's recorded risk factors.

Rules currently include triggers for:

- compensation not fully paid
- one or more legal disputes
- approval delay over 30 days
- rehabilitation progress below 60%
- stakeholder responsiveness below 60%
- incomplete documentation
- incomplete/pending notification
- incomplete/partial possession

### `POST /recommendations`

Accepts the following fields:

```text
compensation_status
approval_delay_days
legal_disputes
rehab_progress_pct
stakeholder_responsiveness_pct
documentation_status
notification_status
possession_status
```

Response:

```json
{
  "recommendations": [],
  "count": 0,
  "engine": "rule-based risk-factor recommendations",
  "advisory": true
}
```

Recommendations are advisory and should be reviewed by authorized project personnel.

## Errors

- `404` — requested project does not exist.
- `422` — request body failed Pydantic validation.
- `500` — unexpected backend/model/runtime error.

## CORS

The backend allows the local Vite origins and the deployed BhoomiIQ frontend origin. If the frontend domain changes, update the CORS allow-list in `backend/main.py` and redeploy.
