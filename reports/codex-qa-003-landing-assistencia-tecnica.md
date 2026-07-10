# Codex Independent QA — Feature 003 Landing Assistência Técnica

**Verdict:** `CHANGES_REQUIRED`

**Reviewer:** Codex (independent; no application-code edits)  
**Date:** 2026-07-10  
**Feature:** `003-landing-assistencia-tecnica`  
**Claude report reviewed:** `reports/claude-execution-003-landing-assistencia-tecnica.md`  
**Handoff reviewed:** `handoffs/claude-to-codex-003-landing-assistencia-tecnica.md`  
**Correction handoff:** `handoffs/codex-to-claude-fix-003-landing-assistencia-tecnica-01.md`  
**Convergence:** Phase 8 tasks T088–T097 appended to `tasks.md`

---

## 1. Executive summary

Local ordered gates through Trivy, E2E, and Lighthouse were independently reproduced and pass.
Trusted-boundary security (server authority, idempotency, consent, analytics allowlist, CSP, env
partition) is largely sound. The delivery is **not approvable** because: (1) CTR-001 honeypot
value-preservation is violated; (2) FR-036 contact link is missing; (3) independent Impeccable
critique still finds unresolved P1 design deviations against `DESIGN.md` / NFR-013 despite
T074–T077 marked done; (4) CodeQL and external security readbacks remain BLOCKED and must not be
treated as passes; (5) owner decisions (LGPL, privacy/GTM/domain) remain open.

Campaign / paid traffic remains **BLOCKED**.

---

## 2. Environment and evidence integrity

| Item | Value |
|---|---|
| Project path | `/home/rafael/claude-code/assistencia-tecnica` |
| Git root (CIR-002) | `/home/rafael/claude-code` (shared parent; neighboring work present) |
| Branch / commits | Parent `main` with **no commits yet**; project remains untracked relative to parent history |
| Node / pnpm / Trivy | v24.18.0 / 11.11.0 / 0.72.0 |
| DB for QA | Disposable Docker PostgreSQL 16 (local only; credentials not recorded) |
| Claude documents-read list | Present and complete in Claude report §1 (QA003) |
| Screenshots | 10 PNGs under `reports/screenshots/003-landing-assistencia-tecnica/` (QA052) |
| Parent Impeccable hook file | Exists at `/home/rafael/claude-code/.claude/settings.local.json` (D-1; owner decision) |

QA001–QA006: preparation complete; Claude evidence is largely reproducible; no secret/PII found in
report/screenshots/source during this review.

---

## 3. Reproduced gate results (ordered)

| Gate | Command | Result | Notes |
|---|---|---|---|
| Frozen install | `pnpm install --frozen-lockfile` | PASS | No lockfile mutation |
| Lint | `pnpm lint` | PASS (0 errors) | 2 `no-console` warnings in `tests/screenshots.mjs` |
| Typecheck | `pnpm typecheck` | PASS | |
| Unit | `pnpm test` | PASS | 64 tests |
| Integration | `pnpm test:integration` | PASS | 25 tests |
| Build | `pnpm build` | PASS | Routes: `/assistencia-tecnica`, `/obrigado`, `/privacidade` (dynamic) |
| Audit | `pnpm audit --audit-level high` | PASS | 0 findings |
| Trivy fs | `trivy fs --scanners vuln,secret,misconfig --severity HIGH,CRITICAL --exit-code 1 .` | PASS | 0/0/0; DB UpdatedAt 2026-07-09 |
| Trivy license | `trivy fs --scanners license --severity HIGH,CRITICAL .` | RECORDED | 1 HIGH: `@img/sharp-libvips-linux-x64` LGPL-3.0-or-later |
| CodeQL | CI reusable workflow after Trivy | **BLOCKED** | Workflow order correct in `.github/workflows/ci.yml`; no real Actions run for this project repo |
| E2E | `pnpm test:e2e` | PASS | **50 passed** (390×844 + 1440×900) after Playwright Chromium install into sandbox browser path |
| Lighthouse | `pnpm test:lighthouse` | PASS | Runs median ≈ Perf 99 / A11y 100 / BP 96 / SEO 100; LCP ~0.8–1.1s; CLS 0 |

**E2E note:** First QA attempt failed solely because Chromium was missing from the Cursor sandbox
Playwright path (`/tmp/cursor-sandbox-cache/...`). After `playwright install chromium` into that
path, all 50 tests passed. Not an application defect.

**Standalone note:** `next.config.ts` sets `output: "standalone"`. `pnpm start` emits
`"next start" does not work with "output: standalone"` yet still served 200 for QA. Fragile for
documented local/CI start path → T095.

---

## 4. Scope, stack, and dependencies

- Single Next.js App Router app; no Go, auth, dashboard, payments, WhatsApp automation, CMS, queues.
- Stack matches constitution: Next 16.2.10, React 19.2.7, TS 5.9.3 (compat pin), ESLint 9.39.4
  (compat pin), Tailwind 4.3.2, Zod 4.4.3, Drizzle, postgres.js, Vitest, Playwright, axe, LHCI,
  impeccable 3.2.1 — exact pins, frozen lockfile, reviewed overrides (`tmp`, `postcss`, `uuid`,
  `esbuild`).
- No `any` / `@ts-ignore` / `@ts-expect-error` / broad eslint-disable in application TS/TSX.
- Docker/Dockerfile/compose added (Claude D-5): local-test only; `trivy config` clean. Still creates
  a container artifact and couples `standalone` into the default Next config (T095).

