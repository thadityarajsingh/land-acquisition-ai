# Architecture

## Overview

BhoomiIQ is a React/Vite single-page application backed by a FastAPI service and a persisted scikit-learn/XGBoost model pipeline.

```text
Browser
  |
  | HTTPS / Axios
  v
React + Vite frontend
  |-- Authentication session (localStorage)
  |-- Project selection
  |-- GIS visualization
  |-- Risk dashboard
  |-- What-If simulation UI
  |-- Recommendations UI
  |
  v
FastAPI backend
  |-- /projects
  |-- /predict
  |-- /predict/explain
  |-- /what-if
  |-- /recommendations
  |
  +--> Dataset CSV
  +--> fitted preprocessing pipeline
  +--> XGBoost model
  +--> SHAP TreeExplainer
```

## Frontend

The application entry point is `src/App.jsx`. It coordinates authentication state, project selection, prediction, What-If simulation, recommendations, and the dashboard/GIS views.

### API layer

`src/api/client.js` owns the Axios instance and selects the API base URL. A configured `VITE_API_URL` takes priority. Local development falls back to `http://127.0.0.1:8000`; deployed builds fall back to the live Render backend.

The API modules are separated by concern:

- `projects.js` — project list and project detail retrieval
- `predict.js` — prediction and SHAP explanation requests
- `whatIf.js` — scenario simulation
- `recommendations.js` — advisory recommendations

### React hooks

The hooks provide asynchronous state around the API modules:

- `useProjects`
- `usePredict`
- `useWhatIf`
- `useRecommendations`

## Backend

`backend/main.py` creates the FastAPI application, configures CORS, exposes `/` and `/health`, and registers the four route modules.

### Services

- `prediction_service.py` prepares model input and returns risk probability/category/delay flag.
- `model_service.py` loads the persisted model and preprocessing pipeline with `joblib`.
- `explainability_service.py` uses SHAP `TreeExplainer` against the trained tree model and the fitted preprocessing pipeline.

## Data flow: prediction

1. User selects a project.
2. Frontend calls `GET /projects/{project_id}`.
3. Backend reads the project record from the CSV dataset.
4. Backend extracts the 17 model features.
5. The fitted preprocessing pipeline imputes missing values, scales numeric fields, and one-hot encodes categorical fields.
6. XGBoost returns the probability of the delayed class and a predicted class.
7. Backend maps probability to provisional Low/Medium/High categories.
8. Frontend displays the score as a 0–100 value.

## Data flow: What-If

1. Frontend builds a baseline feature dictionary from the selected project.
2. User changes scenario controls.
3. Frontend sends `{baseline, scenario}` to `POST /what-if`.
4. Backend evaluates both dictionaries with the same model.
5. Backend calculates the score difference and prototype delay comparison.
6. Frontend updates the comparison and GIS risk visualization.

The scenario result is a model estimate, not a causal forecast or guaranteed project outcome.

## GIS data flow

The GIS component loads `/gis-demo.csv` from the frontend public assets. It matches GIS records to backend projects primarily by state/district and falls back to state/project type matching. Valid latitude/longitude values are used when available; otherwise the component uses state-level fallback centers.

Leaflet and MarkerCluster are loaded dynamically from their public CDN URLs. OpenStreetMap tiles provide the basemap.

Project risk and the selected What-If score are propagated into the GIS layer so the selected project's marker/parcel styling reflects the active risk state.

## Deployment topology

The production prototype uses two Render services from the same `main` branch:

```text
GitHub main
   |
   +--> Render Static Site
   |      -> React/Vite -> dist/
   |
   +--> Render Web Service
          -> FastAPI -> uvicorn
```

The frontend calls the backend over HTTPS. CORS is explicitly configured in the FastAPI application.

## Design principles

- Keep model inference in backend services rather than duplicating ML logic in React.
- Keep API calls isolated from presentation components.
- Use explicit CORS origins rather than a wildcard.
- Treat model output as decision support, not an authoritative legal or administrative decision.
- Clearly label prototype GIS geometry and synthetic data limitations.
