# BhoomiIQ — Land Acquisition Risk Intelligence Platform

> AI-powered land acquisition risk intelligence, explanation, simulation, recommendations, and GIS visualization for infrastructure projects.

BhoomiIQ is a full-stack prototype built around a React/Vite frontend, FastAPI backend, and XGBoost/SHAP machine-learning pipeline. It is designed as a decision-support system: it helps teams identify risk factors, compare scenarios, and prioritize follow-up actions before land-acquisition issues contribute to project delays.

> **Important:** The current ML dataset is synthetic prototype data and the GIS layer contains prototype geometry where official cadastral boundaries are unavailable. Model outputs and recommendations are advisory and must not be treated as legal, administrative, or guaranteed operational decisions.

## Live deployment

- **Frontend:** https://bhoomi-ai-frontend.onrender.com
- **Backend:** https://bhoomi-ai-backend-4zod.onrender.com
- **API health:** https://bhoomi-ai-backend-4zod.onrender.com/health
- **Swagger/OpenAPI:** https://bhoomi-ai-backend-4zod.onrender.com/docs

## Core capabilities

| Capability | What it does |
|---|---|
| Risk prediction | Scores the probability of project delay using the trained model |
| Risk categories | Converts the model score into provisional Low / Medium / High bands |
| SHAP explanation | Shows the strongest model contributions for an individual prediction |
| What-If simulation | Compares baseline and scenario feature sets using the same model |
| Project intelligence | Loads and scores project records from the prototype dataset |
| Recommendations | Generates rule-based advisory actions from recorded risk factors |
| GIS map | Displays project locations, clustered markers, risk styling, and prototype parcel geometry |
| Search | Filters GIS/project views by project ID, district, state, or project type |
| Authentication UI | Provides the current client-side login/session experience |

## Architecture

```text
                         GitHub main
                              |
                 +------------+------------+
                 |                         |
                 v                         v
        Render Static Site          Render Web Service
        React + Vite                FastAPI + ML
                 |                         |
                 | HTTPS / Axios           +--> Project CSV
                 +------------------------> +--> preprocessing pipeline
                                           +--> XGBoost model
                                           +--> SHAP explainer
```

The frontend coordinates project selection, prediction, What-If state, recommendations, and GIS state. The backend owns model inference and API contracts. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Repository structure

```text
land-acquisition-ai/
├── backend/
│   ├── main.py                 # FastAPI application and CORS
│   ├── routes/                 # API route modules
│   ├── services/               # Model, prediction, and explanation services
│   ├── models/                 # Runtime model artifacts
│   └── requirements.txt        # Backend dependencies
├── ml/
│   ├── preprocess.py           # Cleaning and preprocessing pipeline
│   ├── train.py                # Model training
│   ├── evaluate.py             # Evaluation metrics
│   ├── predict.py              # ML prediction utilities
│   ├── model/                  # Training artifacts/output
│   └── sih26017_synthetic_land_acquisition_dataset.csv
├── public/                     # Frontend public assets, including GIS demo data
├── src/
│   ├── api/                    # Axios API wrappers
│   ├── hooks/                  # Async React state hooks
│   ├── components/             # UI, dashboard, authentication, and GIS
│   ├── lib/                    # Shared frontend utilities
│   ├── App.jsx                 # Application orchestration
│   └── main.jsx                # React entry point
├── tests/                      # Test resources
├── docs/                       # Technical documentation
├── package.json                # Frontend dependencies/scripts
└── vite.config.js              # Vite configuration
```

## Quick start

### Prerequisites

- Node.js 18+
- npm 9+
- Python 3.11 recommended for the backend

### 1. Clone the repository

```bash
git clone https://github.com/thadityarajsingh/land-acquisition-ai.git
cd land-acquisition-ai
git checkout main
git pull origin main
```

### 2. Start the backend

From the **repository root**:

```bash
python -m venv .venv
```

Windows Git Bash:

```bash
source .venv/Scripts/activate
```

Install dependencies:

```bash
pip install -r backend/requirements.txt
```

Run FastAPI:

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Verify:

```bash
curl http://localhost:8000/health
```

Expected:

```json
{"status":"healthy"}
```

