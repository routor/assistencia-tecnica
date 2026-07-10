# Implementation Plan: Landing Assistência Técnica

**Feature**: `003-landing-assistencia-tecnica` | **Date**: 2026-07-09 |
**Spec**: [spec.md](./spec.md)

**Input**: Feature specification and normative source documents at repository root

**Implementation owner**: Claude Code | **Planning and independent QA owner**: Codex

## Summary

Build one honest demand-validation landing at `/assistencia-tecnica` in a lean full-stack Next.js
application. The visitor recognizes a bench/workshop repair lifecycle, reviews a clearly conceptual
product vision, and submits qualified interest through a two-step accessible form. A Server Action
validates bounded data, authoritatively sets the vertical/path, normalizes WhatsApp, inserts a
provider-neutral PostgreSQL lead idempotently, and redirects only after a safe success. GTM receives
the fixed non-PII event vocabulary; every outwardly identical inserted/existing success produces
one `lead_submit_success`, while the unique database row count remains the canonical validation
metric. Security, supply-chain, privacy, accessibility, performance, design, and
evidence gates are first-class deliverables rather than final cleanup.

## Technical Context

**Language/Version**: TypeScript in strict mode on Node.js 24 LTS; exact TypeScript/runtime patch
versions must be current, mutually compatible, and locked at project initialization.

**Primary Dependencies**: Stable Next.js 16.2 App Router with React; Tailwind CSS 4.3; Zod; Drizzle
ORM and Drizzle Kit; provider-neutral Postgres.js driver. Expected test-only dependencies are
Vitest, Testing Library, jsdom, Playwright, and `@axe-core/playwright`. No component library, motion
library, analytics wrapper, icon package, CMS, auth, queue, or provider-specific database SDK.

**Storage**: Managed standard PostgreSQL selected externally (Neon or Supabase); a pooled,
least-privilege, server-only connection URL; versioned Drizzle migrations; no proprietary API.

**Testing**: Vitest + Testing Library for schema, normalization, analytics filtering, components,
and form states; database-backed integration tests for insert/idempotency/failure; Playwright for
the conversion journey, event semantics, target viewports, slow network, and axe-core.

**Target Platform**: Responsive web, deployed to Vercel preview/production; current Chromium;
390x844 and 1440x900 required acceptance viewports.

**Project Type**: Single Next.js full-stack web application with application routes, server actions,
database layer, static/semantic marketing UI, and shared test/CI infrastructure.

**Performance Goals**: Lighthouse mobile Performance >=90, Accessibility >=95, Best Practices
>=95, SEO >=90; LCP <=2.5s; CLS <=0.1; non-blocking analytics; minimal client boundary.

**Constraints**: Validation-only scope; no Go backend or SaaS architecture; strict TypeScript;
server-side validation; one shared schema; no PII in analytics/logs; exact security-gate order;
WCAG 2.2 AA; Impeccable mandatory; no new dependency without the SEC-002 report record.

**Scale/Scope**: Three public routes for this increment, one `leads` table designed to support three
verticals, one form action, one event vocabulary, and modest early campaign traffic. Optimize for
correctness and reproducibility, not speculative high-scale architecture.

## Constitution Check

*GATE: Passed before research and passed again after data/contracts/design.*

| Principle / gate | Pre-research result | Post-design result | Evidence |
|---|---|---|---|
| Validation scope and honest communication | PASS | PASS | FR-001-FR-010, FR-029, explicit exclusions, concept labels in `DESIGN.md`. |
| Fixed stack and simplicity | PASS | PASS | Technical Context, `research.md` decisions R-001-R-006, single-project structure. |
| Security and supply chain | PASS | PASS | SEC-001-SEC-024 and Security Design below; no control waived. |
| Data minimization and LGPD | PASS | PASS | US2/US4, data model, form/deletion contracts, no raw IP or device credentials. |
| Evidence-based quality | PASS | PASS | `quickstart.md`, contracts, test strategy, report and matrix deliverables. |
| Accessible Impeccable design | PASS | PASS | `PRODUCT.md`, `DESIGN.md`, `design-brief.md`, NFR-001-NFR-013. |
| Agent separation and traceability | PASS | PASS | `AGENTS.md`, `CLAUDE.md`, stable IDs, planned matrix and handoff. |
| Full ordered release gate | PASS | PASS | CI architecture and security-control table; campaign release is separately gated. |

