# Landing Assistência Técnica (`003-landing-assistencia-tecnica`)

Honest Brazilian-Portuguese **demand-validation** landing at `/assistencia-tecnica` for small
bench/workshop repair businesses. It presents a proposed intake-to-warranty workflow **as a concept
in validation** (not a released product) and persists qualified pilot/interview interest safely.

> This is a validation experiment, **not a SaaS**. No auth, dashboards, payments, real WhatsApp
> integration, inventory, notifications, Go backend, queues, or CMS.

## Stack

Next.js 16 (App Router, Server Actions) · React 19 · strict TypeScript · Tailwind CSS 4 · Zod ·
Drizzle ORM + Postgres.js · PostgreSQL · GTM (manual) · Vitest + Testing Library · Playwright +
axe-core · pnpm · Node.js 24 LTS.

## Prerequisites

- Node.js 24 LTS (`.nvmrc`) and Corepack-enabled pnpm (`packageManager` pins the version).
- A PostgreSQL database. For local dev/tests, a disposable container works:
  ```bash
  docker run -d --name at-pg -e POSTGRES_USER=app_user -e POSTGRES_PASSWORD=dev_only_local_pw \
    -e POSTGRES_DB=assistencia_tecnica -p 5432:5432 postgres:16-alpine
  ```
- Trivy (security scans) from an official pinned distribution.

## Setup (local)

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local     # fill LOCAL placeholders only — never commit real secrets
pnpm db:migrate                # apply migrations from empty
pnpm dev
```

Open http://localhost:3000/assistencia-tecnica

### Environment (CTR-003 — placeholders only, never commit real values)

| Variable | Classification | Notes |
|---|---|---|
| `DATABASE_URL` | secret, server-only | pooled least-privilege PostgreSQL URL; fails closed if missing |
| `TEST_DATABASE_URL` | secret, test-only | isolated disposable DB for integration tests |
| `NEXT_PUBLIC_SITE_URL` | public | absolute HTTPS origin for canonical/social metadata |
| `NEXT_PUBLIC_GTM_ID` | public | `GTM-XXXXXXX`; empty disables analytics (form still works) |
| `PRIVACY_CONTROLLER_NAME` | public content | **required before production** (else privacy page fails closed) |
| `PRIVACY_CONTACT` | public content | **required before production** |
| `LEAD_RETENTION_DAYS` | public policy | positive integer; **required before production** |

## Scripts / ordered gate

```bash
pnpm lint          # ESLint
pnpm typecheck     # tsc --noEmit
pnpm test          # unit (Vitest + Testing Library, jsdom)
pnpm test:integration   # PostgreSQL-backed (needs TEST_DATABASE_URL)
pnpm build         # production build
pnpm audit --audit-level high
trivy fs --scanners vuln,secret,misconfig --severity HIGH,CRITICAL --exit-code 1 .
trivy fs --scanners license .
# CodeQL runs in CI (after Trivy); then:
pnpm test:e2e      # Playwright (390x844 + 1440x900) against a production build
pnpm test:lighthouse
```

## Docs

- `docs/security-operations.md` — supply-chain controls, readbacks, incident response.
- `docs/dependency-policy.md` — new-dependency process.
- `docs/analytics-setup.md` — GTM/GA4/Ads manual configuration.
- `docs/lead-deletion.md` — operator deletion procedure (CTR-004).

## Production / campaign gates (owner inputs required — PD-001..PD-006)

Provide production `DATABASE_URL`, canonical origin, GTM/GA4/Ads IDs, the privacy controller/contact
identity, and the retention period; enable Dependabot/Socket/Secret-Scanning/CodeQL and obtain
readbacks. Until then, production/campaign release stays **BLOCKED**. Claude Code does not
self-approve; independent Codex QA issues the final status.
