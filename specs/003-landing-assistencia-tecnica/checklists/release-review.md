# Codex Operational Release Review Checklist: Landing Assistência Técnica

**Purpose**: Review Claude Code's execution report, full diff, application, evidence, and external
controls after implementation. This operational QA checklist is deliberately separate from the
Spec Kit requirements-quality checklist.

**Reviewer**: Codex only; Codex MUST NOT patch application code.

**Allowed outcomes**: `APPROVED`, `APPROVED_WITH_NOTES`, `CHANGES_REQUIRED`

**Review date**: 2026-07-10 (initial) · **Re-review**: 2026-07-10 (convergence 01)  
**Outcome**: `APPROVED_WITH_NOTES`  
**Evidence**: `reports/codex-qa-003-landing-assistencia-tecnica.md` + `reports/codex-qa-rereview-convergence-01-003-landing-assistencia-tecnica.md`  
**Correction handoff (closed)**: `handoffs/codex-to-claude-fix-003-landing-assistencia-tecnica-01.md`  
**Claude convergence handoff**: `handoffs/claude-to-codex-convergence-01-003-landing-assistencia-tecnica.md`

## Review Preparation and Evidence Integrity

- [x] QA001 Read both normative source documents, constitution, spec, clarifications, product/design context, plan, research, data model, contracts, quickstart, tasks, traceability, checklists, handoff, and Claude report.
- [x] QA002 Capture repository root, scoped project path, branch/commit, working-tree status, and complete diff without touching neighboring parent-repository changes.
- [x] QA003 Confirm Claude's report lists every required document read before the first edit.
- [x] QA004 Confirm report file lists every created, modified, deleted, and untracked project file and matches the actual diff.
- [x] QA005 Confirm all 87 task statuses are accounted for; unchecked/partial tasks include reason, impact, owner, and next action. *(T001–T087 checked by Claude; Phase 8 T088–T097 opened by Codex Converge for residual gaps.)*
- [x] QA006 Reject missing, stale, fabricated, secret-bearing, PII-bearing, or non-reproducible evidence. *(Screenshots present; no secrets/PII found in reviewed artifacts.)*

## Reproducibility and Mandatory Gate Order