No constitution violation is justified or accepted. The unavailable `node` executable in the
planning environment is an explicitly recorded environment impediment, not a gate bypass; no
application code or runtime verification occurs in this phase.

## Architecture and Data Flow

1. A server-rendered marketing route derives canonical metadata and renders the full narrative.
2. A small client form island owns two-step interaction, `useActionState`, safe local attribution,
   accessible focus/status behavior, and non-PII event emission.
3. A shared Zod contract validates browser and trusted-boundary shapes, but the Server Action
   revalidates and overwrites vertical/path with constants.
4. The Server Action normalizes WhatsApp, maps bounded vertical answers to shared lead columns, and
   performs one parameterized insert using the unique `(vertical, whatsapp_normalized)` constraint.
5. `inserted` and `existing` return the same safe public success, exactly one
   `lead_submit_success`, and redirect. Identical outward behavior avoids turning the form into a
   membership oracle; unique stored rows, not raw browser success events, are the canonical lead
   count. `invalid`, `bot`, and `error` never redirect or emit conversion success.
6. GTM loads after interactive content without blocking form behavior. A typed/allowlisted event
   helper drops unknown properties and forbids PII/open answers.
7. `/obrigado` only emits `thank_you_view`; direct navigation cannot manufacture a lead success.
8. Privacy and operational procedures document purpose, deletion, external settings, and campaign
   release requirements.

## Security and Supply-Chain Design

### Ordered CI / Review Gate

`pnpm install --frozen-lockfile` precedes all jobs. Required logical order:

1. lint;
2. typecheck;
3. unit tests;
4. PostgreSQL-backed integration tests and migration reproducibility;
5. production build;
6. `pnpm audit --audit-level high`;
7. `trivy fs --scanners vuln,secret,misconfig --severity HIGH,CRITICAL --exit-code 1 .` plus a
   recorded Trivy license scan/applicability result;
8. CodeQL SAST through a reusable workflow/job that MUST depend on the Trivy job (Semgrep only as a
   documented approved substitution if CodeQL cannot run);
9. Playwright E2E, axe, responsive and analytics assertions against a production build;
10. Claude Code execution report with evidence;
11. independent Codex rerun, source/dependency/report review, and decision.

The PR workflow MUST call the CodeQL reusable workflow/job after Trivy and make E2E depend on the
successful SAST result; a separate concurrent status is not sufficient. Jobs may use artifacts and
caching for efficiency, but a later job MUST NOT report success when an earlier required gate failed.
Actions MUST use least permissions, explicit timeouts, and immutable
commit SHAs; tags alone are insufficient for third-party actions. The workflow MUST NOT expose
production secrets to untrusted pull requests.

### Control Mapping

| Control IDs | Design / configuration | Blocking rule | Claude evidence | Codex review |
|---|---|---|---|---|
| SEC-001, SEC-017, SEC-023 | Ordered CI plus local commands and independent rerun | Missing/failed gate blocks | Exact command/job URLs and results | Rerun applicable commands and inspect workflow/source |
| SEC-002-SEC-004 | Minimal manifest, `packageManager`, Node engine, committed lockfile, frozen CI | Unjustified/unlocked change blocks | Eight-field dependency table and diff | Inspect manifest/lockfile/license/security purpose |
| SEC-005 | pnpm audit at High | High/Critical blocks | Unredacted finding IDs without secrets | Compare output with lockfile/Trivy |
| SEC-006, SEC-007 | Trivy fs for vuln, secret, misconfig with exact flags plus license scan/applicability | High/Critical or secret blocks; license findings require policy review | Commands, version, DB freshness, vuln/secret/misconfig and license summaries | Rerun and inspect suppressions/config/licenses |
| SEC-008, SEC-009 | CodeQL JavaScript/TypeScript queries on PR/push/schedule | Critical/High unresolved blocks | Run URL, query suite, evaluated findings | Inspect source-to-sink context; Semgrep substitution requires record |
| SEC-010 | Dependabot alerts/security updates + weekly pnpm updates, no auto-merge | Disabled/unreviewed update blocks release | Settings/readback and PR policy | Verify config/settings and no bypass |
| SEC-011 | Socket GitHub integration on dependency PRs/changes | Missing analysis for new dependency blocks | Socket report/readback for each addition | Inspect suspicious behavior categories and decision |
| SEC-012-SEC-014 | Secret Scanning/Push Protection when available plus Trivy always | Secret triggers block, revoke, rotate, history/log review | Enabled-status readback or explicit capability blocker; incident record | Ensure no secret is reproduced; confirm rotation evidence |
| SEC-015, SEC-016 | Server-only env, Zod bounds, constants/allowlists, ORM parameterization, strict CSP | Untrusted use/secret exposure blocks | Unit/integration/E2E evidence and bundle inspection | Source review of action/env/analytics/database path |
| SEC-018-SEC-020 | Severity policy and formal exception schema | Critical/High/secret remain blocking unless security spec permits assessed SAST finding; no silent exception | Exception record with all seven fields | Validate owner, deadline, mitigation, and non-bypass scope |
| SEC-021, SEC-022 | Agent rules and mandatory execution report | Missing/altered policy or report blocks | Completed security section and deviations | Compare report to actual diff/tool output |
| SEC-024 | Future-control trigger documented | Go/container/release artifact without applicable scanner blocks | Applicability statement | Confirm no future artifact entered scope |

