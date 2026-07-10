# Pending Decisions, Impediments, and Risk Register

## Pending Owner Decisions

| ID | Decision/input | Safe default now | Must be resolved by | Blocking effect |
|---|---|---|---|---|
| PD-001 | Neon or Supabase PostgreSQL and operational owner | Standard provider-neutral PostgreSQL contract | Before preview persistence ownership | Production persistence if absent |
| PD-002 | Final public brand/product name and contact identity | Neutral descriptive name; no logo | Before production content approval | Production/campaign |
| PD-003 | Controller identity, rights/deletion channel, retention period | Fail-closed placeholders; no invented period | Before production | Production/campaign |
| PD-004 | Canonical origin and GTM/GA4/Ads IDs | Validated optional local config | Before metadata/conversion acceptance | Campaign |
| PD-005 | GitHub/Socket administrators and entitlement | Config files + explicit BLOCKED readback | Before security approval | PR/production/campaign |
| PD-006 | Final font family/license approval | Documented Geologica + Atkinson proposal | Before visual production approval | Production if license/evidence absent |

## Tooling and Repository Impediments

| ID | Impediment | Impact | Disposition |
|---|---|---|---|
| CIR-001 | `node` is unavailable in the planning environment. | Impeccable scripts/runtime commands and project install could not run. | Recorded; Claude must establish Node 24 LTS, security-review/install exact-version project Impeccable for both agents, and rerun all runtime/design gates. |
| CIR-002 | Git root is above this project and contains unrelated neighboring changes. | Broad git operations could alter user work. | Scope every diff/commit/status to this project; never touch neighbors. |
| CIR-003 | Security-service settings require external administrator permissions. | Code alone cannot prove enablement. | Require readback or mark the related release gate BLOCKED. |
| CIR-004 | Production privacy/domain/analytics values are absent. | Real production acceptance cannot complete. | Fail closed; do not invent or hardcode. |
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
| Database/provider coupling | Low | Medium | Standard PostgreSQL URL, Drizzle/Postgres.js, no proprietary API, migration replay | Claude; architecture gate |
| Privacy policy published with placeholders/indefinite retention | Medium | High | Fail-closed env, PD-003, release checklist, deletion procedure | Owner + Codex; production block |
| Dark UI loses contrast/readability | Medium | High | Measured WCAG AA, axe/manual contrast, high-legibility typography, target screenshots | Claude + Codex; accessibility gate |
| Visual drift to generic AI/cyber/fake dashboard | Medium | Medium | DESIGN/brief, concept labels, Impeccable passes, anti-pattern checklist | Claude + Codex; visual gate |
| Analytics blocks form or false thank-you conversion | Low | High | Failure isolation, action-governed success, direct-thanks tests, blocked-GTM E2E | Claude; analytics gate |
| Performance targets missed by fonts/scripts/assets | Medium | Medium | Optimized fonts, minimal client boundary, non-blocking GTM, Lighthouse CI | Claude; performance gate |
| Unrelated parent-repository files modified | Low | High | Project-scoped git review and file list reconciliation | Claude + Codex; handoff block |
| External security controls unavailable | Medium | High | Capability readback and explicit BLOCKED state; never claim pass | Admin + Codex; production block |

## Security Exceptions

No exception is requested or authorized in this planning package. Any future exception must use
CTR-005, retain the normative severity policy, and receive accountable human acceptance.