### 3. Start the frontend

In another terminal:

```bash
npm install
npm run dev
```

Vite normally serves the application at:

```text
http://localhost:5173
```

For local API integration, create `.env` in the repository root:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Restart Vite after changing environment variables.

## Frontend configuration

`src/api/client.js` uses this precedence:

1. `VITE_API_URL`, when configured.
2. `http://127.0.0.1:8000` when the browser is running on localhost.
3. The deployed BhoomiIQ Render backend for non-local builds.

Never put secrets in `VITE_*` variables because they are exposed to the browser bundle.

## Backend API

The FastAPI service exposes:

```text
GET  /
GET  /health
GET  /projects
GET  /projects/{project_id}
POST /predict
POST /predict/explain
POST /what-if
GET  /recommendations/{project_id}
POST /recommendations
```

The complete contract, fields, response examples, and error behavior are documented in [`docs/API.md`](docs/API.md).

## Machine learning

The current pipeline:

1. Removes duplicate records and rows without a target.
2. Excludes target/leakage fields from model inputs.
3. Median-imputes and scales numeric features.
4. Most-frequent-imputes and one-hot encodes categorical features.
5. Trains a RandomForest baseline and an XGBoost classifier.
6. Selects XGBoost for the current prototype.
7. Persists the model and preprocessing pipeline for backend inference.
8. Uses SHAP TreeExplainer for per-prediction model explanations.

Current held-out evaluation is documented in [`ml/MODEL_EVALUATION.md`](ml/MODEL_EVALUATION.md) and summarized in [`docs/ML.md`](docs/ML.md).

## GIS

The GIS view uses Leaflet, OpenStreetMap tiles, and MarkerCluster. It loads the frontend GIS demo dataset, matches records to backend projects, displays project markers, and applies the selected risk/What-If state to the map.

Where official cadastral geometry is unavailable, prototype polygons and state-level reference coordinates may be used for visualization. See [`docs/GIS.md`](docs/GIS.md) before using or extending the GIS layer.

## Deployment

The production prototype uses two Render services from `main`:

### Backend

```text
Service: Web Service
Root Directory: .
Build: pip install -r backend/requirements.txt
Start: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
Health: /health
```

### Frontend

```text
Service: Static Site
Root Directory: .
Build: npm install && npm run build
Publish Directory: dist
Environment:
VITE_API_URL=https://bhoomi-ai-backend-4zod.onrender.com
```

Full deployment and troubleshooting instructions are in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Scripts

```bash
npm run dev       # Vite development server
npm run build     # Production build in dist/
npm run preview   # Preview production build
```

## Testing

Use [`docs/TESTING.md`](docs/TESTING.md) for the complete smoke-test and production verification checklist.

Minimum checks:

```bash
npm run build
curl http://localhost:8000/health
curl http://localhost:8000/projects
```

## Documentation

- [`docs/README.md`](docs/README.md) — documentation index
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system architecture and data flow
- [`docs/API.md`](docs/API.md) — API reference
- [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) — local development
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — Render deployment
- [`docs/ML.md`](docs/ML.md) — machine learning documentation
- [`docs/GIS.md`](docs/GIS.md) — GIS implementation and limitations
- [`docs/TESTING.md`](docs/TESTING.md) — testing and verification
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution workflow
- [`SECURITY.md`](SECURITY.md) — security policy
- [`ml/BACKEND_HANDOFF.md`](ml/BACKEND_HANDOFF.md) — ML/backend handoff
- [`ml/MODEL_EVALUATION.md`](ml/MODEL_EVALUATION.md) — model evaluation

## Team

| Area | Responsibility |
|---|---|
| ML | Risk prediction and model evaluation |
| Backend | FastAPI API and model integration |
| Frontend | React dashboard, What-If workflow, UI |
| Data | Dataset preparation and validation |
| GIS | Geographic visualization and geospatial integration |
| Documentation | Technical documentation and presentation |

## Status

**Prototype / SIH project:** deployed full-stack prototype with live frontend and backend services.

The system should undergo additional data validation, model calibration, security/privacy review, authoritative GIS integration, and operational testing before real-world government deployment.
