# Validation Quickstart: Landing Assistência Técnica

This is the execution/acceptance contract for Claude Code and later independent Codex QA. Use
synthetic data and approved secret stores only.

## Prerequisites

- Node.js 24 LTS and Corepack-enabled pnpm locked by `packageManager`.
- Current Chromium/Playwright browser installed through the locked test tool.
- Isolated PostgreSQL integration database and non-production preview database.
- Trivy from an official pinned/checksummed distribution.
- GitHub Actions/CodeQL/Dependabot plus Socket and secret-control access.
- CTR-003 production inputs only for production/campaign validation.

## Reproducible Setup

1. Read all agent, constitution, source, feature, contract, checklist, and handoff documents; list
   them in the execution report before editing.
2. Record Node/pnpm versions without printing environment values.
3. Install only with `pnpm install --frozen-lockfile` after the initial reviewed lockfile exists.
4. Validate environment against an isolated database; never reuse production data.
5. Apply all migrations from empty and record success.

## Required Local/CI Commands

Run in the mandatory order and record exit code, duration, and result:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm build
pnpm audit --audit-level high
trivy fs --scanners vuln,secret,misconfig --severity HIGH,CRITICAL --exit-code 1 .
trivy fs --scanners license .
```

At this point the ordered PR workflow MUST complete its CodeQL job, dependent on successful Trivy.
Only after CodeQL passes, run/accept the remaining ordered gates:

```bash
pnpm test:e2e
pnpm test:lighthouse
```

CodeQL runs in GitHub Actions, not through an unpinned ad hoc local install. The license scan's
applicability/findings must be recorded even when no license blocks are configured. Socket,
Dependabot, Secret Scanning, Push Protection, and branch protection require repository readback.
Never use `npx` to fetch an unpinned gate tool.

## Scenario A - Narrative and Truthfulness (US1)

At 390x844 and 1440x900 inspect first viewport, lifecycle, concept labels, audience fit/non-fit,
pilot, FAQ, and footer. Expected: immediate audience/value/validation/CTA, full stages, no fake proof,
available-product claim, field-service blending, device credentials, or out-of-scope claim.

## Scenario B - Valid First Submission (US2)

With a synthetic unique phone, complete both steps, consent, and submit under slow network. Expected:
accessible pending state; one row with authoritative vertical/path, normalized phone, bounded answers
and consent; one success; correct redirect; one submit-success event.

## Scenario C - Validation, Retry, and Idempotency (US2)

Exercise invalid fields, missing consent, honeypot, database outage/recovery, sequential duplicate,
and concurrent duplicate attempts. Expected: safe errors, retained values, no internal disclosure,
no success on invalid/bot/error, and exactly one row. Inserted/existing public states are identical.

## Scenario D - Analytics and Attribution (US3)

Use supported plus unknown/overlong/malicious attribution. Capture `dataLayer` through success,
validation failure, database failure, duplicate, direct thanks, back navigation, and blocked GTM.
Expected: approved events/properties only; defined cardinality; no PII/open answer/raw gclid;
conversion only on submit success; persistence works with blocked GTM.

## Scenario E - Privacy and Deletion (US4)

Review Portuguese privacy and execute CTR-004 with synthetic leads. Expected: real production values
required before release; consent unselected; only verified target deleted; no PII in logs/reports;
backup limitations honest.

## Scenario F - Accessibility, Responsive, and Performance

Complete keyboard, focus, error/status association, 200% zoom, reduced motion, asset failure, long
labels, axe, target screenshots, and Lighthouse against production build/preview. Expected: zero
critical/serious axe violations, no clipping/lost focus, semantic order, all thresholds met under a
recorded profile.

## Scenario G - Security and Supply Chain

Inspect manifest/lockfile, dependency rows/licenses, action SHAs/permissions, CSP/headers, client
bundle, logs, Server Action boundary, parameterized database, scanners, exceptions, and repository
readbacks. Expected: no secret/PII, unaccepted Critical/High, missing scanner, unexpected dependency,
force fix, or silent exception.

## Campaign Release Gate

No paid traffic until Codex approves; production persistence works; GTM/Ads conversion is published;
privacy has real approved details; console is clean; screenshots are reviewed; external security
controls are read back; and validation status is unmistakable.
