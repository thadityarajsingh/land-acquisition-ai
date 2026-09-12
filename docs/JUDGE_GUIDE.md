# Judge Guide — BhoomiIQ

This is the fastest path for a reviewer to understand and evaluate the project.

## 1. Start here

**Live application:** https://bhoomi-ai-frontend.onrender.com  
**Backend health:** https://bhoomi-ai-backend-4zod.onrender.com/health  
**API documentation:** https://bhoomi-ai-backend-4zod.onrender.com/docs

If the live application is sleeping or unavailable, run the project locally using the commands in [`DEVELOPMENT.md`](./DEVELOPMENT.md).

## 2. Five-minute judge flow

### Step 1 — Open the dashboard

Open the live frontend and enter the current authentication flow.

### Step 2 — Select a project

Use the project list/search and choose a project such as `LA-0001` for a deterministic demo record from the repository dataset.

### Step 3 — Inspect the risk result

Review the model-derived risk score, provisional Low/Medium/High category, and predicted delay status.

**Judge question answered:** Can the system turn project data into an actionable risk signal?

### Step 4 — Open explainability

Inspect the Risk Drivers / SHAP view for the selected project.

**Judge question answered:** Can a user see why the model produced its result instead of receiving a black-box score only?

### Step 5 — Run What-If

Change one or more scenario inputs and compare the baseline with the simulated result.

**Judge question answered:** Can the system help users reason about possible interventions?

Remember: the simulated result is model-derived and is not a guaranteed operational outcome.

### Step 6 — Open GIS

Use the GIS view to locate project markers, inspect risk styling, and view available prototype parcel geometry.

**Judge question answered:** Can risk be connected to geographic context?

> GIS geometry is explicitly labeled as prototype where official cadastral boundaries are unavailable.

### Step 7 — Review recommendations

Open the recommendation view for the project and inspect the advisory actions generated from the recorded risk conditions.

**Judge question answered:** Does the system turn analysis into a follow-up workflow?

## 3. Technical verification path

A reviewer who wants to inspect the implementation can follow this order:

1. [`../README.md`](../README.md) — project overview and quick start.
2. [`SOLUTION.md`](./SOLUTION.md) — product and technical solution.
3. [`ARCHITECTURE.md`](./ARCHITECTURE.md) — component/data flow.
4. [`API.md`](./API.md) — backend contracts.
5. [`DATA_DICTIONARY.md`](./DATA_DICTIONARY.md) — dataset fields.
6. [`MODEL_CARD.md`](./MODEL_CARD.md) — intended use, evaluation, and limitations.
7. [`../ml/MODEL_EVALUATION.md`](../ml/MODEL_EVALUATION.md) — measured model results.
8. [`GIS.md`](./GIS.md) — geospatial implementation and limitations.
9. [`TESTING.md`](./TESTING.md) — verification checklist.
10. [`DEPLOYMENT.md`](./DEPLOYMENT.md) — production prototype configuration.

## 4. What is implemented

- React/Vite frontend
- FastAPI backend
- XGBoost risk classifier
- Persisted preprocessing/model artifacts
- SHAP explanations
- What-If model comparison
- Rule-based recommendations
- Leaflet/OpenStreetMap GIS visualization
- Project search and selection
- GitHub Actions build/check workflow
- Render deployment configuration documented in-repo

## 5. What should not be over-claimed

This repository intentionally documents its limitations:

- The current ML dataset is synthetic SIH26017 prototype data.
- The current held-out delayed-class recall is 29.41%.
- Risk bands are provisional, not calibrated probabilities.
- GIS coordinates/parcel geometry may be prototype references rather than authoritative cadastral records.
- The platform is advisory and human-in-the-loop.

These limitations are part of the evaluation story: the project demonstrates the architecture and workflow while identifying the data, validation, and governance work required for production.

## 6. API smoke test

```bash
curl https://bhoomi-ai-backend-4zod.onrender.com/health
curl https://bhoomi-ai-backend-4zod.onrender.com/projects
```

Expected health response:

```json
{"status":"healthy"}
```

For interactive endpoint testing, use the deployed Swagger UI at `/docs`.

## 7. Local judge path

```bash
git clone https://github.com/thadityarajsingh/land-acquisition-ai.git
cd land-acquisition-ai
git checkout main

python -m venv .venv
source .venv/Scripts/activate  # Windows Git Bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

In a second terminal:

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## 8. Repository navigation principle

`main` is the intended final/deployable source of truth. A reviewer should not need to inspect historical development branches to understand the submitted system.

See the repository branch-cleanup note in [`../README.md`](../README.md) before the final submission.