# Traceability Matrix: Landing Assistência Técnica

**Scope**: Specification -> tasks -> tests/evidence -> security controls

**Coverage target**: 100% of FR, NFR, SEC, and buildable SC identifiers

## Functional Requirements

| Requirement | Primary tasks | Planned tests / evidence | Security controls |
|---|---|---|---|
| FR-001 | T030, T038 | `landing-content.test.tsx`; metadata inspection | SEC-016 |
| FR-002 | T030, T031, T033 | content + first-viewport E2E/screenshots | SEC-021 |
| FR-003 | T031, T033, T037, T053 | CTA focus/keyboard E2E | SEC-016 |
| FR-004 | T030, T033-T037 | eleven-section content test | SEC-021 |
| FR-005 | T030, T034, T037 | lifecycle order content/E2E | SEC-021 |
| FR-006 | T030, T031, T035 | concept-label and truthfulness inspection | SEC-021 |
| FR-007 | T030, T036 | segment-domain content test | SEC-021 |
| FR-008 | T030, T036, T037 | fit/non-fit content test | SEC-021 |
| FR-009 | T030, T035, T040, T085 | forbidden-proof scan + Codex content review | SEC-021, SEC-023 |
| FR-010 | T030, T036, T040 | forbidden-claim scan | SEC-021, SEC-023 |
| FR-011 | T041, T043, T045, T053 | form component + conversion E2E | SEC-016 |
| FR-012 | T021, T041, T046 | schema boundaries + form labels | SEC-016 |
| FR-013 | T021, T041, T047 | schema + grouped control/consent tests | SEC-016 |
| FR-014 | T021, T022, T046 | category enum/boundary tests | SEC-016 |
| FR-015 | T021, T022, T047 | team-size enum tests | SEC-016 |
| FR-016 | T021, T022, T047 | monthly-intake enum tests | SEC-016 |
| FR-017 | T021, T022, T047 | current-process enum tests | SEC-016 |
| FR-018 | T021, T022, T047 | bottleneck enum tests | SEC-016 |
| FR-019 | T021, T022, T047 | priority enum/unique/1-5 tests | SEC-016 |
| FR-020 | T021, T022, T047 | frequency enum tests | SEC-016 |
| FR-021 | T021, T022, T047 | price-range enum tests | SEC-016 |
| FR-022 | T021, T041-T049 | boundary, component, action, E2E error tests | SEC-015, SEC-016 |
| FR-023 | T017, T018, T042, T050 | schema/action sequential + concurrent tests | SEC-015, SEC-016 |
| FR-024 | T017, T042, T050, T054 | duplicate/concurrency row-count evidence | SEC-015 |
| FR-025 | T021, T041-T049 | honeypot + double-submit tests | SEC-016 |
| FR-026 | T017-T019, T042, T051 | schema/migration/action mapping tests | SEC-015, SEC-016 |
| FR-027 | T021, T042, T049, T051 | manipulated vertical/path tests | SEC-016 |
| FR-028 | T042, T043, T049, T052 | success/error redirect E2E | SEC-016 |
| FR-029 | T030, T052 | thank-you content/direct navigation test | SEC-021 |
| FR-030 | T056, T059 | attribution bounds/hostile input tests | SEC-016 |
| FR-031 | T023, T057, T060 | vocabulary/order/cardinality tests | SEC-016 |
| FR-032 | T023, T056-T060, T064 | allowlist + PII network/dataLayer inspection | SEC-013, SEC-016 |
| FR-033 | T023, T057, T060 | exactly-once success/Ads trigger evidence | SEC-016 |
| FR-034 | T023, T058, T061, T065 | blocked-GTM E2E | SEC-016 |
| FR-035 | T041, T066-T073 | privacy content, consent, deletion tests | SEC-013, SEC-015, SEC-016 |
| FR-036 | T030, T036, T070 | footer/privacy/contact link tests | SEC-021 |
| FR-037 | T062, T069, T071 | documentation review/readback | SEC-010-SEC-014, SEC-022 |

