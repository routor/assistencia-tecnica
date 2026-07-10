# Pending Decisions, Impediments, and Risk Register

## Owner Decisions (updated 2026-07-10)

Canonical detail: `owner-decisions-2026-07-10.md`. CTR-005 for R-2:
`contracts/security-exception-r2-sharp-libvips.md`.

| ID | Decision/input | Status | Residual blocking effect |
|---|---|---|---|
| PD-001 | Neon PostgreSQL; isolated Prod/Preview branches; server-only `DATABASE_URL` | **RESOLVED** | Wire real Neon URLs in Vercel (not in git) |
| PD-002 | Provisional brand **Assistência Técnica Pro**; contact Rafael Outor / `rafael.outor@gmail.com`; no logo | **RESOLVED** | Rename later if brand finalizes |
| PD-003 | Controller + `rafael.outor@gmail.com` + `LEAD_RETENTION_DAYS=180` | **RESOLVED** | Set same values in Vercel Preview/Prod env |
| PD-004 | No invented domain/GTM; Preview = Vercel URL non-indexed; real canonical + GTM later | **PARTIAL** | **Campaign / Production ready BLOCKED** until real `NEXT_PUBLIC_SITE_URL` + `NEXT_PUBLIC_GTM_ID` (+ GA4/Ads in GTM) |
| PD-005 | GitHub security + Socket on `routor/assistencia-tecnica` + `main` protection | **PARTIAL** | Socket install/first-scan readback; confirm branch-protection readback |
| PD-006 | Atkinson Hyperlegible Classic + Geologica via `next/font` | **RESOLVED** | None for fonts |
| R-2 | Keep `sharp`; accept LGPL libvips via CTR-005 | **RESOLVED** | Re-review by 2026-10-10 |
| D-1 | Migrate Impeccable settings into project `.claude/`; remove parent file | **RESOLVED** (execute migrate) | None after file move |

## Tooling and Repository Impediments

| ID | Impediment | Impact | Disposition |
|---|---|---|---|
| CIR-001 | `node` is unavailable in the planning environment. | Impeccable scripts/runtime commands and project install could not run. | Recorded; Claude must establish Node 24 LTS, security-review/install exact-version project Impeccable for both agents, and rerun all runtime/design gates. |
| CIR-002 | Git root historically above this project with neighbors; project now has own git remote. | Broad parent operations could alter neighbors. | Prefer project-local git (`routor/assistencia-tecnica`); never touch neighbors; D-1 removes parent Impeccable hook. |
| CIR-003 | Security-service settings require external administrator permissions. | Code alone cannot prove enablement. | Require readback or mark the related release gate BLOCKED. Socket still needs Marketplace install evidence. |
| CIR-004 | Production canonical domain / GTM / GA4 / Ads values still absent. | Campaign acceptance cannot complete. | Fail closed; do not invent or hardcode (PD-004). |
| CIR-006 | Spec Kit context hook lacked system PyYAML. | Automatic AGENTS update skipped. | AGENTS pointer was written and checked manually; no unplanned Python install. |

## Risk Register

| Risk | Likelihood | Impact | Mitigation / evidence | Owner / gate |
|---|---|---|---|---|
| Dependency compromise or typosquatting | Medium | Critical | Minimal packages, frozen lockfile, Socket, Trivy, audit, SHA-pinned actions, Codex review | Claude + Codex; PR block |
| Secret committed or exposed to client/report | Medium | Critical | Env partition, Trivy secret, GitHub scanning/push protection, bundle/diff/report inspection, rotation procedure | Claude + admin + Codex; immediate block |
| High/Critical vulnerability or SAST path | Medium | High/Critical | Ordered audit/Trivy/CodeQL, severity policy, source-to-sink review, no silent exception | Claude + Codex; delivery block |
| Spam or concurrent duplicate leads | Medium | Medium | Bounds, honeypot, pending state, DB unique constraint, conflict no-update, integration tests | Claude; conversion gate |
| Participant-membership disclosure | Low | High | Identical inserted/existing public result; no database ID/status | Claude + Codex; privacy gate |
| Browser/Ads success overcounts genuine repeats | Medium | Medium | Unique stored rows are canonical metric; campaign reporting discloses distinction | Validation owner; analytics review |
| PII sent to analytics/logs/screenshots | Medium | High | Event allowlist, no raw gclid/answers, tests, network/log/bundle/manual inspection | Claude + Codex; delivery block |
| CSP broken or weakened for GTM | Medium | High | Nonce policy, narrow origins, header tests, final container destination review | Claude + Codex; conversion/security gate |
| Database/provider coupling | Low | Medium | Standard PostgreSQL URL, Drizzle/Postgres.js, Neon branches only, no proprietary API | Claude; architecture gate |
| Privacy policy published with placeholders/indefinite retention | Medium | High | PD-003 resolved values in env; release checklist; deletion procedure | Owner + Codex; production block if env missing |
| Dark UI loses contrast/readability | Medium | High | Measured WCAG AA, axe/manual contrast, high-legibility typography, target screenshots | Claude + Codex; accessibility gate |
| Visual drift to generic AI/cyber/fake dashboard | Medium | Medium | DESIGN/brief, concept labels, Impeccable passes, anti-pattern checklist | Claude + Codex; visual gate |
| Analytics blocks form or false thank-you conversion | Low | High | Failure isolation, action-governed success, direct-thanks tests, blocked-GTM E2E | Claude; analytics gate |
| Performance targets missed by fonts/scripts/assets | Medium | Medium | Optimized fonts, minimal client boundary, non-blocking GTM, Lighthouse CI | Claude; performance gate |
| Unrelated parent-repository files modified | Low | High | Project-scoped git review and file list reconciliation | Claude + Codex; handoff block |
| External security controls unavailable | Medium | High | Capability readback and explicit BLOCKED state; never claim pass | Admin + Codex; production block |
| LGPL obligations for libvips misunderstood | Low | Medium | CTR-005 R-2 accepted; unmodified dynamic link; review by 2026-10-10 | Owner + Codex |

## Security Exceptions

| ID | Component | Status | Accepting owner | Review deadline |
|---|---|---|---|---|
| R-2 / `TRIVY-LICENSE-LGPL-sharp-libvips` | `sharp@0.34.5` + `@img/sharp-libvips-*@1.2.4` | `accepted_temporarily` | Rafael Outor | 2026-10-10 |

Full CTR-005 record: `contracts/security-exception-r2-sharp-libvips.md`.
