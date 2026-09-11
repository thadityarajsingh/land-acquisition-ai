# ??? BhoomiIQ — Land Acquisition Risk Intelligence Platform

> **Smart India Hackathon 2025** | Team Member 3 — Frontend + What-If Simulation
> Branch: `frontend`

BhoomiIQ is an AI-powered dashboard for Indian government infrastructure corridor teams to **predict, explain, simulate, and act** on land acquisition risks — before they cause project delays.

---

## ?? Key Features

| Feature | Description |
|---|---|
| ?? **Risk Score Engine** | ML-powered risk score (0–100) per project corridor |
| ?? **SHAP Explainability** | Visual feature attribution — know *why* a parcel is risky |
| ?? **What-If Simulation** | Adjust policy sliders and see score change in real time |
| ?? **Before/After Comparison** | Side-by-side delta view of simulated vs baseline risk |
| ??? **Cadastral GIS Map** | Interactive SVG parcel map with zoom + valuation heatmap |
| ?? **Disputes Tracker** | HC stay writs, civil disputes, Lok Adalat action buttons |
| ?? **Audit Trail** | Immutable statutory log with Section 25 lapsing clock |
| ?? **Gazette Export** | Generate official government gazette orders in-browser |

---

## ?? Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/thadityarajsingh/land-acquisition-ai.git
cd land-acquisition-ai

# 2. Switch to the frontend branch
git checkout frontend

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be live at **http://localhost:5173/**

---

## ?? Environment Configuration

Create a `.env` file in the project root to connect to the FastAPI backend:

```env
VITE_API_URL=http://localhost:8000
```

> **Without a `.env` file**, the app runs entirely on realistic mock data — no backend required for demo purposes.

---

## ??? Project Structure

```
src/
+-- api/                    # All backend calls
¦   +-- client.js           # Axios base instance
¦   +-- projects.js         # GET /projects, GET /projects/{id}
¦   +-- predict.js          # POST /predict
¦   +-- whatIf.js           # POST /what-if
¦   +-- recommendations.js  # GET /recommendations/{id}
+-- hooks/                  # React state management
¦   +-- useProjects.js
¦   +-- usePredict.js
¦   +-- useWhatIf.js
¦   +-- useRecommendations.js
+-- components/
¦   +-- layout/
¦   ¦   +-- TopNav.jsx
¦   ¦   +-- Sidebar.jsx
¦   +-- dashboard/
¦       +-- Dashboard.jsx
¦       +-- RiskScoreCard.jsx
¦       +-- RiskDrivers.jsx
¦       +-- WhatIfPanel.jsx
¦       +-- ComparisonView.jsx
¦       +-- MitigationProtocols.jsx
¦       +-- GazetteModal.jsx
¦       +-- CadastralMap.jsx
¦       +-- CorridorView.jsx
¦       +-- DisputesView.jsx
¦       +-- AuditTrailView.jsx
+-- lib/utils.js
+-- mockData.js
+-- App.jsx
+-- main.jsx
+-- index.css
```

---

## ?? API Contract (for Backend Team)

### POST /predict
```json
// Request
{ "projectId": "string", "parcelIds": ["string"] }

// Response
{
  "riskScore": 72,
  "riskCategory": "HIGH",
  "estimatedDelay": 18,
  "drivers": [
    { "feature": "Litigation History", "value": 0.34, "direction": "negative" }
  ]
}
```

### POST /what-if
```json
// Request
{
  "projectId": "string",
  "params": {
    "compensationMultiplier": 1.5,
    "litigationResolution": 0.7,
    "r2rProgress": 0.8,
    "stakeholderMeetings": 5
  }
}

// Response
{
  "simulatedScore": 48,
  "scoreDelta": -24,
  "daysSaved": 120,
  "simulatedDelay": 6
}
```

### GET /projects
```json
[{ "id": "string", "name": "string", "corridor": "string", "state": "string" }]
```

### GET /projects/{id}
```json
{ "id": "string", "name": "string", "parcels": [], "totalArea": 0, "affectedHouseholds": 0 }
```

### GET /recommendations/{projectId}
```json
[{ "id": "string", "priority": "HIGH", "action": "string", "timeline": "string", "legalBasis": "string" }]
```

---

## ?? Design System

| Token | Value | Usage |
|---|---|---|
| Navy Primary | `#0A1120` | App background, top nav |
| Navy Secondary | `#1E3A8A` | Sidebar, card headers |
| Saffron Accent | `#F97316` | CTAs, active states |
| Risk High | `#EF4444` | Red badges |
| Risk Medium | `#F59E0B` | Amber badges |
| Risk Low | `#10B981` | Emerald badges |

---

## ?? Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 6 |
| Styling | Tailwind CSS 3 |
| Charts | Recharts v2 |
| Icons | Lucide React |
| HTTP | Axios |
| Utilities | clsx, tailwind-merge |

---

## ?? Available Scripts

```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Production build ? /dist
npm run preview   # Preview production build
npm run lint      # ESLint check
```

---

## ?? Team

| Member | Role |
|---|---|
| Member 1 | ML Model (Risk Prediction) |
| Member 2 | Backend (FastAPI + DB) |
| **Member 3** | **Frontend + What-If Simulation** |
| Member 4 | Data Engineering |
| Member 5 | GIS / Geospatial |
| Member 6 | Documentation + Presentation |

---

## ?? License

Built for **Smart India Hackathon 2025**.
© 2025 BhoomiIQ Team. All rights reserved.