## Non-Functional Requirements

| Requirement | Primary tasks | Planned tests / evidence | Security controls |
|---|---|---|---|
| NFR-001 | T006, T027, T031, T041, T044-T048, T079 | keyboard, semantic, label/error/focus E2E | SEC-016 |
| NFR-002 | T005, T007, T032, T044, T079 | axe + measured contrast | SEC-017 |
| NFR-003 | T032, T039, T075, T079 | reduced-motion/default-visible tests | SEC-017 |
| NFR-004 | T007, T032, T034, T044, T075, T078-T079 | viewport/zoom screenshots and E2E | SEC-017 |
| NFR-005 | T008, T080 | locked Lighthouse report | SEC-002, SEC-017 |
| NFR-006 | T008, T080 | LCP/CLS Lighthouse report | SEC-002, SEC-017 |
| NFR-007 | T008, T027, T061, T080 | bundle/script/Lighthouse evidence | SEC-002, SEC-016 |
| NFR-008 | T041, T043, T045 | timed representative flow evidence | SEC-017 |
| NFR-009 | T042, T048-T049 | database/unexpected-error tests | SEC-013, SEC-016 |
| NFR-010 | T015-T016, T023-T024, T028, T042, T051, T058, T064, T067, T072, T085 | PII-safe unit/integration/E2E/manual inspection | SEC-012-SEC-016 |
| NFR-011 | T025-T026, T063, T085 | header integration + preview inspection | SEC-016, SEC-020 |
| NFR-012 | T007, T032, T043-T044, T075 | Chromium/slow-network/viewport E2E | SEC-017 |
| NFR-013 | T005, T039-T040, T074-T077 | Impeccable reports and visual evidence | SEC-021-SEC-023 |
| NFR-014 | T009-T014, T073, T083-T087 | ordered gate and campaign matrix | SEC-001-SEC-023 |

## Security and Supply-Chain Requirements

| Requirement | Primary tasks | Test / evidence | Related controls |
|---|---|---|---|
| SEC-001 | T010, T014, T083, T086 | CI/local ordered gate report | Constitution III |
| SEC-002 | T002, T014, T082, T086 | eight-field dependency/license table | Socket, Trivy, Codex review |
| SEC-003 | T002, T082, T085 | manifest/lockfile diff review | Codex review |
| SEC-004 | T002-T003, T010, T083 | frozen-install CI evidence | pnpm lockfile |
| SEC-005 | T014, T082-T083 | `pnpm audit --audit-level high` | Trivy complementary |
| SEC-006 | T010, T014, T082-T083 | exact Trivy command/version/output | Trivy vuln/secret/misconfig |
| SEC-007 | T014, T083, T086 | zero unaccepted High/Critical | severity policy |
| SEC-008 | T011, T084 | CodeQL workflow/run/readback | SAST |
| SEC-009 | T011, T084-T086 | finding assessment and closure | severity policy/Codex |
| SEC-010 | T012, T084 | Dependabot settings/config/PR policy | no auto-merge |
| SEC-011 | T013-T014, T082, T084 | Socket report/readback | dependency-change gate |
| SEC-012 | T009, T013, T084-T085 | GitHub + Trivy secret readback | Push Protection |
| SEC-013 | T009, T015-T016, T020, T028, T058, T064, T072, T085 | bundle/log/report/secret inspection | secret stores |
| SEC-014 | T013, T084-T086 | incident procedure/readback or none-found | revoke/rotate/history review |
| SEC-015 | T017-T020, T042, T049-T051, T067, T081, T085 | parameterization, migration, deletion tests | least-privilege DB |
| SEC-016 | T021-T026, T042, T049, T056-T064, T085 | hostile input, authority, CSP, bundle tests | server trust boundary |
| SEC-017 | T010, T083-T084 | ordered local/CI gate | report + Codex review |
| SEC-018 | T013-T014, T083-T086 | severity disposition table | Critical/High block |
| SEC-019 | T013, T083, T085-T086 | no force fix/suppression inspection | targeted upgrade review |
| SEC-020 | T013, T063, T085-T086 | CTR-005 exception record or none | accountable owner/deadline |
| SEC-021 | T001, T040, T074-T077, T085-T087 | agent rules, Impeccable and deviation evidence | role separation |
| SEC-022 | T001-T002, T014, T055, T064-T065, T072-T073, T080-T087 | complete execution report | mandatory security section |
| SEC-023 | T084-T087 | independent-review handoff/readback | Codex decision |
| SEC-024 | T085-T087 | future-artifact applicability statement | govulncheck/container trigger |

