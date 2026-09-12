# Security Policy

## Scope

BhoomiIQ is currently a prototype decision-support application. It should not be treated as a production government information system without a dedicated security, privacy, legal, and operational review.

## Do not commit

Never commit:

- API keys
- passwords
- access tokens
- cloud credentials
- private certificates
- personal authentication data
- confidential government records

Use environment variables or the deployment provider's secret management for sensitive configuration.

## Data handling

The current prototype uses synthetic land-acquisition data. Real land, owner, compensation, legal, or personally identifiable information should not be added to the repository without appropriate authorization, minimization, access control, and retention procedures.

## Reporting a vulnerability

For a suspected security issue, do not publish credentials or exploit details in a public issue. Contact the repository owner privately and include a concise description, affected component, reproduction steps, and impact assessment.

## Deployment safety

- Keep CORS origins explicit.
- Use HTTPS in production.
- Validate API inputs.
- Keep secrets out of frontend `VITE_*` variables; Vite embeds these variables into the client bundle.
- Review third-party map/CDN dependencies before production use.
- Treat model outputs and recommendations as advisory.
