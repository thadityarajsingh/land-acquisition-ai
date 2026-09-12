# BhoomiIQ Documentation

This directory contains the judge-facing, technical, operational, and user-facing documentation for the BhoomiIQ Land Acquisition Risk Intelligence Platform.

## Start here — judge path

1. [Judge Guide](./JUDGE_GUIDE.md) — fastest route through the live demo and repository.
2. [Problem Statement](./PROBLEM_STATEMENT.md) — problem, need, and prototype scope.
3. [Solution Overview](./SOLUTION.md) — end-to-end product and technical solution.
4. [Demo Walkthrough](./DEMO_WALKTHROUGH.md) — recommended presentation sequence.

## Technical documentation

| Document | Purpose |
|---|---|
| [Architecture](./ARCHITECTURE.md) | System design, data flow, and component responsibilities |
| [API Reference](./API.md) | FastAPI endpoints, request fields, responses, and examples |
| [Data Dictionary](./DATA_DICTIONARY.md) | Dataset fields, target/leakage controls, and model-input status |
| [Model Card](./MODEL_CARD.md) | Intended use, evaluation, limitations, and improvement plan |
| [Machine Learning](./ML.md) | Dataset, preprocessing, model, scoring, SHAP, evaluation, and limitations |
| [GIS](./GIS.md) | Map data flow, coordinate handling, risk visualization, and GIS limitations |
| [Testing](./TESTING.md) | Manual and production verification checklist |
| [Deployment Guide](./DEPLOYMENT.md) | Render deployment for the frontend and FastAPI backend |
| [Development Guide](./DEVELOPMENT.md) | Local setup, commands, environment configuration, and troubleshooting |
| [User Guide](./USER_GUIDE.md) | How to use the dashboard and interpret its outputs |
| [Screenshots checklist](./screenshots/README.md) | Recommended evidence captures for the final submission |

## Project and governance documentation

- [Team & Responsibilities](./TEAM.md) — workstream ownership without inventing member details.
- [Contributing](../CONTRIBUTING.md) — contribution workflow.
- [Security](../SECURITY.md) — security reporting and deployment safety notes.
- [Changelog](../CHANGELOG.md) — high-level project and deployment history.

## Project status

BhoomiIQ is a prototype decision-support platform. The current ML evaluation uses synthetic SIH26017 data, and the GIS layer includes prototype geometry where official cadastral boundaries are unavailable. See the ML, Model Card, and GIS documents for limitations.

## Live services

- Frontend: `https://bhoomi-ai-frontend.onrender.com`
- FastAPI backend: `https://bhoomi-ai-backend-4zod.onrender.com`
- API health: `https://bhoomi-ai-backend-4zod.onrender.com/health`
- Interactive API docs: `https://bhoomi-ai-backend-4zod.onrender.com/docs`

## Source of truth

The `main` branch is the deployable source of truth. A judge should be able to understand the submitted system from `main` without relying on historical development branches. Documentation should be updated whenever an API contract, deployment setting, model behavior, data source, security assumption, or major UI workflow changes.