## Success Criteria

| Criterion | Primary tasks | Acceptance evidence | Security controls |
|---|---|---|---|
| SC-001 | T030-T033, T037, T040, T074 | first-viewport tests/screenshots/critique | SEC-021, SEC-023 |
| SC-002 | T030, T034-T035, T040 | lifecycle/concept-label tests | SEC-021 |
| SC-003 | T041-T055, T081 | timed valid conversion + stored row | SEC-015, SEC-016 |
| SC-004 | T017-T018, T042, T050, T054, T081 | sequential/concurrent duplicate evidence | SEC-015 |
| SC-005 | T041-T049, T054, T081 | invalid/bot/error/retry E2E | SEC-016 |
| SC-006 | T023-T024, T057, T060, T065 | event/cardinality/Ads trigger capture | SEC-016 |
| SC-007 | T023-T024, T028, T058, T064, T067, T072, T085 | PII scans/network/bundle/log/report inspection | SEC-012-SEC-016 |
| SC-008 | T007, T032, T044, T075, T078-T079 | axe/keyboard/zoom/viewport evidence | SEC-017 |
| SC-009 | T008, T080 | Lighthouse thresholds/report | SEC-002, SEC-017 |
| SC-010 | T001, T010-T014, T029, T083-T086 | ordered gates/scanner/CI report | SEC-001-SEC-023 |
| SC-011 | T002, T014, T082, T086 | dependency rows/licenses/lockfile | SEC-002-SEC-011 |
| SC-012 | T086-T087 | this matrix + completed task/report mapping | SEC-022, SEC-023 |
| SC-013 | T030, T035-T040, T074-T077, T085 | content/diff/Impeccable review | SEC-021, SEC-023 |
| SC-014 | T071, T073, T084, T087 | campaign PASS/BLOCKED matrix + Codex status | SEC-010-SEC-023 |

## Pending Decisions and Release Gates

| Decision | Implementation task(s) | Release evidence |
|---|---|---|
| PD-001 database provider | T020, T055, T071 | **RESOLVED 2026-07-10:** Neon + isolated branches; server-only `DATABASE_URL` (`owner-decisions-2026-07-10.md`) |
| PD-002 public brand/contact identity | T071, T074-T077 | **RESOLVED provisional:** Assistência Técnica Pro; Rafael Outor / `rafael.outor@gmail.com`; no logo |
| PD-003 controller/contact/retention | T068-T073, T087 | **RESOLVED:** controller + `rafael.outor@gmail.com` + 180 days |
| PD-004 canonical/GTM/Ads values | T038, T061-T065, T087 | **PARTIAL:** Preview=Vercel URL; campaign BLOCKED until real site URL + GTM |
| PD-005 repository security capability | T013, T084, T087 | **PARTIAL:** GH scanners/CodeQL ok; Socket + branch-protection evidence in progress |
| PD-006 font license | T002, T027, T074, T082 | **RESOLVED:** Atkinson Classic + Geologica via `next/font` |

## Coverage Statement

All 37 functional requirements, 14 non-functional requirements, 24 security requirements, 14
success criteria, and 6 pending decisions have task and evidence mappings. This document must be
updated by Claude Code only to append actual evidence references in its report; requirement meaning
may not be rewritten.

## Independent Codex QA Findings (2026-07-10)

