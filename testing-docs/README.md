# Testing & Documentation — SIH26017

Testing and documentation workstream.

## Minimum integration checks
- FastAPI starts and `/docs` loads.
- `GET /projects` returns project records.
- `GET /projects/{id}` returns one project.
- `POST /predict` returns `risk_score`, `risk_category`, and `predicted_delayed`.
- `/predict/explain` returns model drivers.
- `/what-if` returns baseline and scenario scores.
- `/recommendations/{project_id}` returns recommendations.
- Frontend builds successfully and can reach the backend.
- GIS loads without treating synthetic coordinates as official cadastral data.

Record model metrics honestly and distinguish synthetic prototype data from official government data.
