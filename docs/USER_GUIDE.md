# User Guide

## 1. Sign in

Open the BhoomiIQ frontend and use the login screen provided by the application. The current authentication flow is a client-side prototype and stores the active session in browser local storage.

## 2. Select a project

After sign-in, choose a project from the project selector. The frontend requests project details from FastAPI and uses the returned project ID as the source of truth for subsequent prediction and recommendation calls.

## 3. Read the risk score

The dashboard presents the model risk score and risk category. A higher score indicates a higher model-estimated likelihood of the delayed class.

Risk categories are provisional:

- Low: below 33
- Medium: 33 to below 66
- High: 66 and above

The score is for prioritization and exploration, not a guaranteed forecast.

## 4. Understand risk drivers

Use the explainability view to inspect the strongest SHAP contributions. These describe how features influenced the model output for that particular input.

A SHAP contribution is not a legal finding or a causal statement.

## 5. Run a What-If scenario

Change the scenario controls in the What-If panel and run the simulation. BhoomiIQ compares:

```text
Baseline project features
          |
          v
       ML model
          |
     baseline risk

Scenario project features
          |
          v
       ML model
          |
     scenario risk
```

The comparison shows the model-estimated score change and prototype delay estimate.

## 6. Use the GIS view

The GIS view provides geographic context for project risk. Click a marker to select a project. The selected project is shared with the dashboard.

If a project has a simulated What-If risk, the selected map visualization can reflect the simulated score.

Remember that prototype coordinates or generated parcel polygons are not official cadastral survey data.

## 7. Review recommendations

Recommendations are generated from configured risk-factor rules such as pending compensation, legal disputes, approval delays, low rehabilitation progress, low stakeholder responsiveness, incomplete documentation, notification gaps, and possession gaps.

Recommendations are advisory. Authorized personnel must review them against current records and applicable law.

## 8. Search

Use the search control to narrow geographic/project records by identifiers or location fields such as project ID, district, state, or project type.

## 9. Production use

For the deployed application, verify the backend health and API before reporting a system outage:

```text
https://bhoomi-ai-backend-4zod.onrender.com/health
```

If the frontend reports a backend connection problem, check the browser Network tab and confirm requests are going to the Render API rather than `localhost`.
