# Demo Walkthrough

Use this sequence for a live presentation or SIH judging session.

## Demo objective

Show one continuous story rather than separate features:

**Project data → Risk → Explanation → What-If → GIS → Recommendation**

## Suggested demo record

Use project `LA-0001` from the repository dataset. It is a stable example record included in the synthetic prototype dataset.

## 1. Project selection

Open the dashboard and select/search for `LA-0001`.

Show:

- project identity;
- state and district;
- project type;
- acquisition context.

## 2. Risk assessment

Show the model-derived risk score and provisional category.

Explain in one sentence:

> “The model gives us a prioritization signal so teams can decide which projects deserve deeper human review.”

## 3. Explainability

Open the SHAP/Risk Drivers section.

Point out that the system exposes feature contributions for the individual prediction.

Explain:

> “This is a model explanation, not proof that a factor caused the delay.”

## 4. What-If scenario

Change a meaningful operational input, then run the scenario.

Compare:

- baseline risk score;
- scenario risk score;
- score delta;
- any displayed estimated delay/category changes.

Explain:

> “The scenario is a model-based comparison using the same inference pipeline; it is not a guaranteed forecast of what will happen in the field.”

## 5. GIS

Open the GIS view.

Show:

- project marker;
- risk styling;
- search/filter behavior;
- clustering where applicable;
- available parcel geometry.

State clearly that prototype geometry is not an official cadastral boundary when authoritative geometry is unavailable.

## 6. Recommendations

Open the project's recommendations.

Explain that this layer converts observed risk conditions into rule-based advisory actions that can be reviewed by the project team.

## 7. Close the story

Finish with:

> “BhoomiIQ is designed to help a human decision-maker detect risk early, understand the model signal, compare possible scenarios, see the geographic context, and prioritize follow-up action.”

## Backup technical demo

If the UI has an issue, open the deployed Swagger UI and demonstrate:

- `GET /health`
- `GET /projects`
- `GET /projects/{project_id}`
- `POST /predict`
- `POST /predict/explain`
- `POST /what-if`
- `GET /recommendations/{project_id}`

See [`API.md`](./API.md) for request and response contracts.