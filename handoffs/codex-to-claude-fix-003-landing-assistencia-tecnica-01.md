# Handoff Codex → Claude Code (correção 01): 003 Landing Assistência Técnica

**Status:** `CHANGES_REQUIRED`  
**Date:** 2026-07-10  
**QA report:** `reports/codex-qa-003-landing-assistencia-tecnica.md`  
**Tasks:** Complete **Phase 8 Convergence T088–T097** in `specs/003-landing-assistencia-tecnica/tasks.md`  
**Do not** edit specs to weaken requirements. **Do not** mark external BLOCKED gates as PASS.

---

## Objective acceptance criteria

### T088 — Honeypot values (CTR-001)

- On honeypot trip, return `{ status: "error", message: GENERIC_ERROR, values: safeValues(formData) }`
  (honeypot field excluded), same as DB-error path.
- Integration test asserts non-empty preserved values and still no persistence / no mechanism leak.

### T089 — Footer contact (FR-036)

- Footer links to privacy **and** a contact/deletion channel (e.g. `/privacidade#direitos` or
  configured contact when available).
- Unit test asserts both links.

### T090–T091 — Lifecycle ledger + amber budget (NFR-013)

- Lifecycle is a ledger/strip sequence, not eight identical cards.
- Amber limited to CTA + one active step + focus + ≤1–2 emphasis moments.
- Independent Impeccable critique no longer lists these as P1.

### T092–T093 — Form Step 2

- `priority_features` remains 13 storage slugs / 1–5 unique, but UI cognitive load is reduced
  (grouping or progressive disclosure).
- Checkbox group reflects server-echoed values after invalid/error.

### T094 — Concept labels

- No uppercase tracked “conceito” eyebrows; sentence-case badges.

### T095 — Standalone vs local start

- Documented `pnpm start` / Playwright / Lighthouse path works without unsupported-config warning,
  **or** tooling is updated to the supported standalone entry and README/quickstart match.

### T096 — Font decision record

- Record Atkinson Hyperlegible (classic) vs DESIGN “Next” + OFL evidence in the execution report.

### T097 — Impeccable re-pass

- Re-run critique / adapt / audit / polish; remediate remaining P0/P1; append before/after evidence.

---

## Out of scope for this correction round (owner / Codex)

- Enabling GitHub CodeQL run, Socket, Dependabot, Secret Scanning readbacks (PD-005).
- Production GTM / privacy controller / domain / DB values (PD-001–PD-004).
- LGPL policy acceptance for `sharp` (R-2).
- Parent Impeccable `settings.local.json` cleanup (D-1).
- Spec wording fix FR-019 “twelve” → thirteen (Codex/spec; do not fake-fix by deleting a slug).

---

## Required evidence in the new Claude report delta

1. Exact commands/results for lint, typecheck, unit, integration, build, audit, Trivy, E2E, Lighthouse.
2. Diff limited to `assistencia-tecnica/` (CIR-002).
3. Updated Impeccable evidence for T097.
4. Explicit list of still-BLOCKED external items (never “pass”).
5. No PII/secrets in logs, screenshots, or report.

When done, hand back to Codex for re-review. Do not self-approve.
