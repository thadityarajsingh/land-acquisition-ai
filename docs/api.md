# API Documentation

## 1. Overview

The Land Acquisition AI backend is implemented using FastAPI.

The API provides endpoints for:

- Delay risk prediction
- Prediction explainability
- What-If scenario comparison
- Project data retrieval
- Rule-based recommendations
- API health checking

The API acts as the connection between the application interface, machine learning prediction pipeline, project dataset, and decision-support features.

---

## 2. Base API Information

The application provides the following basic endpoints.

### Root Endpoint

**Method:** `GET`

**Endpoint:**

```text
/
```

**Response:**

```json
{
  "message": "Land Acquisition AI API is running"
}
```

### Health Check

**Method:** `GET`

**Endpoint:**

```text
/health
```

**Response:**

```json
{
  "status": "healthy"
}
```

---

# 3. Prediction API

## Predict Delay Risk

**Method:** `POST`

**Endpoint:**

```text
/predict
```

This endpoint receives land acquisition project information and returns the predicted delay risk.

### Request Fields

#### Numerical Fields

- `land_area_acres` — float
- `affected_families` — integer
- `approval_delay_days` — integer
- `legal_disputes` — integer
- `rehab_progress_pct` — float
- `stakeholder_responsiveness_pct` — float
- `historical_performance_score` — float
- `departments_involved` — integer
- `historical_delay_count` — integer

#### Categorical Fields

- `state` — string
- `district` — string
- `project_type` — string
- `compensation_status` — string
- `possession_status` — string
- `documentation_status` — string
- `notification_status` — string
- `acquisition_stage` — string

### Example Request

```json
{
  "land_area_acres": 12.5,
  "affected_families": 40,
  "approval_delay_days": 30,
  "legal_disputes": 1,
  "rehab_progress_pct": 55.0,
  "stakeholder_responsiveness_pct": 60.0,
  "historical_performance_score": 0.7,
  "departments_involved": 3,
  "historical_delay_count": 2,
  "state": "Maharashtra",
  "district": "Pune",
  "project_type": "Highway",
  "compensation_status": "Partially Paid",
  "possession_status": "Partial",
  "documentation_status": "Incomplete",
  "notification_status": "Pending",
  "acquisition_stage": "Compensation"
}
```

### Response

The endpoint returns:

- `risk_score`
- `risk_category`
- `predicted_delayed`

Example:

```json
{
  "risk_score": 0.2052,
  "risk_category": "Low",
  "predicted_delayed": false
}
```

### Risk Categories

The backend assigns risk categories as follows:

```text
Risk Score < 0.33              → Low
0.33 ≤ Risk Score < 0.66       → Medium
Risk Score ≥ 0.66              → High
```

The `predicted_delayed` value is produced by the trained classification model.

---

# 4. Prediction Explainability API

## Explain Prediction

**Method:** `POST`

**Endpoint:**

```text
/predict/explain
```

This endpoint receives the same project information as `/predict`.

It uses SHAP-based explainability to identify the most influential features for a prediction.

### Response

The response contains:

```text
top_factors
```

The explainability service returns the top 5 features with the largest absolute SHAP contributions.

Example structure:

```json
{
  "top_factors": {
    "approval_delay_days": 0.24,
    "legal_disputes": 0.18,
    "rehab_progress_pct": -0.12
  }
}
```

The exact factors and values depend on the project input.

---

# 5. What-If API

## Compare Project Scenarios

**Method:** `POST`

**Endpoint:**

```text
/what-if
```

The What-If API compares two project scenarios:

- Baseline scenario
- Modified scenario

Both scenarios are passed through the same prediction service.

### Request Structure

```json
{
  "baseline": {
    "project_feature": "baseline_value"
  },
  "scenario": {
    "project_feature": "modified_value"
  }
}
```

In actual use, both `baseline` and `scenario` should contain the project features required by the prediction service.

### Response

The API returns:

- `baseline`
- `scenario`
- `risk_score_change`

Example structure:

```json
{
  "baseline": {
    "risk_score": 0.20,
    "risk_category": "Low",
    "predicted_delayed": false
  },
  "scenario": {
    "risk_score": 0.72,
    "risk_category": "High",
    "predicted_delayed": true
  },
  "risk_score_change": 0.52
}
```

The `risk_score_change` is calculated as:

```text
scenario risk score - baseline risk score
```

---

# 6. Projects API

The Projects API provides access to project records from the current prototype dataset.

The backend currently loads project data from:

```text
ml/sih26017_synthetic_land_acquisition_dataset.csv
```

## Get All Projects

**Method:** `GET`

**Endpoint:**

```text
/projects
```

### Response

The endpoint returns:

- `count`
- `projects`

Example structure:

```json
{
  "count": 1200,
  "projects": [
    {
      "project_id": "example_project_id"
    }
  ]
}
```

The actual project records contain the fields available in the prototype dataset.

---

## Get Project by ID

**Method:** `GET`

**Endpoint:**

```text
/projects/{project_id}
```

This endpoint returns a single project matching the provided project ID.

### Successful Response

The API returns the project record as a JSON object.

### Error Response

If the project ID is not found:

```text
HTTP 404
```

Response:

```json
{
  "detail": "Project not found"
}
```

---

# 7. Recommendations API

## Generate Recommendations

**Method:** `POST`

**Endpoint:**

```text
/recommendations
```

The recommendations API uses rule-based conditions to generate project improvement suggestions.

### Request Fields

- `compensation_status`
- `approval_delay_days`
- `legal_disputes`
- `rehab_progress_pct`
- `stakeholder_responsiveness_pct`
- `documentation_status`
- `notification_status`
- `possession_status`

### Recommendation Logic

Recommendations can be generated based on conditions such as:

- Compensation is not fully paid
- Approval delay is greater than 30 days
- Legal disputes are present
- Rehabilitation progress is below 60%
- Stakeholder responsiveness is below 60%
- Documentation is incomplete
- Notifications are not completed
- Possession issues remain

### Response

The API returns:

```json
{
  "recommendations": [
    "Recommendation message"
  ],
  "count": 1
}
```

If no major intervention is identified, the system returns:

```text
No major intervention required. Continue monitoring the project.
```

---

# 8. Input Validation

The request schemas for prediction, What-If, and recommendations are defined using Pydantic models.

Required fields must be provided according to the expected request structure and data types.

FastAPI handles request parsing and validation based on these schemas.

---

# 9. API Workflow

The main prediction workflow is:

```text
Frontend / Client
        |
        v
POST /predict
        |
        v
Pydantic Request Validation
        |
        v
Prediction Service
        |
        v
Preprocessing Pipeline
        |
        v
XGBoost Classification Model
        |
        v
Risk Score + Risk Category + Predicted Delay
        |
        v
JSON Response
```

The explainability workflow is:

```text
Project Input
        |
        v
POST /predict/explain
        |
        v
Preprocessing Pipeline
        |
        v
SHAP TreeExplainer
        |
        v
Top 5 Feature Contributions
        |
        v
JSON Response
```

The What-If workflow is:

```text
Baseline Scenario + Modified Scenario
        |
        v
POST /what-if
        |
        +------------------+
        |                  |
        v                  v
Baseline Prediction   Scenario Prediction
        |                  |
        +--------+---------+
                 |
                 v
          Risk Score Change
```

---

# 10. Current Prototype Scope

The current API is designed for the Land Acquisition AI prototype.

The project data currently used by the Projects API is based on a synthetic prototype dataset.

For production deployment, additional features such as authentication, authorization, persistent database storage, monitoring, logging, and stronger security controls would be required.