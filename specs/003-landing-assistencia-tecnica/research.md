# Research and Technical Decisions: Landing Assistência Técnica

**Date**: 2026-07-09

All implementation-blocking technical questions are resolved below. Production owner inputs remain
release gates in PD-001-PD-006 and are not replaced with invented values.

## R-001 - Framework and Runtime Line

**Decision**: Initialize on stable Next.js 16.2 and Node.js 24 LTS, then lock exact compatible patch
versions in `package.json`, `packageManager`, engine metadata, `.nvmrc`, and `pnpm-lock.yaml`.

**Rationale**: Next.js 16.2 is a stable release and supports the required App Router/Server Function
architecture. The Node.js release table identifies v24 as LTS while v26 is still Current in July
2026. Production must use LTS, not the newest Current line. Sources:
[Next.js 16.2 release](https://nextjs.org/blog/next-16-2) and
[Node.js release schedule](https://nodejs.org/en/about/previous-releases).

**Alternatives considered**: Next.js 16.3 preview was rejected because the brief requires stable;
Node.js 26 was rejected until it reaches LTS; older Next/Node lines add avoidable maintenance and may
miss current security fixes.

## R-002 - Styling and Design Context

**Decision**: Tailwind CSS 4.3 with project-owned components and OKLCH tokens from `DESIGN.md`.
Impeccable owns shape, critique, adaptation, audit, and polish. Use optimized framework font loading
for the selected redistributable families after license verification.

**Rationale**: Tailwind 4.3 is the current stable line documented by the vendor and fits the fixed
stack without a component-library identity. Source:
[Tailwind CSS 4.3 release](https://tailwindcss.com/blog/tailwindcss-v4-3). The design source format
follows the [DESIGN.md specification](https://raw.githubusercontent.com/google-labs-code/design.md/main/docs/spec.md).

**Alternatives considered**: shadcn/full UI kits, CSS-in-JS, a motion library, and generic system
fonts were rejected because the surface is small, brand-led, and dependency containment is
mandatory. A code-native lifecycle is preferred to a dependency-heavy illustration.

## R-003 - Database and ORM

**Decision**: Standard managed PostgreSQL through a pooled server-only URL, Drizzle ORM/Kit, and the
provider-neutral Postgres.js driver. Choose Neon or Supabase operationally without using proprietary
APIs. Use a database unique constraint on `(vertical, whatsapp_normalized)` and an insert-on-conflict
no-update path.

**Rationale**: This satisfies the mandated stack, parameterization, Vercel deployment, reproducible
migrations, and provider portability. Database uniqueness resolves concurrent duplicates; a client
button cannot.

**Alternatives considered**: provider-specific SDKs couple the application; Prisma adds unnecessary
weight; a custom SQL/migration layer increases risk; an in-memory or spreadsheet store cannot meet
persistence, integrity, and privacy requirements.

## R-004 - Form Action and Idempotent Outcome

**Decision**: One Server Action consumed with `useActionState`, one shared Zod schema with trusted
server refinement, and a discriminated safe result: `invalid`, `bot`, `error`, `existing`, or
`inserted`. The public result is identical for `inserted` and `existing`, and each accepted browser
submission emits exactly one `lead_submit_success`. Unique database rows are the canonical lead
metric; outwardly distinguishing duplicates would disclose whether a phone number already belongs
to the participant list.

**Rationale**: It honors exactly-once accepted-submission event semantics, safe duplicate behavior,
progressive state feedback, and the fixed stack. Server constants prevent vertical/path
manipulation. The
action never returns PII, duplicate-membership status, or internal errors.

**Alternatives considered**: a public JSON route duplicates validation/CSRF surface; client-only
validation is untrusted; updating duplicate rows can overwrite consent or contact data without a
clear purpose. Distinguishing duplicate conversion avoids browser overcount but creates a participant
membership oracle; the selected tradeoff protects privacy and uses unique database rows as the
canonical validation metric.

## R-005 - Analytics

**Decision**: A small project-owned typed `dataLayer` helper with an event/property allowlist and a
manual non-blocking GTM loader. UTMs and `gclid` are captured as bounded inert values and persisted;
analytics failure never controls persistence. GTM/GA4/Ads configuration is documented and deployed
externally.

**Rationale**: It minimizes dependencies and makes PII exclusion reviewable. The server outcome, not
the thank-you URL, determines conversion eligibility.

**Alternatives considered**: an analytics SDK/wrapper adds supply-chain surface; firing conversion
on page view permits false/direct conversions; sending form answers violates the privacy boundary.

## R-006 - SAST Choice

**Decision**: CodeQL is the primary JavaScript/TypeScript SAST in pull requests, default branch, and
scheduled runs. If repository capability demonstrably prevents CodeQL, Semgrep may replace it only
through a documented plan/report deviation with equivalent scope and no weakened High/Critical
gate. Do not run both merely for tool count.

**Rationale**: The repository workflow is GitHub-oriented and the security specification explicitly
allows one of CodeQL or Semgrep. One well-configured, reviewed SAST avoids duplicate noise while
covering source-to-sink issues in actions and routes.

**Alternatives considered**: Semgrep is the approved fallback. Omitting SAST or treating lint as
SAST is forbidden.

## R-007 - Dependency and Action Supply Chain

**Decision**: Keep the manifest to the fixed runtime/test/security necessities, use Corepack/pnpm
with a frozen lockfile, run audit + Trivy + Socket, enable weekly non-auto-merged Dependabot, and pin
GitHub Actions to immutable full commit SHAs with least permissions.

**Rationale**: Lockfiles ensure reproducibility but do not establish package trust. Socket checks
malicious-behavior signals; Trivy checks known vulnerabilities, secrets and misconfiguration;
CodeQL checks source patterns; Codex reviews context.

**Alternatives considered**: floating action tags and automatic merges are mutable; `npm audit
fix --force` is destructive; adding security CLIs as project runtime dependencies increases the
surface and is unnecessary when CI can use pinned official distributions/actions.

## R-008 - Content Security Policy and Headers

**Decision**: Use a per-request nonce at the framework-supported proxy/request boundary for Next
scripts and GTM. Permit only required GTM/GA/Ads origins, prohibit production `unsafe-eval`, avoid
wildcards, and pair CSP with HSTS, MIME sniffing protection, strict referrer policy,
`frame-ancestors`, and a minimal permissions policy. Tests inspect actual preview headers.

**Rationale**: A static policy commonly requires broad inline-script concessions in a modern
framework. Nonces maintain a narrower executable-script boundary. GTM configuration is external,
so its final destinations must be known and validated before production.

**Alternatives considered**: `unsafe-inline` and broad `*.google.com` allowances were rejected as
unnecessarily weak; omitting GTM would violate analytics requirements; a third-party CSP package is
unnecessary.

## R-009 - Privacy, Deletion, and Retention

**Decision**: Collect only the listed validation/contact fields, store no raw IP, use explicit
unselected consent with notice version/time, hard-delete a verified lead through an authorized
operator procedure, and require owner-approved controller/contact/retention details before release.

**Rationale**: The landing has no account/admin UI, so a documented least-privilege operational
procedure is safer than expanding scope. Retention is a legal/business input and must not be
invented.

**Alternatives considered**: an admin dashboard/auth system is out of scope; soft-deleted PII still
retains data; an unspecified “keep indefinitely” default conflicts with minimization.

## R-010 - Visual Direction

**Decision**: Use the `Registro de Bancada` operational-ledger direction: petroleum graphite,
restrained amber signal, real process sequence, concept-labeled record/timeline, and minimal client
motion. Direction A in the probe is the base; physical evidence from B is a minor supporting device;
C is rejected.

**Rationale**: The direction communicates order at a repair bench without resembling an electronics
shop, cyber dashboard, industrial control system, or generic AI startup. It supports accessibility
and fair future vertical comparison.

**Alternatives considered**: promotional broken-device photography, neon signal maps, glass SaaS
cards, and editorial typography conflict with the brief and Impeccable anti-patterns.

## R-011 - Testing and Evidence Boundaries

**Decision**: Use unit/component tests for deterministic states, database integration tests for
constraints/migrations/actions, and Playwright for browser conversion, analytics, a11y, responsive,
slow-network, and screenshot evidence. Lighthouse runs against a production build/preview with the
profile recorded. Security scanners are separate gates, not test substitutes.

**Rationale**: Each layer proves a distinct risk. Mock-only persistence cannot prove idempotency;
browser-only tests are slow for schema edge cases; scanner success cannot prove business behavior.

**Alternatives considered**: E2E-only or unit-only approaches leave material gaps; snapshot-heavy
tests can leak PII and provide weak behavior evidence.

## Expected Dependency Baseline for Claude Review

This list is a category baseline, not permission to add packages silently. Exact packages/versions
must be produced by the official initializer or justified individually in the report.

- Runtime: `next`, `react`, `react-dom`, `zod`, `drizzle-orm`, `postgres`.
- Build/style: `tailwindcss` and the current official Next/Tailwind integration; TypeScript and
  required type packages.
- Database tooling: `drizzle-kit` in development only.
- Tests: `vitest`, Testing Library packages, `jsdom`, `@playwright/test`, `@lhci/cli`, and
  `@axe-core/playwright`.
- Lint: the official compatible ESLint configuration generated for the chosen Next line.
- No other package is presumed. Every addition beyond this baseline receives heightened scrutiny;
  baseline packages still require the full SEC-002 report row.