### Application Security Decisions

- Validate and bound every string/array; trim text; normalize email case and WhatsApp; never render
  open fields as HTML.
- Set `vertical` and `landing_path` on the server; accept only the fixed enumerations and supported
  attribution keys/lengths.
- Use unique database enforcement for concurrency and a no-update conflict path for privacy-safe
  idempotency. Do not rely only on the disabled button.
- Keep database and GTM identifiers in validated server/public environment partitions; only
  explicitly public analytics identifiers may be exposed.
- Produce generic public errors and structured non-PII operational signals. Do not log form values,
  SQL, connection strings, or stack traces in user-facing responses/reports.
- Implement a nonce-based Content Security Policy at the framework-supported request boundary,
  with only required GTM/GA/Ads origins, no production `unsafe-eval`, and the smallest viable
  directives. Record and test the final header; missing production GTM origins block conversion
  validation rather than inviting a broad wildcard.
- Add HSTS in production, frame protection through `frame-ancestors`, content-type protection,
  strict referrer policy, permissions policy, and safe cross-origin defaults appropriate to GTM.
- Do not add application auth, CAPTCHA, WAF SDK, or rate-limit package. Honeypot, bounds, unique
  constraint, and platform protections are in scope; material abuse triggers a new reviewed control.

## Traceability Strategy

- Stable IDs: `US#`, `FR-###`, `NFR-###`, `SEC-###`, `SC-###`, `PD-###`, `CTR-###` (contract),
  `T###` (task), and `CHK###` (requirements-quality checklist).
- `tasks.md` MUST cite requirement IDs in every task description; tests cite the same IDs in names,
  comments, or report mapping without duplicating sensitive values.
- `traceability.md` is the canonical matrix from every FR/NFR/SEC/buildable SC to tasks, planned
  tests/evidence, and security controls. Coverage must be 100% before handoff.
- The Claude report MUST map completed task IDs to files and evidence. Codex QA maps each finding
  back to the violated requirement/control and acceptance evidence.

## Implementation Phases

### Phase 0 - Reproducible and Secure Foundation

Initialize the fixed stack with Node 24 LTS, Corepack/pnpm lock metadata, strict TypeScript, Tailwind,
test runners, Drizzle, environment validation, scripts, CI, CodeQL, Dependabot, Trivy, Socket setup
instructions, secret protection instructions, and agent/report templates. Record every dependency
before continuing.

### Phase 1 - Trusted Data Boundary

Create versioned schema/migration, uniqueness/privacy invariants, shared validation/normalization,
safe environment partition, database adapter, idempotent Server Action result contract, and
integration-test database lifecycle.

### Phase 2 - Honest Landing Narrative

Implement metadata, shared shell, hero, recognizable process, risk-to-lifecycle narrative, benefits,
concept-labeled device record/timeline/quote, audience fit, pilot, FAQ, footer, and responsive design
according to `PRODUCT.md`/`DESIGN.md`. Keep content server-rendered and client JavaScript minimal.