Dec-1 TypeScript/ESLint pins: **accepted** as mutual-compatibility under constitution (not a silent
downgrade of security).

---

## 5. Security / LGPD / analytics (source review)

| Control area | Verdict |
|---|---|
| Server-authoritative `vertical` / `landing_path` | PASS |
| WhatsApp normalize + unique idempotency | PASS (R-4 `+55` caveat accepted as documented tradeoff) |
| Consent default unchecked + required | PASS |
| Analytics allowlist / no PII / `gclid_present` | PASS (unit + E2E) |
| Parameterized Drizzle insert / no raw spread | PASS |
| Env partition + `server-only` DB | PASS |
| CSP nonce + `strict-dynamic` + static headers | PASS (live header observed) |
| Honeypot no write / generic error | PASS behaviorally |
| Honeypot **values preserved** | **FAIL** — returns `values: {}` (`submit-lead.ts:60`) vs CTR-001 |
| Secrets in source/report/screenshots | PASS (none found) |
| Socket analysis of new deps | **BLOCKED** (readback) |
| Dependabot / Secret Scanning / Push Protection | Config/files present; **admin readbacks BLOCKED** |

---

## 6. Functional honesty and content

| Check | Verdict |
|---|---|
| Eleven sections + lifecycle order | PASS |
| Validation messaging / concept labels | PASS |
| No fake testimonials/metrics/logos | PASS |
| No unsupported availability claims | PASS |
| Fit / non-fit exclusions | PASS |
| Privacy fail-closed without PD-003 values | PASS |
| Thank-you honesty (FR-029) | PASS |
| Footer privacy + contact (FR-036) | **FAIL** — privacy only; no contact link |
| FR-019 twelve vs thirteen options | INFO — code matches `data-model.md` (13); FR-019 wording stale |

---

## 7. Impeccable (mandatory independent critique / audit)

### Critique synthesis (Assessments A + B)

- **Assessment A** (design review sub-agent): Heuristics ~28/40. Strengths: validation honesty,
  domain copy, form craft. **P1 unresolved:** lifecycle identical card grid; amber budget burned;
  Step-2 priority wall. **P2:** uppercase concept kickers; mid-page card sameness.
- **Assessment B** (detector): 1 advisory `design-system-radius` on `:focus-visible { border-radius:
  2px }` — treated as **false positive** for focus geometry, not UI chrome.
- **Audit health (Codex):** A11y 4 · Perf 4 · Responsive 4 · Theming 3 · Anti-patterns **2** →
  **17/20 Good**, but anti-pattern P1s block QA051 clean pass.

### Adapt / polish

Responsive E2E (390/1440, 200% zoom, reduced motion) **PASS**. Polish debt remains in ledger vs
cards, amber discipline, and concept label casing → T090–T094, T097.

---

## 8. Spec Kit Converge

## Convergence Findings

| ID | Gap Type | Severity | Source | Evidence | Remaining Work |
|----|----------|----------|--------|----------|----------------|
| F1 | contradicts | HIGH | CTR-001 / FR-025 | `submit-lead.ts` honeypot `values: {}` | T088 |
| F2 | missing | HIGH | FR-036 | Footer has no contact link | T089 |
| F3 | contradicts | HIGH | NFR-013 / DESIGN | Lifecycle 8-card grid | T090 |
| F4 | contradicts | HIGH | NFR-013 / DESIGN | Amber on all stages | T091 |
| F5 | partial | MEDIUM | NFR-013 / brief | 13-option priority wall | T092 |
| F6 | partial | MEDIUM | FR-022 | Checkbox group not synced | T093 |
| F7 | contradicts | MEDIUM | NFR-013 | Uppercase tracked kickers | T094 |
| F8 | partial | MEDIUM | plan / D-5 | standalone vs `pnpm start` | T095 |
| F9 | partial | LOW | NFR-007 / PD-006 | Atkinson Next vs classic | T096 |
| F10 | partial | HIGH | NFR-013 / T074 | P1s remain after claimed Impeccable close | T097 |

**Summary metrics:** FR/NFR/SEC/SC inventory checked against code; constitution MUST principles
checked; 10 actionable findings → **Phase 8 tasks T088–T097 appended**. External BLOCKED items are
**not** converted into false passes.

---

## 9. Decisions requiring the owner (not Claude code fixes)

1. **LGPL-3.0-or-later** via `sharp`/libvips — accept for server-side dynamic linking or remove
   `sharp` / change image strategy (R-2).
2. **PD-001…PD-006** — production DB, brand/contact, privacy controller/contact/retention, canonical
   origin, real GTM, font license confirmation.
3. **PD-005** — enable and provide readbacks for Dependabot, Socket, Secret Scanning, Push
   Protection, branch protection; run CodeQL in the real project CI.
4. **D-1** — keep or delete parent `/home/rafael/claude-code/.claude/settings.local.json`.
5. **FR-019 wording** — Codex should align `spec.md` “twelve” to data-model’s thirteen (spec fix,
   not an implementation rewrite to fake compliance).
6. **WhatsApp `+55` canonicalization** — optional product decision (R-4); current digits-only is
   deterministic and tested.

---

## 10. Final decision

### `CHANGES_REQUIRED`

Reasons (QA059):

1. Failed/missing requirement evidence: FR-036, CTR-001 honeypot values, unresolved NFR-013 P1s.
2. External SAST/security readbacks not obtained — campaign gate stays blocked (not approved).
3. Owner license/policy items open.

Re-review after Claude completes T088–T097 with a new execution report delta. Codex will not patch
`app/`, `components/`, `lib/`, `db/`, `tests/`, or runtime assets.
