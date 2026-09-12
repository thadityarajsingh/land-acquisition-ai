# Deployment Guide — Render

BhoomiIQ is deployed as two Render services from the `main` branch: a FastAPI web service and a Vite static site.

## Production services

| Service | Purpose | URL |
|---|---|---|
| `bhoomi-ai-backend` | FastAPI + ML API | `https://bhoomi-ai-backend-4zod.onrender.com` |
| `bhoomi-ai-frontend` | React/Vite static site | `https://bhoomi-ai-frontend.onrender.com` |

## Backend service

Render service type: **Web Service**

```text
Repository: thadityarajsingh/land-acquisition-ai
Branch: main
Root Directory: .
Runtime: Python
Build Command: pip install -r backend/requirements.txt
Start Command: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
Health Check Path: /health
```

The repository root is intentionally used as the service root because `backend/main.py` imports modules with the `backend.*` package path.

Recommended environment setting:

```text
PYTHON_VERSION=3.11.11
```

## Frontend service

Render service type: **Static Site**

```text
Repository: thadityarajsingh/land-acquisition-ai
Branch: main
Root Directory: .
Build Command: npm install && npm run build
Publish Directory: dist
```

Set the environment variable before the build:

```text
VITE_API_URL=https://bhoomi-ai-backend-4zod.onrender.com
```

Vite embeds `VITE_*` values during the production build, so changing this variable requires a new frontend deployment/build.

## Deployment sequence

1. Push/merge the intended code to `main`.
2. Deploy the backend.
3. Confirm `GET /health` returns `{"status":"healthy"}`.
4. Confirm `/docs` loads.
5. Deploy the frontend.
6. Confirm the frontend is built with the correct `VITE_API_URL`.
7. Hard refresh the browser after deployment.
8. Test project loading, prediction, SHAP explanation, What-If simulation, recommendations, and GIS.

## Production CORS

`backend/main.py` explicitly allows:

- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `https://bhoomi-ai-frontend.onrender.com`

If the frontend domain changes, update the CORS list and redeploy the backend.

## Deployment verification

Backend:

```text
https://bhoomi-ai-backend-4zod.onrender.com/
https://bhoomi-ai-backend-4zod.onrender.com/health
https://bhoomi-ai-backend-4zod.onrender.com/docs
```

Frontend:

```text
https://bhoomi-ai-frontend.onrender.com
```

## Common Render failures

### `requirements.txt` not found

Use:

```bash
pip install -r backend/requirements.txt
```

Do not use `pip install -r requirements.txt` from the repository root.

### `No module named 'backend'`

Use the repository root as the Root Directory and:

```bash
uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

### Frontend still calls localhost

Check the frontend Render environment variable and rebuild with:

```text
VITE_API_URL=https://bhoomi-ai-backend-4zod.onrender.com
```

### CORS error

Confirm the browser origin is present in `allow_origins` in `backend/main.py` and redeploy the backend.

## Operational notes

The prototype depends on the persisted ML artifacts being present in the deployed repository. The model and preprocessing pipeline must remain compatible with the Python/scikit-learn/XGBoost environment.

The ML service is decision support, not an autonomous legal or administrative decision engine. Synthetic data and prototype GIS geometry must be replaced or validated before real-world government use.