### Phase 3 - Qualified Conversion

Implement the accessible two-step client form, field/group states, consent, honeypot, slow-network
feedback, safe retry, idempotent outcome handling, and thank-you/privacy routes.

### Phase 4 - Privacy-Safe Measurement

Implement fixed event vocabulary and property allowlist, attribution preservation/bounds,
idempotent success semantics, non-blocking GTM, and manual GTM/GA4/Ads documentation.

### Phase 5 - Verification, Impeccable, and Report

Run Impeccable critique/adapt/audit/polish; unit/integration/E2E/axe/responsive/performance/security
gates; screenshots; dependency/license review; migration replay; CSP/PII/client-bundle inspection;
and the complete Claude execution report. Production/campaign settings remain separately blocked
until owner inputs and external readbacks exist.

## Project Structure

### Documentation (this feature)

```text
specs/003-landing-assistencia-tecnica/
├── spec.md
├── clarifications.md
├── design-brief.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── traceability.md
├── assets/
│   └── impeccable-direction-probes.png
├── contracts/
│   ├── analytics-events.md
│   ├── environment.md
│   ├── lead-deletion.md
│   ├── lead-submission.md
│   └── security-exception.md
└── checklists/
    ├── requirements.md
    ├── release-review.md
    └── security-and-quality.md
```

### Source Code (repository root; to be created only by Claude Code)

```text
.
├── .github/
│   ├── dependabot.yml
│   └── workflows/
│       ├── ci.yml
│       └── codeql.yml
├── app/
│   ├── (marketing)/assistencia-tecnica/page.tsx
│   ├── obrigado/page.tsx
│   ├── privacidade/page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── forms/lead-interest-form.tsx
│   ├── marketing/
│   └── ui/
├── db/
│   ├── migrations/
│   └── schema.ts
├── docs/
│   ├── analytics-setup.md
│   ├── dependency-policy.md
│   ├── lead-deletion.md
│   └── security-operations.md
├── lib/
│   ├── actions/submit-lead.ts
│   ├── analytics/events.ts
│   ├── db.ts
│   ├── env.ts
│   └── validation/lead.ts
├── public/
├── reports/
├── tests/
│   ├── e2e/
│   ├── integration/
│   └── unit/
├── next.config.ts
├── proxy.ts
├── package.json
├── pnpm-lock.yaml
├── playwright.config.ts
├── tsconfig.json
└── vitest.config.ts
```

**Structure Decision**: One Next.js full-stack application preserves the macro architecture and fair
cross-vertical infrastructure. UI, server boundary, persistence, analytics, and tests are separated
only by real responsibility. No extra service, package workspace, generated SDK, or backend exists.

## Conflict, Impediment, and Exception Register

| ID | Type | Description | Resolution / status |
|---|---|---|---|
| CIR-001 | Impediment | Planning environment has no `node`; Impeccable scripts and runtime commands cannot execute. | Recorded. Direction derived from normative docs and a native image probe. Claude must install/use Node 24 LTS and rerun context/audit flows. |
| CIR-002 | Repository risk | Git root is above this project and contains unrelated neighboring changes. | Claude and Codex must scope status/diff/commit operations to this directory and never alter neighbors. |
| CIR-003 | External configuration | GitHub/Socket security settings require repository/organization permission. | Implement config files where possible; obtain readback from an administrator. Missing capability remains a release blocker, not a pass. |
| CIR-004 | External content | Controller identity, deletion contact, retention, canonical origin, and analytics IDs are not supplied. | Use validated configuration/placeholders that cannot ship; PD-003/PD-004 block production/campaign release. |
| CIR-005 | Security conflict | None identified between macro architecture and security specification. | Security specification precedence is retained. No exception requested. |
| CIR-006 | Tooling impediment | Spec Kit agent-context hook could not run because system Python lacks PyYAML. | `AGENTS.md` already contains the required managed plan pointer, verified manually. Do not install an unplanned Python package merely for this planning hook. |

## Complexity Tracking

No constitution violation or exceptional complexity is planned. The nonce CSP, integration tests,
and security workflows are required controls, not optional architecture. Any implementation need
outside this plan requires a documented conflict and approval before work continues.
