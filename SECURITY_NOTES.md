# Security Notes for E-Commerce (Monorepo)

This document tracks known security considerations and mitigations for the repository.

## 1) npm audit findings (frontend)

- **Context**: The frontend currently uses `react-scripts@5`. Some advisories originate from transitive dev-only tooling (e.g. `webpack-dev-server`, `svgo`, `nth-check`).
- **Status**: `npm audit` may report ~9 issues (3 moderate, 6 high) depending on the registry/advisory database at the time of install.
- **Risk Assessment**:
  - These are **development-time** dependencies and are **not shipped** in production builds.
  - No direct exploit vector exists for end-users of the built site if you deploy static assets from `npm run build`.
- **Mitigations in place**:
  - Avoid committing `.env` and other secrets; `.gitignore` covers `*.env`.
  - Keep lockfiles updated and pin safe versions when possible.
- **Planned improvement**:
  - Migrate CRA (`react-scripts`) to **Vite** on a separate branch to reduce the dev dependency surface and clear audit warnings.

## 2) Secrets management

- **Never commit secrets** (API keys, JWT secrets, Stripe keys).
- `backend/.env` is ignored via `.gitignore`.
- Provide sample variables via `backend/.env.example`.

## 3) Production build & serving

- Always use `npm run build` to produce static assets for production.
- Do **not** serve the app using `webpack-dev-server` in production.
- Use a static file host or a reverse proxy (e.g., Nginx) for built assets.

## 4) Backend security checklist

- Validate and sanitize request inputs (e.g., with a validation layer).
- Use `helmet`, CORS configuration, and rate limiting if exposed publicly.
- Store secrets in environment variables (never in source control).
- Keep MongoDB secured (auth enabled, network rules, TLS where applicable).
- Regularly rotate JWT secrets and Stripe keys if exposure is suspected.

## 5) Supply-chain hygiene

- Periodically run `npm audit` and `npm outdated`.
- Apply minor/patch updates proactively.
- For major updates, test on a feature branch with CI before merging to `main`.

## 6) Incident response

- If a secret was ever pushed: rotate the key, purge the history (re-init or filter history), and force-push a clean tree.
- Create a GitHub Security Advisory or private issue to track the remediation steps.

---
_Last updated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")_
