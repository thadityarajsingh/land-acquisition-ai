# BhoomiIQ Documentation

This directory contains the technical and operational documentation for the BhoomiIQ Land Acquisition Risk Intelligence Platform.

## Documentation map

| Document | Purpose |
|---|---|
| [Architecture](./ARCHITECTURE.md) | System design, data flow, and component responsibilities |
| [API Reference](./API.md) | FastAPI endpoints, request fields, responses, and examples |
| [Development Guide](./DEVELOPMENT.md) | Local setup, commands, environment configuration, and troubleshooting |
| [Deployment Guide](./DEPLOYMENT.md) | Render deployment for the frontend and FastAPI backend |
| [Machine Learning](./ML.md) | Dataset, preprocessing, model, scoring, SHAP, evaluation, and limitations |
| [GIS](./GIS.md) | Map data flow, coordinate handling, risk visualization, and GIS limitations |
| [Testing](./TESTING.md) | Manual and automated verification checklist |
| [Contributing](../CONTRIBUTING.md) | Branching, commits, pull requests, and coding expectations |
| [Security](../SECURITY.md) | Security reporting and deployment safety notes |

## Project status

BhoomiIQ is a prototype decision-support platform. The current ML evaluation uses synthetic SIH26017 data, and the GIS layer includes prototype geometry where official cadastral boundaries are unavailable. See the ML and GIS documents for limitations.

## Live services

- Frontend: `https://bhoomi-ai-frontend.onrender.com`
- FastAPI backend: `https://bhoomi-ai-backend-4zod.onrender.com`
- API health: `https://bhoomi-ai-backend-4zod.onrender.com/health`
- Interactive API docs: `https://bhoomi-ai-backend-4zod.onrender.com/docs`

## Source of truth

The `main` branch is the deployable branch. Documentation should be updated whenever an API contract, deployment setting, model behavior, data source, or major UI workflow changes.
