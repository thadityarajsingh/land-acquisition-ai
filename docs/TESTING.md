# Testing and Verification

## Local smoke test

### Frontend

```bash
npm install
npm run build
```

The command should finish successfully and create `dist/`.

### Backend

From the repository root:

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Verify:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/projects
```

Expected health response:

```json
{"status":"healthy"}
```

## API verification

Use the Swagger UI at `/docs` or test these routes:

- `GET /`
- `GET /health`
- `GET /projects`
- `GET /projects/{known-project-id}`
- `POST /predict`
- `POST /predict/explain`
- `POST /what-if`
- `GET /recommendations/{known-project-id}`
- `POST /recommendations`

## Frontend integration checklist

- [ ] Login screen opens.
- [ ] Project list loads from FastAPI.
- [ ] Selecting a project loads project details.
- [ ] Risk score appears.
- [ ] Risk drivers/SHAP explanation appears when requested.
- [ ] What-If scenario can be run and reset.
- [ ] GIS project markers load.
- [ ] Selected project changes on GIS marker click.
- [ ] What-If risk is reflected in the selected GIS visualization.
- [ ] Recommendations load for a known project.
- [ ] Browser console has no blocking errors.
- [ ] Network requests point to the configured API host, not localhost in production.

## Production smoke test

### Backend

1. Open the production root URL.
2. Open `/health` and confirm `healthy`.
3. Open `/docs`.
4. Call `/projects`.
5. Call a known `/projects/{id}`.
6. Run a representative `/predict` request.

### Frontend

1. Open the production frontend.
2. Hard refresh with `Ctrl+Shift+R`.
3. Log in.
4. Confirm projects appear.
5. Select a project.
6. Verify prediction and recommendations.
7. Run What-If.
8. Verify the map responds to project selection and simulated risk.

## Regression checks

When changing API payloads or feature names, run the prediction and What-If checks because both depend on the same model feature schema.

When changing project IDs or GIS data, verify that the selected backend project ID still resolves through `/projects/{id}` and that GIS matching does not select a different project.

When changing CORS or deployment domains, verify the browser can make a cross-origin request to `/health` and `/projects`.

## Error interpretation

| Symptom | Likely cause |
|---|---|
| `404` on a known endpoint | Wrong route or URL path |
| `404` for a project | Project ID is absent from the dataset |
| Browser CORS error | Frontend origin is not in backend CORS allow-list |
| Network error to `localhost` in production | Frontend was built with an incorrect API URL |
| Model load failure | Missing/incompatible joblib artifacts |
| `422` | Request payload does not match the Pydantic schema |
| Empty projects list | Dataset missing/empty or backend data load issue |
