# Handoff Codex -> Claude Code: 003 Landing Assistência Técnica

**Status**: Ready for implementation, subject to the stop conditions below

**Codex planning status**: Complete; no application code was created

**Implementation owner**: Claude Code

**Independent approval owner**: Codex

## Objective

Implement `/assistencia-tecnica` as an honest Brazilian Portuguese demand-validation landing for
small bench/workshop repair businesses. Present the proposed intake-to-warranty flow, clearly label
all product views as concepts, and persist qualified pilot/interview interest safely. Do not build a
SaaS or present the proposal as available.

## Source Precedence

1. `spec_seguranca_codigo_supply_chain.md` for every security conflict.
2. `.specify/memory/constitution.md`.
3. `plano_macro_landing_assistencia_tecnica_codex_claude.md`.
4. Feature spec, contracts, plan, tasks, traceability, and checklists.
5. `PRODUCT.md` and `DESIGN.md` for approved design decisions.

Stop and report a conflict; never weaken a higher-precedence source to make implementation easier.

## Mandatory Read Order Before Editing

1. `AGENTS.md`
2. `CLAUDE.md`
3. both normative root documents
4. `.specify/memory/constitution.md`
5. `specs/003-landing-assistencia-tecnica/spec.md`
6. `clarifications.md` and `decisions-and-risks.md`
7. `PRODUCT.md`, `DESIGN.md`, `design-brief.md`, and the direction probe
8. `research.md`, `plan.md`, `data-model.md`
9. every file in `contracts/`
10. `quickstart.md`, `tasks.md`, `traceability.md`
11. every file in `checklists/`
12. this handoff and the execution prompt

At the top of the execution report, list every document actually read before the first edit.

## Implementation Boundaries

- Execute T001-T087 in dependency order; do not skip setup/security or move it to a final cleanup.
- The planning environment lacked Node, so project-scoped Impeccable installation could not run.
  Before visual work, review the exact current CLI package/version with Socket and install it for
  both Claude and Codex using an exact-version pnpm command; record the tool/version/files/security
  result. Never execute an unpinned `npx impeccable` command.
- Use only the fixed stack. No Go, auth, dashboard, admin, payment, real WhatsApp integration,
  inventory, notifications, microservices, queues, CMS, AI support, or other SaaS scope.
- Do not edit the constitution/spec/planning package to make code appear compliant. Propose a
  documented conflict instead.
- Do not touch unrelated files outside this project; the parent Git repository contains neighboring
  user work.
- Do not invent production controller/contact/retention/domain/GTM/security-service values.
- Do not use real participant PII in development, tests, screenshots, docs, or reports.

## Dependency Gate

Before adding any package—including a baseline package—append a report row containing:

| Field | Required value |
|---|---|
| Package | Exact name |
| Version | Exact locked version |
| Purpose | Problem solved |
| Necessity | Why existing stack/platform is insufficient |
| Alternatives | Alternatives evaluated |
| License | Identified license |
| Scope | Production or development |
| Security | Socket/audit/Trivy/maintainer/install-script result |

Do not install convenience libraries. Unrecorded or unexplained manifest/lockfile changes are
blocking. Do not use an unpinned `npx` gate or `npm audit fix --force`.

## Required Execution Sequence

1. Setup/reproducibility/security workflow and initial dependency scan.
2. Trusted environment, database, validation, analytics allowlist, CSP/headers, and test foundation.
3. US1 honest narrative and concept-labeled design.
4. US2 two-step accessible form, Server Action, persistence, idempotency, thanks.
5. US3 bounded attribution and privacy-safe GTM events.
6. US4 privacy/deletion/retention operational content.
7. Impeccable critique -> adapt -> audit -> polish with findings fixed.
8. Full ordered gates, evidence, report, and handback to Codex.

Tests in each story are written first and shown failing for the missing behavior before implementation.

## Mandatory Security Gate

The final PR gate must enforce:

```text
pnpm install --frozen-lockfile
  -> lint
  -> typecheck
  -> unit tests
  -> PostgreSQL integration tests
  -> build
  -> pnpm audit --audit-level high
  -> Trivy vuln/secret/misconfig (HIGH,CRITICAL, exit 1)
  -> Trivy license scan/applicability
  -> CodeQL (depends on Trivy)
  -> E2E (depends on successful CodeQL)
  -> Lighthouse/additional acceptance evidence
  -> completed Claude execution report
  -> independent Codex review
```

Pin every action to a full immutable commit SHA and use least permissions/timeouts. High/Critical,
secret, missing scanner, unexplained dependency, or silent exception blocks handoff. If CodeQL is
genuinely unavailable, do not omit SAST; record the blocker and propose the approved Semgrep
substitution with equivalent scope/gates.

## Required Impeccable Work

Use the project-local Impeccable capability and record command/scope/findings/fixes for:

- `critique /assistencia-tecnica`
- `adapt /assistencia-tecnica`
- `audit /assistencia-tecnica`
- `polish /assistencia-tecnica`

Keep the `Registro de Bancada` direction. All concept views say “Visão do produto — conceito”. Do
not copy the probe as final UI or treat its generated copy/data as authoritative.

## Required Deliverables

- Application source/configuration/migrations/tests/docs from `plan.md`.
- `.github/workflows/ci.yml`, reusable `.github/workflows/codeql.yml`, and Dependabot config.
- Target screenshots in `reports/screenshots/003-landing-assistencia-tecnica/`.
- `reports/claude-execution-003-landing-assistencia-tecnica.md`.
- No QA approval report; that belongs to Codex.

## Execution Report Required Sections

1. Status and implementation summary.
2. Documents read before editing.
3. Branch/commit/runtime/tool versions.
4. Created/modified/deleted files.
5. T001-T087 completion mapping and incomplete items.
6. Technical decisions and approved tradeoffs.
7. Full dependency/license/security table.
8. Database model, migrations, replay and idempotency evidence.
9. Analytics events, property filtering, GTM manual configuration and evidence.
10. Impeccable commands/findings/remediation and screenshots.
11. Exact ordered commands/jobs with versions, exits, durations, and result links/paths.
12. Security section required by the normative spec: Trivy, CodeQL/Semgrep, audit, tests, new
    dependencies, found/fixed vulnerabilities, exceptions, secret status, known risks.
13. PII/secret/client-bundle/CSP/header inspection.
14. Risks, limitations, debts, external blockers, and every deviation.
15. Local run instructions using placeholders only.
16. Campaign release matrix with PASS/BLOCKED, evidence, and owner.

## Stop Conditions

Stop at the safe boundary and report `BLOCKED` when:

- a Critical/High vulnerability or exposed secret exists;
- an applicable scanner/control cannot run or is unavailable;
- a dependency lacks necessity/security/license evidence;
- satisfying a request would expand excluded scope or weaken the fixed stack;
- real production privacy/analytics/security values would need to be invented;
- a constitutional/security conflict cannot be safely resolved;
- implementation would alter unrelated parent-repository work.

Do not mark the overall feature approved. After the report is complete, hand the report and full diff
to Codex, which will use `checklists/release-review.md` and may issue a correction handoff.