- [x] QA007 Confirm Node.js 24 LTS, exact pnpm `packageManager`, engine metadata, `.nvmrc`, and lockfile agree.
- [x] QA008 Run `pnpm install --frozen-lockfile` and reject lockfile mutation or unpinned install behavior.
- [x] QA009 Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm test:integration` in order and record independent results. *(lint 0 / typecheck 0 / unit 64 / integration 25)*
- [x] QA010 Run `pnpm build` and inspect warnings, route output, environment failures, and client/server boundary warnings. *(PASS; standalone warning noted → T095)*
- [x] QA011 Run `pnpm audit --audit-level high` and classify every finding under the severity policy. *(0 findings)*
- [x] QA012 Run `trivy fs --scanners vuln,secret,misconfig --severity HIGH,CRITICAL --exit-code 1 .` and record version/database freshness. *(0/0/0; Trivy 0.72.0)*
- [x] QA013 Review the Trivy license scan/applicability and compare it with the dependency license table. *(LGPL HIGH sharp/libvips → owner policy)*
- [ ] QA014 Confirm CodeQL depended on successful Trivy and passed before the final E2E job; a concurrent/unordered status fails SEC-017. **BLOCKED — workflow order correct; no real CI run/readback. Campaign remains blocked.**
- [x] QA015 After CodeQL evidence, run `pnpm test:e2e` and inspect all target projects rather than accepting a partial retry. *(Re-review: 50 passed with CI=1; CodeQL still BLOCKED for campaign)*
- [x] QA016 Run `pnpm test:lighthouse` against the recorded production build/preview profile. *(Re-review: PASS on quiet re-run; earlier noisy run failed Perf on TBT — note flakiness; A11y 100 / BP 96 / SEO 100 / CLS 0)*
- [x] QA017 Confirm the Claude report was finalized after all gates and before Codex review, with exact versions, commands, exit codes, durations, and results.

## Scope, Architecture, and Code Quality

- [x] QA018 Confirm only one Next.js full-stack application exists and no Go backend, auth, dashboard, admin, payment, WhatsApp integration, queue, microservice, CMS, or future SaaS abstraction entered the diff.
- [x] QA019 Confirm App Router, strict TypeScript, React, Tailwind, Server Actions/`useActionState`, Zod, PostgreSQL, Drizzle, GTM, Vitest, Playwright, axe, pnpm, and Vercel assumptions remain intact.
- [x] QA020 Search for `any`, unsafe casts, `@ts-ignore`, disabled lint rules, broad suppressions, dead code, speculative abstractions, and copied component-library identity; require documented justification or changes. *(clean)*
- [x] QA021 Confirm server/client boundaries are minimal and no server secret/database module is reachable from client bundles.
- [x] QA022 Confirm production errors are generic Portuguese responses and no stack/query/provider detail reaches the user.

## Dependencies and Supply Chain

- [x] QA023 Diff `package.json` and `pnpm-lock.yaml`; match every direct/transitive-impacting addition to the eight-field report row.
- [x] QA024 Confirm each package has exact version, purpose, necessity, alternatives, license, prod/dev scope, and Socket/audit/Trivy/security results. *(Socket readback still BLOCKED)*
- [x] QA025 Reject libraries used only for simple native React/Next/CSS/web-platform behavior or packages outside the approved baseline without prior approval.
- [ ] QA026 Check for abandoned packages, install scripts, obfuscation, unexpected network/shell/filesystem/environment access, typosquatting, and maintainer-change signals in Socket evidence. **BLOCKED — Socket readback absent (impeccable reviewed manually in Claude report).**
- [x] QA027 Confirm all GitHub Actions use immutable full commit SHAs, least permissions, explicit timeouts, and no untrusted-PR production secrets.
- [ ] QA028 Confirm Dependabot alerts/security updates and weekly pnpm updates are enabled with no auto-merge. **Config present; admin enablement/readback BLOCKED.**
- [ ] QA029 Confirm Secret Scanning and Push Protection are enabled when available; otherwise require a real capability blocker and retain Trivy secret scanning. **BLOCKED readback; Trivy secret scan PASS.**
- [x] QA030 Search source, history-visible diff, docs, examples, tests, screenshots, reports, generated files, and bundles for secrets; any secret triggers block/revoke/rotate/history review. *(none found)*
- [x] QA031 Reject `npm audit fix --force`, scanner disabling, lowered severity, ignored findings, silent exceptions, or automated vulnerability fixes without review.
- [x] QA032 Validate every exception against CTR-005 and the severity policy; Codex cannot accept an exception on behalf of the accountable owner. *(LGPL recorded for owner; not silently accepted)*

## Data, Server Action, Privacy, and LGPD

- [x] QA033 Confirm all input is server-revalidated, bounded, enumerated, trimmed/normalized, and explicitly mapped; no raw spread into persistence.
- [x] QA034 Confirm `vertical`, `landing_path`, redirect, notice version/time, and creation time are server-authoritative.
- [x] QA035 Confirm ORM/database calls are parameterized and use a pooled least-privilege server-only URL.
- [x] QA036 Inspect schema/migration for every required field, validated JSONB, consent invariant, and unique `(vertical, whatsapp_normalized)` constraint.
- [x] QA037 Independently test first insert, sequential duplicate, concurrent duplicate, database failure/retry, and inserted/existing public-result equality with synthetic data. *(via integration suite)*
- [x] QA038 Confirm no raw IP, password, unlock pattern, device/customer repair data, PII log, full payload, or PII test snapshot exists.
- [x] QA039 Confirm consent is explicit/unselected, interview permission is separate, privacy purpose is clear, and placeholders fail closed for production.
- [x] QA040 Execute the synthetic deletion procedure and confirm target-only hard deletion, cross-vertical scope safety, failure handling, no collateral rows, and no PII evidence. *(integration tests)*
- [ ] QA041 Confirm controller/contact/retention and backup limitations are real and approved before production; otherwise campaign status remains blocked. **BLOCKED (PD-003) — fail-closed correctly.**

## Analytics and Conversion

- [x] QA042 Capture `dataLayer` for valid, invalid, error/retry, duplicate, direct thanks, back navigation, double click, and blocked GTM. *(E2E coverage)*
- [x] QA043 Confirm only the nine events and approved properties exist; no name, business, phone, email, IDs, raw gclid, answers, consent detail, IP, stack, or payload.
- [x] QA044 Confirm one success event per accepted inserted/existing attempt, identical duplicate outward behavior, and unique database rows as the canonical lead metric.
- [x] QA045 Confirm Google Ads conversion listens only to `lead_submit_success`, not thank-you URL/pageview, and GTM failure cannot block persistence or redirect. *(docs + E2E blocked-GTM)*
- [x] QA046 Confirm UTMs/gclid are bounded/inert, preserved to persistence, and never accepted as authority or executable content.

## Functional Scope and Honest Content

- [x] QA047 Inspect `/assistencia-tecnica` metadata, first viewport, CTA target, eleven sections, full lifecycle order, fit/non-fit, pilot, FAQ, form, and footer.
- [x] QA048 Confirm every product-like visual says “Visão do produto — conceito” or equivalent and contains no realistic PII.
- [x] QA049 Confirm no invented testimonials, logos, users, revenue, ratings, metrics, urgency, availability, or unsupported integration/capability claims.
- [x] QA050 Confirm bench/workshop assistance is concrete and not blended with field service, automotive work, authorized networks, or consumers seeking repair.

## Impeccable, Accessibility, Responsive, and Performance

- [x] QA051 Read Impeccable critique/adapt/audit/polish evidence and independently run critique/audit against `PRODUCT.md`/`DESIGN.md`; unresolved P0/P1 requires changes. **PASS on re-review — prior P1s closed; residual P2 only.**
- [x] QA052 Review 390x844 and 1440x900 landing/form/error/success screenshots for hierarchy, clipping, concept labels, truthful copy, and synthetic-only data.
- [x] QA053 Complete keyboard, visible-focus, semantics/headings, labels/errors/live status, contrast, 200% zoom, long-copy, reduced-motion, and asset-failure review. *(E2E + source)*
- [x] QA054 Confirm zero critical/serious axe violations on main routes and conversion states. *(E2E axe PASS)*
- [x] QA055 Confirm Lighthouse Performance >=90, Accessibility >=95, Best Practices >=95, SEO >=90, LCP <=2.5s, and CLS <=0.1 under the recorded reproducible profile.
- [x] QA056 Inspect for Impeccable bans: purple-blue cliché, neon/cyber, glassmorphism, gradient text, fake metrics, card grids/nesting, repeated eyebrows, huge radii, border+wide-shadow, sketchy SVG, decorative grids/stripes, and unreadable muted text. **PASS with notes — lifecycle ledger + amber discipline restored; secondary benefits/pilot cards remain P2 polish.**

## Final Decision and Campaign Gate

- [x] QA057 Reconcile actual evidence to every FR/NFR/SEC/SC row in `traceability.md`; coverage must remain 100%. *(matrix updated with QA findings; residual gaps → Phase 8)*
- [x] QA058 List every finding with severity, evidence, violated ID, affected file, and objective acceptance criterion; do not patch it.
- [x] QA059 Issue `CHANGES_REQUIRED` for any Critical/High/secret, failed/missing gate, unjustified dependency, PII/secret exposure, scope expansion, deception, or material accessibility/performance failure. **Initial review: CHANGES_REQUIRED. Re-review after T088–T097: no remaining code Critical/High → `APPROVED_WITH_NOTES`.**
- [x] QA060 Issue the final status and keep paid traffic blocked until production persistence, conversion, privacy, console, screenshots, external controls, and validation messaging all pass. **Implementation `APPROVED_WITH_NOTES`; paid traffic still BLOCKED on PD-001–PD-005 / CodeQL / LGPL owner items.**

## Reviewer Notes

- Convergence 01 closed F1–F10. See `reports/codex-qa-rereview-convergence-01-003-landing-assistencia-tecnica.md`.
- External/owner blockers are notes, not silent passes.
- FR-019 “twelve”→thirteen remains a Codex/spec wording task.
- Lighthouse Perf is sensitive to local TBT noise; require a quiet CI/preview LHCI readback before campaign.
