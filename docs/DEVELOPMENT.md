# Development Guide

## Prerequisites

### Frontend

- Node.js 18+
- npm 9+

### Backend

- Python 3.11 recommended
- pip

The backend dependencies are listed in `backend/requirements.txt`.

## Clone and use `main`

```bash
git clone https://github.com/thadityarajsingh/land-acquisition-ai.git
cd land-acquisition-ai
git checkout main
git pull origin main
```

## Frontend setup

```bash
npm install
npm run dev
```

Vite normally serves the app at `http://localhost:5173`.

For local backend integration, create `.env` in the repository root:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Vite reads `VITE_*` variables at build time. Do not commit secrets in `.env` files.

## Backend setup

From the repository root:

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

Start FastAPI **from the repository root**:

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Starting `uvicorn main:app` from inside `backend/` is not the recommended command because `backend/main.py` imports the package as `backend.*`.

## Verify the backend

```bash
curl http://localhost:8000/health
```

Expected:

```json
{"status":"healthy"}
```

API documentation:

```text
http://localhost:8000/docs
```

## Build the frontend

```bash
npm run build
```

The production output is written to `dist/`.

## Useful checks

```bash
npm run dev
npm run build
```

For API debugging, inspect the browser Network tab and the FastAPI terminal logs. A `404` generally means the frontend reached the server but requested a route that is not registered; a CORS error means the browser blocked a cross-origin request.

## Project conventions

- Keep API calls in `src/api/`.
- Keep asynchronous API state in hooks under `src/hooks/`.
- Keep ML inference in backend services.
- Use the existing model feature names exactly; changing names requires coordinated frontend/backend/model updates.
- Update `docs/API.md` whenever an endpoint contract changes.
- Update `docs/DEPLOYMENT.md` whenever deployment settings or service URLs change.

## Dataset and model files

The prototype dataset is under `ml/`. The backend loads the persisted model and preprocessing artifacts through `backend/services/model_service.py`.

Do not replace model artifacts casually: the preprocessing pipeline must match the trained model.

## Local troubleshooting

### Frontend says backend connection is required

1. Check that FastAPI is running on port 8000.
2. Open `/health` directly.
3. Check `VITE_API_URL`.
4. Restart Vite after changing `.env`.

### `ModuleNotFoundError: No module named 'backend'`

Run FastAPI from the repository root:

```bash
cd ~/land-acquisition-ai
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Project detail returns 404

The requested ID must exist in the dataset. The UI uses backend project IDs such as the records returned by `GET /projects`; do not invent a GIS-only ID and send it to `/projects/{id}`.
