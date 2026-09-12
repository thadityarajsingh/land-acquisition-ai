# Solution Overview

## BhoomiIQ

BhoomiIQ is a full-stack land-acquisition risk intelligence prototype. It combines a web dashboard, FastAPI services, an XGBoost classification pipeline, SHAP explanations, What-If simulation, rule-based recommendations, and GIS visualization.

## End-to-end flow

```text
Project / acquisition data
          |
          v
  Cleaning + preprocessing
          |
          v
   XGBoost risk model
          |
     +----+----+
     |         |
     v         v
 Risk score   SHAP drivers
     |
     +-------------------+
     |                   |
     v                   v
What-If simulation    GIS context
     |                   |
     +---------+---------+
               v
       Prioritized actions
        / recommendations
```

## Main modules

### 1. Project intelligence

Project records can be loaded through the backend and surfaced in the dashboard with a model-derived risk score, provisional risk category, and predicted delay flag.

### 2. Risk prediction

The trained preprocessing pipeline prepares numeric and categorical features before the selected XGBoost classifier produces the current prototype risk score.

### 3. Explainability

SHAP TreeExplainer is used to show feature contributions for an individual prediction. This helps the user understand the model signal instead of seeing only a single score.

### 4. What-If simulation

The user can compare a baseline record with a scenario. The backend runs the same prediction pipeline for both inputs and reports the model-score difference and related estimated outputs.

A What-If result is a **model scenario estimate**, not a guaranteed real-world outcome.

### 5. Recommendations

The recommendation layer translates recorded risk conditions into rule-based advisory actions. It is intentionally separate from the ML model so that suggested follow-up logic can be inspected and changed independently.

### 6. GIS

The frontend uses Leaflet and OpenStreetMap tiles to display project locations, clustering, risk styling, and prototype parcel geometry. Where authoritative cadastral boundaries are unavailable, the repository labels the geometry as prototype rather than presenting it as official land records.

## Why this architecture

- **React/Vite:** fast interactive dashboard development.
- **FastAPI:** clear API contracts and simple Python integration with the ML stack.
- **XGBoost:** selected over the RandomForest baseline in the current held-out evaluation because it identified delayed cases while the baseline predicted none at the default threshold.
- **SHAP:** provides per-prediction explanation signals.
- **Leaflet:** lightweight browser GIS visualization.
- **GitHub Actions:** keeps the main development path build-checked.

## Decision-support principle

The product is designed around a human-in-the-loop workflow:

> **Detect → Explain → Simulate → Locate → Prioritize → Act**

The system does not make legal or administrative decisions. It provides evidence and prioritization signals for human review.

## Current limitations

- ML evaluation uses synthetic SIH26017 prototype data.
- Delayed-class recall is currently modest (29.41% on the documented held-out split).
- Risk bands are provisional and are not calibrated probabilities.
- GIS coordinates and parcel geometry may be synthetic/prototype references.
- Real deployment would require authoritative data governance, security/privacy controls, model validation/calibration, and operational testing.