# Tasks: Landing Assistência Técnica

**Input**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`,
`PRODUCT.md`, and `DESIGN.md`

**Tests**: Mandatory. Within every user-story phase, test tasks precede implementation tasks and
must demonstrate the intended failure before the implementation makes them pass.

**Completion rule**: A checkbox is not complete until its applicable functional, security,
accessibility, privacy, analytics, performance, dependency, and evidence controls pass. Every added
package requires the complete SEC-002 row in the execution report before installation/approval.

## Format: `[ID] [P?] [Story] Description`

- `[P]` means different files and no dependency on an incomplete task in the same phase.
- `[US#]` maps directly to a user story in `spec.md`.
- Requirement/control IDs in parentheses are the traceability authority.

## Phase 1: Setup - Reproducible and Secure Project

**Purpose**: Establish the fixed stack, dependency evidence, test runners, and repository security
before feature implementation.

- [x] T001 Record every required document read, runtime/tool availability, branch/commit context, and CIR-001/CIR-002 status in `reports/claude-execution-003-landing-assistencia-tecnica.md` (SEC-021, SEC-022, SC-010)
- [x] T002 Initialize the stable Next.js App Router project with pnpm, security-review and install an exact-version project-scoped Impeccable integration for Claude/Codex, and add only reviewed baseline dependencies; record all SEC-002/tooling fields before/with each addition in `package.json`, `pnpm-lock.yaml`, `.claude/`, `.agents/`, and `reports/claude-execution-003-landing-assistencia-tecnica.md` (FR-001, NFR-013, SEC-002, SEC-003, SC-011)
- [x] T003 Pin Node.js 24 LTS, the exact pnpm toolchain, engines, scripts, and install reproducibility in `.nvmrc` and `package.json` (SEC-004, SC-010)
- [x] T004 Configure strict TypeScript, compatible linting, and explicit `lint`/`typecheck` scripts in `tsconfig.json`, `eslint.config.mjs`, and `package.json` (NFR-014, SEC-017)
- [x] T005 [P] Configure Tailwind CSS 4.3 and map the approved OKLCH design tokens without a component library in `postcss.config.mjs` and `app/globals.css` (NFR-002, NFR-013) — postcss done; globals.css tokens completed in T027
- [x] T006 [P] Configure Vitest, Testing Library, jsdom, coverage boundaries, and isolated test setup in `vitest.config.ts` and `tests/setup.ts` (NFR-001, SEC-017, SC-010)
- [x] T007 [P] Configure Playwright projects for Chromium, 390x844, 1440x900, slow network, screenshots, axe, and production-server execution in `playwright.config.ts` (NFR-002, NFR-004, NFR-012, SC-008)
- [x] T008 [P] Configure locked Lighthouse CI thresholds and production-build execution in `lighthouserc.json` and `package.json` (NFR-005, NFR-006, SC-009)
- [x] T009 Add safe ignore rules and placeholder-only environment documentation with no credentials in `.gitignore` and `.env.example` (SEC-012-SEC-014, CTR-003)
- [x] T010 Create the least-privilege PR workflow with frozen install, lint, typecheck, unit, integration, build, audit, Trivy vulnerability/secret/misconfiguration and license scans, a reusable CodeQL call after Trivy, then E2E/Lighthouse depending on successful SAST; pin actions to immutable SHAs in `.github/workflows/ci.yml` (SEC-004-SEC-009, SEC-017, SC-010)
- [x] T011 [P] Configure reusable CodeQL JavaScript/TypeScript analysis with `workflow_call`, default-branch and scheduled triggers, least permissions, and pinned official actions in `.github/workflows/codeql.yml` (SEC-008, SEC-009)
- [x] T012 [P] Configure weekly pnpm Dependabot updates with no auto-merge policy in `.github/dependabot.yml` (SEC-010)
- [x] T013 Document Socket review categories, GitHub Secret Scanning/Push Protection, branch protection, action pinning, incident response, and required administrator readbacks in `docs/security-operations.md` (SEC-011-SEC-014, SEC-018-SEC-020)
- [x] T014 Execute the initial manifest/lockfile license, `pnpm audit`, Trivy vulnerability/secret/misconfiguration and license-applicability, Socket, and action-source review and append exact non-secret results/blockers to `reports/claude-execution-003-landing-assistencia-tecnica.md` (SEC-002-SEC-007, SEC-011, SC-011)

**Checkpoint**: Dependencies and repository controls are explicit, reproducible, scanned, and
recorded. A missing Critical/High/secret gate blocks Phase 2.

---

## Phase 2: Foundational - Trusted Boundaries and Shared Infrastructure

**Purpose**: Create the security/privacy/data primitives that block every user story.

- [x] T015 [P] Write failing environment-partition and fail-closed tests for all CTR-003 variables in `tests/unit/env.test.ts` (NFR-010, SEC-013, CTR-003)
- [x] T016 Implement explicit server/public environment schemas and prevent server-only imports in client code in `lib/env.ts` (NFR-010, SEC-013, CTR-003)
- [x] T017 [P] Write failing schema, uniqueness, consent, JSONB-shape, and empty-database migration tests in `tests/integration/leads-schema.test.ts` (FR-023, FR-026, SEC-015, SC-004)
- [x] T018 Define the portable `leads` model, checks, typed answers, and unique `(vertical, whatsapp_normalized)` index in `db/schema.ts` (FR-023, FR-026, FR-027, SEC-015)
- [x] T019 Generate and review the first reproducible non-destructive PostgreSQL migration in `db/migrations/0001_create_leads.sql` and its metadata (FR-026, SEC-015, SC-010)
- [x] T020 Implement the server-only pooled Postgres.js/Drizzle connection with safe lifecycle and no logged URL/query payload in `lib/db.ts` (NFR-009, NFR-010, SEC-013, SEC-015)
- [x] T021 [P] Write failing boundary tests for all fields, enum values, lengths, normalization, consent, unknown keys, hostile strings, and manipulated authority fields in `tests/unit/lead-validation.test.ts` (FR-014-FR-025, SEC-016)
- [x] T022 Implement the shared explicit Zod schemas, Portuguese labels, normalization, bounds, and server-authoritative mapping in `lib/validation/lead.ts` (FR-014-FR-025, SEC-016, CTR-001)
- [x] T023 [P] Write failing analytics vocabulary/property allowlist and PII rejection tests in `tests/unit/analytics-events.test.ts` (FR-031-FR-034, NFR-010, CTR-002)
- [x] T024 Implement a typed allowlisted `dataLayer` helper that drops unknown/PII properties and tolerates missing GTM in `lib/analytics/events.ts` (FR-031-FR-034, NFR-007, NFR-010)
- [x] T025 [P] Write failing header/CSP tests for nonce propagation, required origins, forbidden wildcards/unsafe-eval, HSTS, frame, MIME, referrer, and permissions policies in `tests/integration/security-headers.test.ts` (NFR-011, SEC-016)
- [x] T026 Implement nonce-based CSP and the approved security headers with least-required GTM origins in `proxy.ts` and `next.config.ts` (NFR-011, SEC-016, R-008)
- [x] T027 Create the semantic root layout, optimized licensed font loading, global skip/focus behavior, and non-blocking content shell in `app/layout.tsx` and `app/globals.css` (NFR-001-NFR-003, NFR-007, NFR-013)
- [x] T028 [P] Create synthetic factories, PII-safe assertions, database cleanup, `dataLayer` capture, and axe helpers in `tests/fixtures/lead.ts` and `tests/helpers/` (NFR-010, SEC-013, SC-007)
- [x] T029 Replay migrations from empty, test the documented failure/recovery path, and record results without database values in `reports/claude-execution-003-landing-assistencia-tecnica.md` (SEC-015, SC-010, CTR-004)

**Checkpoint**: Shared trust boundary, database integrity, analytics filtering, headers, and test
harnesses pass before any story UI/action is completed.

---

## Phase 3: User Story 1 - Recognize Problem and Proposed Value (Priority: P1) MVP

**Goal**: Deliver an honest, accessible intake-to-warranty narrative and clear pilot CTA without
requiring the form backend to understand the proposition.

**Independent Test**: At both target viewports, a first-time visitor identifies audience, validation
status, promise, CTA, ordered lifecycle, concept labels, fit/non-fit, and pilot expectations.

### Tests for User Story 1

- [x] T030 [P] [US1] Write failing content/metadata tests for hero truthfulness, eleven sections, lifecycle order, concept labels, exclusions, FAQ, and forbidden claims/proof in `tests/unit/landing-content.test.tsx` (FR-001-FR-010, SC-001, SC-002, SC-013)
- [x] T031 [P] [US1] Write failing E2E first-viewport, CTA focus target, heading/landmark, concept-label, and no-console-error assertions in `tests/e2e/landing.spec.ts` (FR-002-FR-006, NFR-001, SC-001)
- [x] T032 [P] [US1] Write failing target-viewport, 200%-zoom, long-label, reduced-motion, and critical-asset-fallback assertions in `tests/e2e/landing-responsive.spec.ts` (NFR-003, NFR-004, NFR-012, SC-008)

### Implementation for User Story 1

- [x] T033 [P] [US1] Implement the hero, validation notice, promise, primary CTA, and recognizable bench/process scene in `components/marketing/hero.tsx` and `components/marketing/current-process.tsx` (FR-002-FR-004, SC-001)
- [x] T034 [P] [US1] Implement the ordered intake-to-warranty lifecycle with full non-color labels and mobile transformation in `components/marketing/repair-lifecycle.tsx` (FR-005, NFR-004, SC-002)
- [x] T035 [P] [US1] Implement the explicitly labeled conceptual device record/timeline/quote without realistic PII or available-product behavior in `components/marketing/product-vision.tsx` (FR-006, FR-009, SC-002, SC-013)
- [x] T036 [P] [US1] Implement benefits, audience fit/non-fit, pilot explanation, semantic FAQ, and validation footer in `components/marketing/benefits.tsx`, `components/marketing/audience-fit.tsx`, `components/marketing/pilot.tsx`, `components/marketing/faq.tsx`, and `components/marketing/footer.tsx` (FR-007-FR-010, FR-036)
- [x] T037 [US1] Compose all eleven content areas in the required order and connect CTA focus/scroll behavior in `app/(marketing)/assistencia-tecnica/page.tsx` (FR-003-FR-008)
- [x] T038 [US1] Add unique title, description, absolute canonical, Open Graph, and search-intent metadata using the validated site origin in `app/(marketing)/assistencia-tecnica/page.tsx` (FR-001)
- [x] T039 [US1] Apply `DESIGN.md` hierarchy, spacing, restrained amber use, shape/motion rules, and content fallbacks across `app/globals.css` and `components/marketing/` (NFR-002-NFR-004, NFR-013)
- [x] T040 [US1] Run US1 tests and an Impeccable critique snapshot, fix all P0/P1 truthfulness/hierarchy issues, and record evidence in `reports/claude-execution-003-landing-assistencia-tecnica.md` (FR-001-FR-010, NFR-013)

**Checkpoint**: US1 is independently deployable as an honest explanatory landing with a form target
placeholder, not as a working SaaS.

---

## Phase 4: User Story 2 - Register Qualified Interest Safely (Priority: P1)

**Goal**: Deliver the accessible two-step, server-validated, persisted, idempotent conversion.

**Independent Test**: A synthetic visitor completes in about two minutes; invalid/error states are
recoverable; one unique row is stored; inserted and duplicate public outcomes match; redirect occurs
only on success.

### Tests for User Story 2

- [x] T041 [P] [US2] Write failing component tests for step progress, visible labels, fieldsets/legends, selection bounds, consent, focus, preserved values, pending/double-click, errors, and retry in `tests/unit/lead-interest-form.test.tsx` (FR-011-FR-025, NFR-001, NFR-008)
- [x] T042 [P] [US2] Write failing Server Action integration tests for authoritative values, explicit insert mapping, first insert, sequential/concurrent duplicate, database error, honeypot, and public-result equality in `tests/integration/submit-lead.test.ts` (FR-022-FR-028, SEC-015, SEC-016, CTR-001)
- [x] T043 [P] [US2] Write failing E2E valid conversion, invalid correction, slow pending, database failure/retry, consent, duplicate, and correct redirect assertions in `tests/e2e/lead-conversion.spec.ts` (FR-011-FR-029, SC-003-SC-005)
- [x] T044 [P] [US2] Write failing form/thank-you axe and keyboard tests for both target viewports in `tests/e2e/conversion-accessibility.spec.ts` (NFR-001-NFR-004, SC-008)

### Implementation for User Story 2

- [x] T045 [P] [US2] Implement the accessible form shell, two-minute estimate, progress semantics, focus management, and `useActionState` integration in `components/forms/lead-interest-form.tsx` (FR-011, FR-022, NFR-001)
- [x] T046 [P] [US2] Implement contact/profile fields with real labels, clear required/optional copy, autocomplete, and safe value preservation in `components/forms/contact-step.tsx` (FR-012, FR-014, FR-022)
- [x] T047 [P] [US2] Implement bounded business-context controls, 1-5 priority selection, separate interview permission, unchecked privacy consent, and privacy link in `components/forms/context-step.tsx` (FR-013, FR-015-FR-021, FR-035)
- [x] T048 [US2] Implement pending, field/form error summary, live status, retry, back/forward, and double-submit states without layout shift in `components/forms/lead-interest-form.tsx` (FR-022, FR-025, NFR-001, NFR-009)
- [x] T049 [US2] Implement the explicit Server Action, trusted remapping, honeypot handling, safe error boundary, and constant success redirect contract in `lib/actions/submit-lead.ts` (FR-022, FR-025-FR-028, SEC-015, SEC-016)
- [x] T050 [US2] Implement parameterized insert-on-conflict-no-update and indistinguishable inserted/existing results in `lib/actions/submit-lead.ts` and `lib/db.ts` (FR-023, FR-024, SC-004)
- [x] T051 [US2] Persist shared columns, structured answers, attribution, consent version/time, and null optional values exactly as `data-model.md` defines in `lib/actions/submit-lead.ts` (FR-026, FR-027, NFR-010)
- [x] T052 [US2] Implement the allowed thank-you state with validation/interview/pilot copy and no submit-conversion-on-direct-load behavior in `app/obrigado/page.tsx` (FR-028, FR-029)
- [x] T053 [US2] Integrate the real form target with all landing CTAs and preserve semantic focus/navigation in `app/(marketing)/assistencia-tecnica/page.tsx` (FR-003, FR-011)
- [x] T054 [US2] Run US2 unit/integration/E2E/axe suites and verify one row under concurrent duplicate attempts using synthetic data in `reports/claude-execution-003-landing-assistencia-tecnica.md` (SC-003-SC-005, SC-008)
- [x] T055 [US2] Record migration files, idempotency evidence, safe failure behavior, and any database-provider-neutral decision in `reports/claude-execution-003-landing-assistencia-tecnica.md` (FR-023-FR-029, SEC-022)

**Checkpoint**: US2 provides the experiment's complete qualified conversion without analytics.

---

## Phase 5: User Story 3 - Preserve Attribution Without PII (Priority: P2)

**Goal**: Measure the defined funnel and campaign context without coupling analytics to persistence
or exposing contact/answer data.

**Independent Test**: Captured `dataLayer` contains only approved events/properties with correct
cardinality; GTM failure does not affect conversion; direct thanks cannot create submit success.

### Tests for User Story 3

- [x] T056 [P] [US3] Write failing attribution parsing/bounds/unknown-key and `gclid_present` tests in `tests/unit/attribution.test.ts` (FR-030, FR-032, SEC-016)
- [x] T057 [P] [US3] Write failing E2E event order/cardinality tests for valid, invalid, retry, duplicate, back navigation, direct thanks, and double click in `tests/e2e/analytics.spec.ts` (FR-031-FR-034, SC-006)
- [x] T058 [P] [US3] Write failing E2E blocked-GTM and PII/open-answer/raw-gclid exclusion tests in `tests/e2e/analytics-privacy.spec.ts` (FR-032-FR-034, NFR-010, SC-007)

### Implementation for User Story 3

- [x] T059 [P] [US3] Implement server-derived, bounded attribution parsing and pass only approved initial values to the form in `lib/analytics/attribution.ts` and `app/(marketing)/assistencia-tecnica/page.tsx` (FR-030, SEC-016)
- [x] T060 [US3] Wire the nine fixed funnel events with one-time guards and approved context into `components/forms/lead-interest-form.tsx`, `components/marketing/primary-cta.tsx`, and `app/obrigado/page.tsx` (FR-031-FR-033)
- [x] T061 [US3] Add the non-blocking nonce-aware GTM loader with validated public ID and failure isolation in `app/layout.tsx` and `components/analytics/google-tag-manager.tsx` (FR-034, NFR-007, NFR-011)
- [x] T062 [P] [US3] Document exact GTM variables, triggers, tags, GA4 mapping, Google Ads success-only conversion, preview/readback, and prohibited data in `docs/analytics-setup.md` (FR-031-FR-037, CTR-002)
- [x] T063 [US3] Validate final CSP destinations against the approved GTM container and update only narrowly required origins in `proxy.ts` with evidence in `reports/claude-execution-003-landing-assistencia-tecnica.md` (NFR-011, SEC-016)
- [x] T064 [US3] Inspect `dataLayer`, network requests, console, client bundles, and screenshots for forbidden PII/open answers and record sanitized evidence in `reports/claude-execution-003-landing-assistencia-tecnica.md` (NFR-010, SC-007)
- [x] T065 [US3] Run US3 suites with GTM enabled and blocked, then record event/property/cardinality and external GTM configuration blockers in `reports/claude-execution-003-landing-assistencia-tecnica.md` (SC-006, SC-007)

**Checkpoint**: US3 provides privacy-safe measurement; missing production IDs remain an explicit
campaign blocker, not a reason to hardcode values.

---

## Phase 6: User Story 4 - Understand Privacy and Deletion (Priority: P2)

**Goal**: Give participants clear Portuguese privacy purpose, rights/contact, retention, and a safe
operational deletion procedure without adding an admin product.

**Independent Test**: Privacy content and form consent are clear; synthetic deletion targets only
the verified record; placeholders block production rather than being published.

### Tests for User Story 4

- [x] T066 [P] [US4] Write failing privacy-content tests for purpose, categories, consent, analytics boundary, retention, deletion, controller/contact, rights, and placeholder production blocking in `tests/unit/privacy-page.test.tsx` (FR-035, NFR-010)
- [x] T067 [P] [US4] Write failing synthetic target-only deletion, cross-vertical scope, failure, and no-PII-log procedure tests in `tests/integration/lead-deletion.test.ts` (FR-035, NFR-010, CTR-004)

### Implementation for User Story 4

- [x] T068 [P] [US4] Implement the clear Portuguese privacy page using validated public policy values and fail-closed production placeholders in `app/privacidade/page.tsx` (FR-035, PD-003)
- [x] T069 [P] [US4] Write the authorized least-privilege request verification, hard-deletion, failure escalation, backup limitation, and retention procedure in `docs/lead-deletion.md` (FR-035, CTR-004)
- [x] T070 [US4] Connect privacy/contact links and consent purpose consistently across `components/forms/context-step.tsx`, `components/marketing/footer.tsx`, and `app/privacidade/page.tsx` (FR-035, FR-036)
- [x] T071 [US4] Document environment ownership, production placeholder gates, controller/contact/retention approval, and safe local setup in `README.md` and `docs/security-operations.md` (PD-001-PD-005, CTR-003)
- [x] T072 [US4] Execute the synthetic deletion/readback scenario without copying PII and record only sanitized ticket/outcome evidence in `reports/claude-execution-003-landing-assistencia-tecnica.md` (NFR-010, SC-007)
- [x] T073 [US4] Run US4 tests and verify consent remains unselected and production fails closed without approved privacy values in `reports/claude-execution-003-landing-assistencia-tecnica.md` (FR-035, SC-014)

**Checkpoint**: US4 is complete; real owner/legal values are still required before production.

---

## Phase 7: Impeccable, Cross-Cutting Verification, and Handoff Evidence

**Purpose**: Prove the whole implementation against all requirements without weakening any gate.

- [x] T074 Run Impeccable `critique` on `/assistencia-tecnica`, fix all P0/P1 and justified P2 findings, and record before/after evidence in `reports/claude-execution-003-landing-assistencia-tecnica.md` (NFR-013, SC-001, SC-013)
- [x] T075 Run Impeccable `adapt` for 390x844, 1440x900, 200% zoom, long Portuguese copy, slow network, and reduced motion; fix findings in `app/` and `components/` and record evidence in `reports/claude-execution-003-landing-assistencia-tecnica.md` (NFR-003, NFR-004, NFR-012)
- [x] T076 Run Impeccable `audit` for accessibility, performance, responsive behavior, anti-patterns, content truthfulness, and dependency impact; fix findings and record evidence in `reports/claude-execution-003-landing-assistencia-tecnica.md` (NFR-001-NFR-014)
- [x] T077 Run Impeccable `polish`, correct typography/rhythm/focus/motion/copy details without scope expansion, and record final evidence in `reports/claude-execution-003-landing-assistencia-tecnica.md` (NFR-013, SC-013)
- [x] T078 [P] Capture reviewed 390x844 and 1440x900 landing/form/error/success screenshots with synthetic data only in `reports/screenshots/003-landing-assistencia-tecnica/` (NFR-004, SC-008)
- [x] T079 Execute the full keyboard, axe, contrast, focus, heading, label/error, reduced-motion, asset-fallback, and 200%-zoom audit and append results to `reports/claude-execution-003-landing-assistencia-tecnica.md` (NFR-001-NFR-004, SC-008)
- [x] T080 Execute locked Lighthouse CI against a production build/preview, meet every threshold, and record the repeatable profile/report paths in `reports/claude-execution-003-landing-assistencia-tecnica.md` (NFR-005-NFR-007, SC-009)
- [x] T081 Replay migrations, first/duplicate/concurrent persistence, database failure recovery, and synthetic deletion end-to-end; append sanitized results to `reports/claude-execution-003-landing-assistencia-tecnica.md` (SC-003-SC-005, CTR-004)
- [x] T082 Reconcile `package.json` and `pnpm-lock.yaml` against the eight-field dependency table, licenses, unused-package review, Socket, audit, Trivy vulnerability/secret/misconfiguration outputs, and Trivy license result/applicability in `reports/claude-execution-003-landing-assistencia-tecnica.md` (SEC-002-SEC-007, SEC-011, SC-011)
- [x] T083 Run the ordered local pre-SAST gate through the Trivy vulnerability/secret/misconfiguration and license scans from `quickstart.md`, without force fixes or suppressed severity, and append exact versions, commands, exit codes, durations, and results to `reports/claude-execution-003-landing-assistencia-tecnica.md` (SEC-017-SEC-019, SC-010)
- [x] T084 Obtain and record the CI proof that CodeQL depended on successful Trivy and passed before the final E2E job, plus Dependabot/Socket/Secret Scanning/Push Protection/branch-protection readbacks or explicit blockers, in `reports/claude-execution-003-landing-assistencia-tecnica.md` (SEC-008-SEC-014, SEC-017, SC-010)
- [x] T085 After T084 passes, rerun final E2E and inspect CSP/headers, server/client boundaries, source maps/bundles, logs, errors, analytics, reports, screenshots, and git diff for secrets, PII, unsafe inputs, unpinned actions, out-of-scope code, and silent exceptions in `reports/claude-execution-003-landing-assistencia-tecnica.md` (SEC-012-SEC-023, SC-007, SC-013)
- [x] T086 Finalize `reports/claude-execution-003-landing-assistencia-tecnica.md` with required documents-read list, summary, branch/commit, file changes, task status, decisions, dependency table, licenses, tests/build/scanners, analytics, migrations, screenshots, risks, limitations, deviations, exceptions, security section, and local-run instructions (SEC-002, SEC-020-SEC-023)
- [x] T087 Record every campaign release-gate item as PASS or BLOCKED with evidence/owner, never self-approve, and hand the completed report/diff to Codex in `reports/claude-execution-003-landing-assistencia-tecnica.md` (NFR-014, SC-014)

**Final checkpoint**: Claude Code may report implementation complete but may not declare the feature
approved or release paid traffic. Only independent Codex QA can issue the final status.

---

## Phase 8: Convergence

Appended by independent Codex QA (2026-07-10) after Spec Kit Converge against the implemented
codebase. Do not rewrite or renumber T001–T087. Complete these before requesting re-review.

- [x] T088 CRITICAL Preserve submitted form values on honeypot/`error` responses via `safeValues(formData)` (excluding the honeypot field) in `lib/actions/submit-lead.ts`, matching CTR-001 public-result rules, and add an integration assertion that honeypot responses keep non-empty echoed values without revealing the mechanism (CTR-001, FR-025) (contradicts)
- [x] T089 Add an explicit footer contact/deletion-channel link (for example to `/privacidade#direitos` or the configured contact when present) in `components/marketing/footer.tsx` and extend the FR-036 unit assertion so privacy and contact are both covered (FR-036, T070) (missing)
- [x] T090 Redesign the signature lifecycle in `components/marketing/repair-lifecycle.tsx` as a ledger/evidence-strip sequence (not eight identical bordered cards), keep the single numbered intake→warranty order, and record Impeccable critique/adapt evidence that the P1 card-grid finding is closed (NFR-013, DESIGN.md Lifecycle, SC-013) (contradicts)
- [x] T091 Restore the restrained amber budget: amber only for primary CTA, one active lifecycle step, visible focus, and ≤1–2 emphasis moments; demote non-active stage labels/status pills from accent wallpaper in marketing components and re-check contrast (NFR-013, DESIGN.md Colors) (contradicts)
- [x] T092 Reduce Step-2 cognitive load for `priority_features` (group into workshop categories or progressive disclosure while keeping the 1–5 unique selection rule and the thirteen storage slugs from `data-model.md`) in `components/forms/` (NFR-013, design-brief §Key States, FR-019) (partial)
- [x] T093 Sync `CheckboxGroupField` checked state from server-echoed `values.priority_features` on invalid/error re-render in `components/forms/fields.tsx` so FR-022 value preservation works for multi-select (FR-022, CTR-001) (partial)
- [x] T094 Replace uppercase tracked “conceito” micro-labels with sentence-case concept badges in `components/marketing/product-vision.tsx` (and any matching kickers) per DESIGN.md anti-eyebrow rule (NFR-013) (contradicts)
- [x] T095 Resolve `output: "standalone"` vs documented `pnpm start` / Playwright / Lighthouse webServer path: either keep standalone only for Docker and restore a non-standalone local start path, or update `playwright.config.ts`, `lighthouserc.json`, and README/quickstart to the supported standalone server entry without breaking E2E/LHCI (plan §Ordered CI, D-5, NFR-005) (partial)
- [x] T096 Record the Atkinson Hyperlegible (classic) vs DESIGN.md “Atkinson Hyperlegible Next” decision and license evidence in the execution report / PD-006 note without inventing a brand mark (NFR-007, PD-006) (partial)
- [x] T097 Re-run Impeccable `critique`, `adapt`, `audit`, and `polish` after T088–T096, remediate remaining P0/P1, and append before/after evidence so T074–T077 claims match independent QA (NFR-013, SC-013) (partial)

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 has no implementation prerequisite beyond the planning package and Node LTS.
- Phase 2 depends on Phase 1 and blocks every user story.
- US1 and the tested portions of US2 may proceed after Phase 2; the recommended order remains US1 ->
  US2 -> US3 -> US4 to preserve an inspectable MVP.
- US3 depends on US2 public action outcomes and thank-you behavior.
- US4 privacy content is linked from US1/US2 and must be complete before the full flow passes.
- Phase 7 depends on all included user stories and cannot bypass any earlier failed security gate.

### User Story Dependencies

- **US1**: Independent content/design MVP after Phase 2.
- **US2**: Independent qualified conversion after Phase 2; integrates into US1 CTA target.
- **US3**: Depends on US2 outcomes but analytics failure remains behaviorally isolated.
- **US4**: Behaviorally independent page/procedure; required by US2 consent and campaign release.

### Parallel Opportunities

- Phase 1 configuration tasks marked `[P]` can run after the initial manifest/lockfile exists.
- Phase 2 test files can be authored in parallel; each implementation waits for its failing tests.
- US1 marketing components T033-T036 are parallel after their tests.
- US2 contact/context UI tasks are parallel; action/persistence remains sequential.
- US3 documentation can proceed with analytics implementation after the event contract is fixed.
- US4 page and procedure docs are parallel after their failing tests.
- Screenshot capture is parallel with dependency reconciliation only after final code is stable.

## Parallel Examples

### US1

```text
T033 hero/current process | T034 lifecycle | T035 concept view | T036 fit/pilot/FAQ/footer
```

### US2

```text
T041 component tests | T042 action integration tests | T043 conversion E2E | T044 axe/keyboard E2E
```

### US3

```text
T056 attribution unit tests | T057 event E2E | T058 privacy/blocked-GTM E2E
```

### US4

```text
T066 privacy requirements tests | T067 deletion integration tests
```

## Implementation Strategy

### MVP First

1. Finish secure Setup and Foundational phases.
2. Complete US1 and demonstrate the honest narrative independently.
3. Complete US2 and validate unique persistence/idempotency before analytics.
4. Add US3 and US4 without changing the conversion or scope.
5. Execute Phase 7 in full; no “later security pass” is allowed.

### Stop Conditions

Stop at the safe boundary and record a blocker if any Critical/High/secret finding exists, a scanner
cannot run, a new dependency lacks evidence, production requires invented privacy/analytics values,
the fixed stack cannot satisfy a requirement, or a change would implement excluded SaaS scope.

## Task Count Summary

- Setup: 14 tasks
- Foundational: 15 tasks
- US1: 11 tasks
- US2: 15 tasks
- US3: 10 tasks
- US4: 8 tasks
- Cross-cutting/final evidence: 14 tasks
- **Total: 87 tasks**
