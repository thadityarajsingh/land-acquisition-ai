# Contributing to BhoomiIQ

## Branch

`main` is the deployable branch. Keep changes small, testable, and documented.

For feature work, use a short-lived branch and open a pull request into `main` when the change is ready.

## Before submitting changes

Run the relevant checks:

```bash
npm run build
```

For backend changes, start FastAPI and verify `/health` plus the affected endpoint(s).

## Commit messages

Use clear imperative messages, for example:

```text
Fix production API URL
Add GIS dataset documentation
Update prediction API contract
```

## Code organization

- React UI belongs under `src/components`.
- API wrappers belong under `src/api`.
- Async API state belongs under `src/hooks`.
- Backend routes belong under `backend/routes`.
- Backend business/model services belong under `backend/services`.
- ML training and preprocessing code belongs under `ml/`.
- Technical documentation belongs under `docs/`.

## API changes

When changing an endpoint:

1. Update the implementation.
2. Update `docs/API.md`.
3. Update frontend API wrappers if required.
4. Test the endpoint through `/docs` or an HTTP client.
5. Test the affected frontend workflow.

## Model changes

When changing features, preprocessing, training, or artifacts:

1. Update `docs/ML.md`.
2. Re-evaluate the model on a held-out split.
3. Preserve the same preprocessing pipeline for inference.
4. Document limitations and metrics.
5. Verify backend prediction and SHAP explainability.

## GIS changes

Document changes to coordinate handling, data matching, map providers, parcel geometry, or risk visualization in `docs/GIS.md`.

Never label generated/demo geometry as official cadastral geometry.

## Documentation standard

Documentation should distinguish between:

- implemented behavior
- prototype/demo behavior
- assumptions
- future work
- measured model results

Avoid presenting model estimates as guarantees.