| Finding | Severity | Requirement / control | Evidence | Convergence task | Status |
|---|---|---|---|---|---|
| Honeypot `error` returns `values: {}` | HIGH | CTR-001, FR-025 | fixed in `submit-lead.ts` + integration | T088 | **CLOSED** (re-review) |
| Footer lacks contact link | HIGH | FR-036 | `/privacidade#direitos` + unit test | T089 | **CLOSED** (re-review) |
| Lifecycle rendered as identical card grid | HIGH | NFR-013, DESIGN.md | ledger strip in `repair-lifecycle.tsx` | T090 | **CLOSED** (re-review) |
| Amber budget overused on all stages | HIGH | NFR-013 | lifecycle amber-free; accent restrained | T091 | **CLOSED** (re-review) |
| Step-2 `priority_features` 13-option wall | MEDIUM | NFR-013, design-brief | `PRIORITY_FEATURE_GROUPS` (5 groups) | T092 | **CLOSED** (re-review) |
| Checkbox group ignores server-echoed values | MEDIUM | FR-022 | `fields.tsx` echo sync | T093 | **CLOSED** (re-review) |
| Uppercase tracked “conceito” kickers | MEDIUM | NFR-013 | sentence-case badges | T094 | **CLOSED** (re-review) |
| `output:"standalone"` vs `pnpm start` path | MEDIUM | plan CI, D-5 | `BUILD_STANDALONE=1` Docker-only | T095 | **CLOSED** (re-review) |
| Atkinson classic vs “Next” undocumented | LOW | NFR-007, PD-006 | Owner approved Classic + Geologica | T096 | **CLOSED** (PD-006 2026-07-10) |
| Impeccable P1s remain after T074–T077 claim | HIGH | NFR-013, SC-013 | re-critique: no P0/P1 | T097 | **CLOSED** (re-review) |
| FR-019 “twelve” vs data-model 13 slugs | INFO | FR-019 / data-model | Spec wording stale; code matches data-model | — (Codex/spec note) | OPEN (spec) |
| CodeQL real CI run | BLOCKED→PASS | SEC-008/017, QA014 | https://github.com/routor/assistencia-tecnica/actions/runs/29117932826 (+ CI 29117934967) | external | **PASS** |
| Dependabot / Secret Scanning / Push Protection | BLOCKED→PASS | SEC-010-014, PD-005 | Enabled on public repo `routor/assistencia-tecnica` | external | **PASS** |
| Socket first-scan readback | BLOCKED | SEC-011, PD-005 | Install app only on this repo; evidence pending | owner/admin | **BLOCKED** |
| Branch protection `main` | BLOCKED→PASS | PD-005 | Ruleset `Protect main` `18789276` — https://github.com/routor/assistencia-tecnica/rules/18789276 | owner/admin | **PASS** |
| LGPL `sharp`/libvips license HIGH | OWNER | SEC-007 / CTR-005 | Exception accepted: `contracts/security-exception-r2-sharp-libvips.md` | owner | **ACCEPTED** (review 2026-10-10) |
| Parent Impeccable `settings.local.json` | OWNER | CIR-002 / D-1 | Migrated hooks into `assistencia-tecnica/.claude/settings.local.json`; parent file removed | owner | **CLOSED** |
| Privacy controller/contact/retention | BLOCKED | PD-003 | Owner values resolved; must be set in Vercel env | owner | **RESOLVED** (env wire-up) |
| Production DB provider | BLOCKED | PD-001 | Neon selected; wire Preview/Prod `DATABASE_URL` | owner | **RESOLVED** (env wire-up) |
| Canonical domain + GTM/GA4/Ads | BLOCKED | PD-004, SC-014 | Real values still absent; no invention | owner | **BLOCKED** (campaign) |

**Re-review decision:** `APPROVED_WITH_NOTES` — see `reports/codex-qa-rereview-convergence-01-003-landing-assistencia-tecnica.md`.
**Owner decisions:** `owner-decisions-2026-07-10.md` (campaign still BLOCKED on PD-004 + Socket readback).
