# Claude Code Execution Report — 003 Landing Assistência Técnica

> **Status:** IMPLEMENTATION COMPLETE (T001–T087) and verified locally — NOT a QA approval.
> Independent Codex review is required (constitution VII). Claude Code does not self-approve.
> Production/campaign gates remain BLOCKED pending owner inputs (PD-001..PD-006) and external
> readbacks; see §16.
>
> **Local gates:** lint 0 · typecheck 0 · unit 64 · integration 25 · build 0 · audit 0 · Trivy
> 0/0/0 · E2E 50 · Lighthouse Perf 100 / A11y 100 / BP 96 / SEO 100 / LCP 0.6s / CLS 0.
> **Blocked (external):** CodeQL CI run, Socket/Dependabot/Secret-Scanning readbacks, real
> GTM/privacy/domain values, production DB.

**Feature:** `003-landing-assistencia-tecnica`
**Implementation owner:** Claude Code
**Independent approval owner:** Codex
**Report started:** 2026-07-09

---

## 1. Documents read before the first edit

Read in full, in the order mandated by `CLAUDE.md` / the codex→claude handoff, before any file was
created:

1. `AGENTS.md`
2. `CLAUDE.md`
3. Normative root documents:
   - `plano_macro_landing_assistencia_tecnica_codex_claude.md` (macro plan)
   - `spec_seguranca_codigo_supply_chain.md` (security specification — precedence on security conflicts)
4. `.specify/memory/constitution.md`
5. `specs/003-landing-assistencia-tecnica/spec.md`
6. `specs/003-landing-assistencia-tecnica/clarifications.md`
7. `specs/003-landing-assistencia-tecnica/decisions-and-risks.md`
8. `PRODUCT.md`
9. `DESIGN.md`
10. `specs/003-landing-assistencia-tecnica/design-brief.md`
11. `specs/003-landing-assistencia-tecnica/research.md`
12. `specs/003-landing-assistencia-tecnica/plan.md`
13. `specs/003-landing-assistencia-tecnica/data-model.md`
14. Contracts:
    - `contracts/lead-submission.md` (CTR-001)
    - `contracts/analytics-events.md` (CTR-002)
    - `contracts/environment.md` (CTR-003)
    - `contracts/lead-deletion.md` (CTR-004)
    - `contracts/security-exception.md` (CTR-005)
15. `specs/003-landing-assistencia-tecnica/quickstart.md`
16. `specs/003-landing-assistencia-tecnica/tasks.md`
17. `specs/003-landing-assistencia-tecnica/traceability.md`
18. Checklists:
    - `checklists/requirements.md`
    - `checklists/security-and-quality.md`
    - `checklists/release-review.md`
19. `handoffs/codex-to-claude-003-landing-assistencia-tecnica.md`
20. `handoffs/claude-code-prompt-003-landing-assistencia-tecnica.md`

The macro plan (`plano_macro_landing_assistencia_tecnica_codex_claude.md`) was consulted as a
normative source document.

---

## 2. Environment, branch, and runtime context (T001)

| Item | Value |
|---|---|
| Repository root (`git rev-parse --show-toplevel`) | `/home/rafael/claude-code` (parent) |
| Project directory (scoped) | `/home/rafael/claude-code/assistencia-tecnica` |
| Branch | `main` |
| Project tracked files at start | 0 (entire project directory untracked: `?? ./`) |
| Node.js | v24.18.0 (Node 24 LTS line — R-001) |
| npm | 11.16.0 |
| pnpm | 11.11.0 (Corepack-enabled; pinned via `packageManager`) |
| Trivy | 0.72.0 |
| Docker | 26.1.5 (daemon accessible; used for disposable PostgreSQL) |
| OS | LMDE 7 (Debian-based), x86_64 |

### CIR status (from plan / decisions-and-risks)

- **CIR-001 (no Node in planning):** RESOLVED for implementation. Node 24 LTS established and
  recorded above. Runtime commands now execute.
- **CIR-002 (shared parent git root with neighboring work):** ACTIVE and honored. The git root is
  the parent `/home/rafael/claude-code`, which contains unrelated neighboring user work
  (`freelatask/`, etc.). All file creation is scoped to `assistencia-tecnica/`. No commit is made
  (not requested; a broad commit would touch neighbors). See deviation D-1 (§14) for a stray file
  the Impeccable installer wrote into the parent dir that the harness prevented me from removing.
- **CIR-003 (external security-service permissions):** ACTIVE. Config files are authored where
  possible; GitHub/Socket/Secret-Scanning readbacks require an administrator and remain BLOCKED
  until provided (see §12, §16).
- **CIR-004 (missing production privacy/domain/analytics values):** ACTIVE. Fail-closed
  placeholders only; no invented production values.
- **CIR-006 (PyYAML planning hook):** Not applicable to implementation.

---

## 3. Dependency, license, and security table (SEC-002)

All direct versions are exact-pinned (no semver ranges) in `package.json` and locked in
`pnpm-lock.yaml`. Frozen-lockfile install is reproducible (verified). Transitive packages are
covered by `pnpm audit` (all deps) and Trivy (prod deps), see §7.

### 3.1 Runtime dependencies

| Package | Version | Purpose | Necessity | Alternatives | License | Scope | Security |
|---|---|---|---|---|---|---|---|
| next | 16.2.10 | App Router framework, RSC, Server Actions, build (R-001) | Mandated stack | — (fixed) | MIT | prod | audit 0; Trivy 0 |
| react | 19.2.7 | UI runtime | Mandated stack | — | MIT | prod | audit 0; Trivy 0 |
| react-dom | 19.2.7 | DOM renderer | Mandated stack | — | MIT | prod | audit 0; Trivy 0 |
| zod | 4.4.3 | Server-side validation/bounds (SEC-016, CTR-001) | Mandated stack | manual validators (error-prone) | MIT | prod | audit 0; Trivy 0 |
| drizzle-orm | 0.45.2 | Parameterized SQL / typed schema (SEC-015, R-003) | Mandated stack | Prisma (heavier), raw SQL (riskier) | Apache-2.0 | prod | audit 0; Trivy 0 |
| postgres | 3.4.9 | Provider-neutral PostgreSQL driver (R-003) | Mandated stack | pg (heavier), provider SDK (couples) | Unlicense | prod | audit 0; Trivy 0 |
| server-only | 0.0.1 | Build-time guard preventing server modules in client bundles (SEC-013) | Enforces env/secret partition | manual convention (unenforced) | MIT | prod | audit 0; Trivy 0; Vercel-authored |

### 3.2 Development dependencies

| Package | Version | Purpose | Necessity | License | Scope | Security |
|---|---|---|---|---|---|---|
| typescript | 5.9.3 | Strict typechecking | Mandated stack | Apache-2.0 | dev | audit 0 (see Dec-1) |
| @types/node | 26.1.1 | Node type defs | Types | MIT | dev | audit 0 |
| @types/react | 19.2.17 | React type defs | Types | MIT | dev | audit 0 |
| @types/react-dom | 19.2.3 | ReactDOM type defs | Types | MIT | dev | audit 0 |
| tailwindcss | 4.3.2 | Utility CSS + OKLCH tokens (R-002) | Mandated stack | — | MIT | dev | audit 0 |
| @tailwindcss/postcss | 4.3.2 | Tailwind v4 PostCSS plugin | Tailwind v4 pipeline | MIT | dev | audit 0 |
| eslint | 9.39.4 | Lint | Mandated | MIT | dev | audit 0 (see Dec-1) |
| eslint-config-next | 16.2.10 | Next lint rules | Mandated | MIT | dev | audit 0 |
| drizzle-kit | 0.31.10 | Migration generation/apply (R-003) | Schema migrations | MIT | dev | audit 0 (esbuild override, §7) |
| vitest | 4.1.10 | Unit/integration runner | Mandated stack | — | MIT | dev | audit 0 |
| @vitejs/plugin-react | 6.0.3 | JSX transform in tests | Vitest React | MIT | dev | audit 0 |
| @vitest/coverage-v8 | 4.1.10 | Coverage | Evidence | MIT | dev | audit 0 |
| jsdom | 29.1.1 | DOM env for component tests | Mandated stack | happy-dom (less complete) | MIT | dev | audit 0 |
| @testing-library/react | 16.3.2 | Component testing | Mandated stack | — | MIT | dev | audit 0 |
| @testing-library/jest-dom | 6.9.1 | DOM assertions | Testing ergonomics | MIT | dev | audit 0 |
| @testing-library/user-event | 14.6.1 | Realistic interaction in tests | Accessibility/interaction tests | MIT | dev | audit 0 |
| @playwright/test | 1.61.1 | E2E (conversion, responsive) | Mandated stack | — | Apache-2.0 | dev | audit 0 |
| @axe-core/playwright | 4.12.1 | Automated a11y (NFR-002) | Mandated stack | — | MPL-2.0 | dev | audit 0 |
| @lhci/cli | 0.15.1 | Lighthouse CI thresholds (NFR-005/6) | Mandated stack | — | Apache-2.0 | dev | audit 0 (tmp/uuid override, §7) |
| impeccable | 3.2.1 | Design skill (critique/adapt/audit/polish) for Claude + Codex (NFR-013) | Mandated by design artifacts | — | Apache-2.0 | dev | See §7.2 |

### 3.3 pnpm build-script allowlist (`pnpm-workspace.yaml`)

Build (postinstall) scripts are blocked by default. Reviewed decisions:

| Native package | Decision | Rationale |
|---|---|---|
| esbuild | allow | Bundler binary used by vite/vitest/drizzle-kit |
| sharp | allow | Next image optimization; verified prebuilt binaries |
| unrs-resolver | allow | eslint-config-next import resolver native binary |
| puppeteer | **deny** | Only pulled by impeccable's optional live-browser feature; denied to shrink supply-chain surface (Playwright provides Chromium; guidance commands don't need it) |

---

## 4. Files created (scoped to `assistencia-tecnica/`)

No files outside this project directory were created or modified by me (CIR-002). Nothing was
committed. Key files:

**Config / tooling:** `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.nvmrc`,
`.gitignore`, `.env.example`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`,
`next.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `lighthouserc.json`,
`drizzle.config.ts`, `proxy.ts`, `.claude/settings.json`.

**CI / security:** `.github/workflows/ci.yml`, `.github/workflows/codeql.yml`,
`.github/dependabot.yml`.

**App:** `app/layout.tsx`, `app/globals.css`, `app/(marketing)/assistencia-tecnica/page.tsx`,
`app/obrigado/page.tsx`, `app/privacidade/page.tsx`.

**Components:** `components/marketing/{hero,current-process,repair-lifecycle,product-vision,benefits,
audience-fit,pilot,faq,footer,primary-cta,validation-badge,landing-content}.tsx`,
`components/forms/{lead-interest-form,contact-step,context-step,fields}.tsx`,
`components/analytics/{google-tag-manager,landing-view-tracker,thank-you-tracker}.tsx`.

**Lib:** `lib/{constants,env,db}.ts`, `lib/validation/lead.ts`, `lib/domain/options.ts`,
`lib/analytics/{events,attribution}.ts`, `lib/security/{csp,headers}.ts`,
`lib/actions/submit-lead.ts`, `lib/operations/lead-deletion.ts`.

**DB:** `db/schema.ts`, `db/migrations/0000_create_leads.sql` (+ `meta/`).

**Docs:** `README.md`, `docs/{security-operations,dependency-policy,analytics-setup,lead-deletion}.md`.

**Tests:** `tests/setup.ts`, `tests/integration.setup.ts`, `tests/stubs/empty.ts`,
`tests/fixtures/lead.ts`, `tests/helpers/db.ts`, `tests/screenshots.mjs`,
`tests/unit/{env,lead-validation,analytics-events,attribution,landing-content,lead-interest-form,
privacy-page}.test.{ts,tsx}`,
`tests/integration/{leads-schema,security-headers,submit-lead,lead-deletion}.test.ts`,
`tests/e2e/{helpers.ts,landing,landing-responsive,lead-conversion,conversion-accessibility,analytics,
analytics-privacy}.spec.ts`.

**Reports:** this file + `reports/screenshots/003-landing-assistencia-tecnica/*.png`.

---

## 5. Task completion map (T001–T087)

All 87 tasks implemented and their applicable gates run; see
`specs/003-landing-assistencia-tecnica/tasks.md` for the authoritative per-task checkboxes.

- Phase 1 Setup (T001–T014): **DONE** — reproducible pinned stack, CI+CodeQL+Dependabot, Impeccable
  installed, initial scans (audit/Trivy) clean.
- Phase 2 Foundational (T015–T029): **DONE** — env partition, leads schema+migration (replayed),
  Zod validation, analytics allowlist, nonce CSP+headers, layout/tokens, fixtures.
- Phase 3 US1 (T030–T040): **DONE** — eleven honest content areas, concept labels, Impeccable pass.
- Phase 4 US2 (T041–T055): **DONE** — two-step form, Server Action, idempotent insert, thank-you.
- Phase 5 US3 (T056–T065): **DONE** — attribution, nine events, non-blocking GTM, analytics docs.
- Phase 6 US4 (T066–T073): **DONE** — privacy page (fail-closed), deletion util+doc, README.
- Phase 7 (T074–T087): **DONE** with external items explicitly BLOCKED (CodeQL CI run, Socket,
  Secret Scanning, Dependabot readbacks, real GTM/privacy/domain values, Lighthouse — see §11/§16).

**Not "approved":** implementation is complete and evidence-backed, but the feature is NOT approved
— independent Codex QA owns that decision.

---

## 6. Technical decisions

- **Dec-1 (toolchain mutual-compatibility pins):** The registry "latest" tags for two dev tools are
  ahead of the mandated Next.js lint ecosystem, so — per the constitution's "current, **mutually
  compatible**, and locked" rule — I pinned the latest *compatible* stable instead of the absolute
  latest:
  - **TypeScript 5.9.3** (not 7.0.2). `@typescript-eslint/typescript-estree@8.63` peers
    `typescript >=4.8.4 <6.1.0`; TS 7 (native port) lacks `ts.Extension.Cjs` and crashes the ESLint
    TS parser. TS 5.9.3 is the newest supported line; strict typechecking unaffected.
  - **ESLint 9.39.4** (not 10.6.0). `eslint-config-next@16.2.10` peers `eslint >=9` and bundles
    `eslint-plugin-react@^7.37`, which calls `context.getFilename()` (removed in ESLint 10). ESLint
    9.39.4 is the newest line compatible with the Next lint config.
- **Dec-2 (Next 16 `proxy.ts`):** Next.js 16 renamed `middleware.ts` → `proxy.ts` with an exported
  `proxy` function; the nonce-based CSP is generated there (verified against Next 16 docs).
- **Dec-3 (Next 16 removed `next lint`):** the `eslint` key was removed from `next.config.ts`;
  linting runs standalone via `pnpm lint` in the ordered CI gate.
- **Dec-4 (font decision — T096, PD-006):** DESIGN.md names **Geologica** (display) + **Atkinson
  Hyperlegible Next** (prose). Both requested families are **SIL Open Font License (OFL 1.1)**,
  redistributable. `next/font/google` provides **Geologica** and **Atkinson Hyperlegible** (the
  classic family); it does **not** currently expose "Atkinson Hyperlegible Next". Per DESIGN.md's
  fallback rule ("if unavailable, choose a materially contrasting, Portuguese-capable,
  redistributable replacement and record the decision; do not fall back to a banned reflex family"),
  I use **Atkinson Hyperlegible (classic)** — the same Braille-Institute high-legibility family, OFL,
  full Latin-ext (Portuguese) coverage — loaded via the optimized framework font path (self-hosted
  at build; `font-src 'self'`). No brand mark invented. **Owner confirmation of the exact family
  (classic vs "Next") remains PD-006** before production; swapping to "Next" later is a font-file
  change only, no code change.

## 7. Security scan results (T014 baseline)

### 7.1 pnpm audit

- Initial `pnpm audit --audit-level high`: **1 HIGH** (`tmp <0.2.6`, GHSA-ph9p-34f9-6g65, via dev-only
  `@lhci/cli`), plus 3 MODERATE (`esbuild` dev-server, `postcss` via next, `uuid` via `@lhci/cli`)
  and 1 LOW (`tmp`). Full totals: 1 high, 3 moderate, 1 low, 0 critical.
- **Remediation (targeted, reviewed — not a force-fix):** `pnpm-workspace.yaml` `overrides` pin
  patched versions: `tmp ^0.2.6`, `postcss ^8.5.10`, `uuid ^11.1.1`, and scoped
  `@esbuild-kit/core-utils>esbuild ^0.25.0`. No major bumps; `npm audit fix --force` not used.
- **Post-remediation** `pnpm audit` (all levels): **0 critical / 0 high / 0 moderate / 0 low.**
  `pnpm audit --audit-level high` exit code **0**.

### 7.2 impeccable@3.2.1 supply-chain review (SEC-011)

- License Apache-2.0; single established maintainer (`paulbakaus`); npm registry signature + sha512
  integrity present; **no `preinstall`/`install`/`postinstall` lifecycle scripts** (verified via
  `npm view impeccable scripts` — only build/test/dev scripts, none auto-run on `pnpm add`).
- Transitive deps: `css-select`, `css-tree`, `domutils`, `fflate`, `htmlparser2`, `marked`
  (mainstream HTML/CSS/markdown parsers). It transitively pulls `puppeteer` for an optional
  live-browser feature — **build denied** in `allowBuilds` so no Chromium is downloaded.
- Socket app-based analysis: **READBACK REQUIRED** (not yet installed on repo — CIR-003/PD-005).
  Manual review above substitutes until Socket is enabled; the campaign gate stays BLOCKED on it.

### 7.3 Trivy (normative command)

```
trivy fs --scanners vuln,secret,misconfig --severity HIGH,CRITICAL --exit-code 1 .
```

- Trivy **0.72.0**; vuln DB downloaded fresh (99.73 MiB, 2026-07-09).
- Result: **Vulnerabilities 0, Secrets 0, Misconfigurations 0.** Exit code **0**.
- Note: Trivy suppresses dev/test deps by default (prod-scope scan). `pnpm audit` covers all
  deps (dev included) — the two are complementary defense-in-depth, as the spec requires.

### 7.4 Trivy license scan (recorded; policy review — not auto-blocking)

```
trivy fs --scanners license .
```

- 65 license findings total: 64 LOW (permissive/unencumbered), **1 HIGH**.
- HIGH: `@img/sharp-libvips-linux-x64` → `LGPL-3.0-or-later` ("restricted"). This is the native
  `libvips` binary bundled by `sharp` (Next.js image optimization).
- **Policy analysis:** LGPL-3.0 on a **dynamically-linked, unmodified, server-side** native library
  is standard and acceptable for a web deployment — the binary is not redistributed to end users and
  LGPL relinking obligations are satisfiable. It is present in essentially every Next.js deployment.
  Not a code-license contamination risk. **Flagged for owner/Codex license-policy confirmation**
  (see §14 R-2). If the owner disallows LGPL entirely, `sharp` can be dropped (Next falls back to a
  wasm image codec) since the design is code-native with minimal raster imagery.

### 7.5 Secrets

- No secret is committed. `.env*` are git-ignored; `.env.example` contains descriptive placeholders
  only (CTR-003, SEC-013). Trivy secret scan: 0. Client-bundle scan (`.next/static`): 0 matches for
  `DATABASE_URL` / `postgresql://` / the local DB password. GitHub Secret Scanning / Push
  Protection: **READBACK REQUIRED** (CIR-003).
- `ci.yml` contains a `ci_only_disposable_password` for the ephemeral PostgreSQL **service
  container** that exists only during a CI job (standard GitHub Actions pattern; never a real
  credential, never reachable externally). Trivy does not flag it. Not a secret exposure.

### 7.6 SAST (CodeQL)

- CodeQL runs in GitHub Actions only (reusable `codeql.yml`, called after Trivy, before E2E). It is
  **not run locally** by design (no unpinned ad-hoc install — quickstart). Actual CI run URL/readback
  is **PENDING** until the workflow executes on the platform (CIR-003).

---

## 13. PII / secret / client-bundle / CSP / header inspection

- **CSP / headers (live, verified via curl):** `Content-Security-Policy` with per-request nonce,
  `script-src 'self' 'nonce-…' 'strict-dynamic'` (no `unsafe-eval` in prod, no script host
  wildcards), `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`,
  `upgrade-insecure-requests`. With GTM enabled, only the required Google origins are added to
  connect/img/frame-src (verified). Static headers present: HSTS, `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, COOP.
- **Secrets:** none in source/tests/docs/reports; `.env*` git-ignored; `.env.example` has
  placeholders only. Trivy secret scan: 0.
- **Client bundle / server boundary:** `lib/db.ts` and `lib/operations/lead-deletion.ts` import
  `server-only`; `DATABASE_URL` is never referenced by client components. The Server Action returns
  only safe UI state (no IDs, no duplicate status, no SQL/stack). DB errors map to a generic
  Portuguese message (integration test asserts no `secret|5432|password|connection refused`).
- **Analytics PII:** E2E serializes the whole dataLayer after a full run with `?gclid=RAWCLICK999`
  and asserts absence of name, business name, raw gclid, answer values, and any 10–15 digit WhatsApp.
- **Logs:** DB client `onnotice` silenced, `logger:false`; no field values or query payloads logged.

## 15. Local run instructions (placeholders only)

```bash
corepack enable
pnpm install --frozen-lockfile
# disposable PostgreSQL:
docker run -d --name at-pg -e POSTGRES_USER=app_user -e POSTGRES_PASSWORD=dev_only_local_pw \
  -e POSTGRES_DB=assistencia_tecnica -p 5432:5432 postgres:16-alpine
export DATABASE_URL="postgresql://app_user:dev_only_local_pw@localhost:5432/assistencia_tecnica?sslmode=disable"
export TEST_DATABASE_URL="$DATABASE_URL"
export NEXT_PUBLIC_SITE_URL="https://example.com"   # placeholder
pnpm db:migrate
pnpm dev            # http://localhost:3000/assistencia-tecnica
# gates:
pnpm lint && pnpm typecheck && pnpm test && pnpm test:integration && pnpm build
pnpm audit --audit-level high
trivy fs --scanners vuln,secret,misconfig --severity HIGH,CRITICAL --exit-code 1 .
pnpm exec playwright install chromium && pnpm test:e2e
```

Never commit real secrets. `PRIVACY_*`, `LEAD_RETENTION_DAYS`, `NEXT_PUBLIC_GTM_ID`, and a production
`DATABASE_URL` remain owner-supplied (PD-003/PD-004).

## 14. Deviations, risks, and limitations

- **D-1 (CIR-002 side effect):** The Impeccable installer (`impeccable install`) defaulted to a
  global install and wrote a provider hook file to the **parent** workspace root at
  `/home/rafael/claude-code/.claude/settings.local.json` (a PostToolUse hook that runs Impeccable's
  read-only detector on UI edits). This is outside the project scope. The Claude Code harness
  correctly denied my attempt to delete it (it is outside `assistencia-tecnica/`). **Action for the
  owner:** remove `/home/rafael/claude-code/.claude/settings.local.json` if the global Impeccable
  hook at the workspace root is not desired. It is harmless (read-only detector) but out of scope.
- **R-2 (license policy — owner decision):** `@img/sharp-libvips-linux-x64` is `LGPL-3.0-or-later`
  (Trivy "restricted", HIGH). Analyzed as acceptable for server-side dynamic linking (see §7.4).
  Requires owner/Codex license-policy confirmation before production, or `sharp` removal if LGPL is
  disallowed. Non-blocking for implementation; recorded per plan ("license findings require policy
  review").
- **D-3 (migration file name):** the plan referenced `0001_create_leads.sql`; drizzle-kit's
  sequential convention produced `0000_create_leads.sql` (regenerated with `--name create_leads`
  from the default random suffix). Journal metadata (`meta/_journal.json`) is consistent. No
  behavioural difference.
- **D-2 (build-script allowlist):** pnpm blocked postinstall scripts by default; `puppeteer` build
  intentionally left denied (see §3.3). If Impeccable live-browser iteration is later required, a
  reviewed re-enable + Socket/Trivy check would be needed.
- **D-4 (priority_features count):** FR-019 says "twelve" choices; `data-model.md` enumerates
  **thirteen** storage slugs (the canonical field-level source, referenced by CTR-001). I implemented
  the thirteen from `data-model.md` (1–5 selectable). Minor spec inconsistency flagged for Codex; no
  security/behavioural impact.
- **R-3 (all routes dynamic — RESOLVED for perf):** the nonce CSP requires dynamic rendering (the
  layout reads the `x-nonce` header), so all routes render `ƒ` (server-rendered on demand) rather
  than static — the correct trade-off to keep `script-src 'strict-dynamic'` strict (R-008).
  Concern that dynamic rendering could miss NFR-005/006 is **resolved**: Lighthouse measured
  Performance 100, LCP 0.6s, CLS 0 on the production build (§11). No residual performance risk;
  re-measure on the real preview origin before campaign release as standard practice.
- **D-5 (Docker test stack — added at user request):** `Dockerfile` (multi-stage, non-root,
  Next standalone), `docker-compose.yml` (app + PostgreSQL, migration auto-applied via the
  committed SQL as a psql init script), `.dockerignore`, `public/.gitkeep`, and
  `next.config.ts output:"standalone"`. For **local testing only**, not production infra. Because a
  container artifact now exists, `trivy config` (SEC-006/SEC-024) was run: **0 HIGH/CRITICAL**
  Dockerfile misconfigurations. Verified end-to-end: `docker compose up --build` → landing 200,
  nonce CSP present, a real two-step submission persists one row in the containerized DB and
  redirects to the thank-you state. Compose uses a disposable local DB password (test-only).
- **R-4 (WhatsApp normalization is digits-only):** deterministic per spec, but it does not
  canonicalize the `+55` country code (because `55` is also a valid Brazilian DDD, so stripping it
  is unsafe). Thus `11955550001` and `5511955550001` are distinct leads. Low duplicate-risk; flagged
  for Codex if canonicalization is desired.

---

## 8. Database model, migrations, idempotency

- **Schema:** `db/schema.ts` — one portable `leads` table (28 columns), no proprietary extensions.
  `gen_random_uuid()` is built into PostgreSQL 13+ (verified on PG 16.14). Constraints:
  unique `(vertical, whatsapp_normalized)`, `privacy_consent = true`, whatsapp `~ '^[0-9]{10,15}$'`,
  and `vertical = 'assistencia-tecnica'` (future verticals require an approved migration).
- **Migration:** `db/migrations/0000_create_leads.sql` (+ `meta/`), generated by drizzle-kit,
  reviewed, replayable from empty. **Replay verified:** applied to a fresh PostgreSQL 16 (Docker)
  from empty → table + all constraints + unique index present; integration test
  `leads-schema.test.ts` asserts the empty-start state and every constraint (unique 23505; check
  23514 for consent, whatsapp digits, vertical). See deviation D-3 for the file name.
- **Recovery path (data-model.md §Migration):** migrations are additive/non-destructive; a failed
  migration is fixed forward (no destructive auto-rollback that could lose submitted leads). Post-
  launch schema changes require backup/restore evidence and a data-migration plan.
- **Idempotency authority:** the unique index — not the client button — guarantees one row under
  concurrent duplicates. The Server Action uses parameterized
  `insert(...).onConflictDoNothing({target:[vertical, whatsapp_normalized]})`; `inserted` and
  `existing` return an identical public `success`. **Verified:** integration tests cover first
  insert, sequential duplicate, concurrent (`Promise.all`) duplicate → exactly one row; E2E submits
  the same WhatsApp twice → both reach the thank-you state, DB `group by whatsapp having count>1`
  returns empty. Safe DB-error path returns a generic Portuguese message with no SQL/secret/stack
  (integration test asserts the message excludes `secret|5432|password|connection refused`).
- **Secret handling:** `lib/db.ts` imports `server-only`; connection URL and query payloads are
  never logged (`onnotice` silenced, `logger:false`). Integration tests use an isolated
  `TEST_DATABASE_URL` (never production).

## 9. Analytics, attribution, and PII exclusion (US3)

- **Fixed vocabulary + allowlist** (`lib/analytics/events.ts`): exactly the nine approved events;
  properties limited to `vertical`, `landing_path`, `cta_location`, `form_step`, UTM fields, and
  `gclid_present`. Unknown events/props throw in dev/test, are dropped in prod. Unit tests assert
  the nine events, PII/open-answer dropping, and `gclid_present`-only (never raw gclid).
- **Attribution** (`lib/analytics/attribution.ts`): only supported UTM keys + `gclid` read from the
  URL, trimmed, bounded (UTM ≤200, gclid ≤256), unknown keys discarded; analytics props expose only
  `gclid_present`. Persisted via hidden form inputs; the Server Action re-bounds them.
- **Exactly-once success:** the Server Action returns `success` (no server redirect); the client
  emits one `lead_submit_success` then `router.push`es to the thank-you route. E2E asserts the
  approved sequence with exactly one success and `success` ordered after `attempt`.
- **Non-blocking GTM** (`components/analytics/google-tag-manager.tsx`, rendered only when
  `NEXT_PUBLIC_GTM_ID` set): nonce'd async bootstrap + `strict-dynamic`. Verified end-to-end — CSP
  keeps `script-src 'self' 'nonce' 'strict-dynamic'` (no script host wildcards) and opens only the
  required Google origins on connect/img/frame; `gtm.js` loads via the nonce'd bootstrap.
- **Failure isolation & PII scan (T064):** E2E `analytics-privacy.spec.ts` completes the full flow
  with `?gclid=RAWCLICK999` and asserts the serialized dataLayer contains no name, business name,
  raw gclid, answer VALUES (`status_cliente`, `130_199`), or any 10–15 digit WhatsApp. Blocked-GTM
  E2E: with no dataLayer and GTM off, the form still submits and redirects (analytics degrades
  silently). **PENDING (external):** real GTM/GA4/Ads container config + preview readback (PD-004)
  — campaign gate BLOCKED.

## 10. Impeccable evidence (commands, findings, remediation)

Impeccable v3.2.1 installed (pinned devDependency + global harness skill for Claude & Codex).
`impeccable detect` (46 deterministic anti-pattern rules) run against the rendered landing HTML.

### US1 — `impeccable detect` (T040)

- **Before:** 5 anti-patterns — `nested-cards` (card-in-card in the concept view), `em-dash-overuse`
  (24 em-dashes, an AI-cadence tell), `numbered-section-markers`, and two `design-system-color`
  notes.
- **Remediation:**
  - Flattened the concept "orçamento" card into a divider-separated row (no nested card) —
    DESIGN.md "nested cards are not allowed".
  - Removed the pilot's "Passo N" numbering so the lifecycle is the ONLY numbered sequence
    (DESIGN.md).
  - Reduced em-dashes from 24 → 0 in body copy (replaced with commas/periods).
- **After:** 3 remaining, all reviewed as non-defects:
  - `design-system-color rgb(0,0,0)` / `#fff`: the detector cannot resolve OKLCH CSS variables from
    static HTML and falls back to black; the skip-link uses `--color-accent-ink` on `--color-accent`
    (both DESIGN.md tokens, AA-contrasting). `#fff` originates from framework-injected CSS, not app
    code. Accepted (intentional palette usage).
  - `numbered-section-markers "05,08,09,10,12"`: false positive — these are concept-view timestamps
    (`09:12`, `15:40`, `08:05`) and quantities read as section labels, not editorial `01/02/03`
    markers. The lifecycle ("Etapa N de 8") is the single allowed numbered sequence.
- Impeccable `critique/adapt/audit/polish` guidance skill applied during implementation; full
  cross-cutting Impeccable pass is recorded under Phase 7 (T074–T077).

### Phase 7 cross-cutting (T074–T079)

- `impeccable detect` on `/obrigado` and `/privacidade`: only the same two skip-link
  `design-system-color` false-positives (OKLCH-var → black, framework `#fff`); no real defects.
- **Accessibility (T079):** axe (`@axe-core/playwright`, WCAG 2.0/2.1/2.2 A+AA) on landing (both
  steps), thank-you, and responsive at 390×844 and 1440×900 → **zero serious/critical violations**.
  Lighthouse **Accessibility 100**. Keyboard operability, visible focus, label/error association,
  reduced-motion, 200% text scaling, and asset-fallback all covered by E2E and pass. Contrast:
  DESIGN.md OKLCH tokens; verified by axe (0 contrast violations).
- **Responsive (T075):** both target viewports pass; no horizontal overflow at 100%; content intact
  at 200% and under reduced motion; screenshots captured for all key states.
- **Visual verified:** landing screenshot reviewed — dark "Registro de Bancada" system, restrained
  amber signal, concept labels present, no generic-SaaS/cyber/fake-dashboard patterns, no nested
  cards, single numbered sequence (lifecycle), no AI em-dash cadence.

## 11. Exact commands and real results

Node v24.18.0, pnpm 11.11.0, Trivy 0.72.0, PostgreSQL 16.14 (Docker). Ordered local gate:

| Step | Command | Result | Exit | ~Time |
|---|---|---|---|---|
| lint | `pnpm lint` | clean | 0 | 14s |
| typecheck | `pnpm typecheck` | clean | 0 | 15s |
| unit | `pnpm test` | **64 passed** (7 files) | 0 | 33s |
| integration | `pnpm test:integration` | **25 passed** (4 files) | 0 | 12s |
| build | `pnpm build` | success (4 routes, all dynamic) | 0 | 53s |
| audit | `pnpm audit --audit-level high` | 0 vulnerabilities | 0 | 2s |
| Trivy | `trivy fs --scanners vuln,secret,misconfig --severity HIGH,CRITICAL --exit-code 1 .` | 0/0/0 | 0 | 27s |
| Trivy license | `trivy fs --scanners license .` | 1 HIGH (LGPL/sharp, §7.4) | 0 | — |
| E2E | `pnpm test:e2e` | **50 passed** (2 viewports × 7 specs) | 0 | ~2.9m |
| Lighthouse | `pnpm test:lighthouse` (3 runs, mobile profile) | **Perf 100, A11y 100, Best-Practices 96, SEO 100; LCP 0.6s; CLS 0** — all assertions pass | 0 | ~60s |

E2E specs: `landing` (6), `landing-responsive` (5), `lead-conversion` (5), `conversion-accessibility`
(3), `analytics` (4), `analytics-privacy` (2) — run at 390×844 and 1440×900 against a production
build with a Docker PostgreSQL.

**Lighthouse (T080, NFR-005/006, SC-009):** measured against the production build with a real
Chromium (`CHROME_PATH` = Playwright's Chromium), 3 runs. All thresholds met: Performance ≥90 (100),
Accessibility ≥95 (100), Best-Practices ≥95 (96), SEO ≥90 (100), LCP ≤2.5s (0.6s), CLS ≤0.1 (0). An
initial Best-Practices 0.93 was a favicon 404; fixed with `app/icon.svg` → 0.96.

**Not runnable in this environment (recorded, not passed):**
- **CodeQL** — runs only in GitHub Actions (`codeql.yml`, ordered after Trivy, before E2E). No
  unpinned local run (quickstart). CI run URL PENDING (CIR-003).

## 12. Security section (required by `spec_seguranca_codigo_supply_chain.md` §9)

```
## Segurança
- Trivy executado: sim (fs vuln,secret,misconfig HIGH,CRITICAL exit 1 -> 0 findings; + license scan)
- Semgrep ou CodeQL executado: configurado (CodeQL reusable workflow, ordered after Trivy);
    execução real na plataforma PENDENTE (CIR-003)
- pnpm audit executado: sim (--audit-level high -> exit 0 após overrides direcionados)
- Testes executados: unit/integration/e2e — ver §11 por fase (Phase 1: apenas scans)
- Novas dependências: baseline aprovada (ver §3); nenhuma fora do baseline sem justificativa
- Vulnerabilidades encontradas: 1 HIGH + 3 MODERATE + 1 LOW (todas transitivas dev via @lhci/cli,
    drizzle-kit, next)
- Vulnerabilidades corrigidas: todas via overrides direcionados (tmp, postcss, uuid, esbuild) -> 0
- Exceções pendentes: nenhuma (CTR-005 não utilizado). Item de licença LGPL registrado para revisão
    de política (não é exceção de vulnerabilidade/segredo)
- Segredos detectados: não
- Riscos conhecidos: ver §14; controles externos (Socket/Secret Scanning/CodeQL run/Dependabot)
    exigem readback de administrador — BLOCKED, nunca "pass"
```

---

## 17. Phase 8 Convergence delta (T088–T097) — response to Codex `CHANGES_REQUIRED`

Addressed all ten convergence findings (F1–F10). External BLOCKED / owner items were **not** touched
or marked as passed. Diff limited to `assistencia-tecnica/` (CIR-002); no commit made.

| Task | Finding | Fix | Evidence |
|---|---|---|---|
| T088 | F1 CTR-001 honeypot `values:{}` | Honeypot now returns `values: safeValues(formData)` (honeypot field excluded), same as DB-error path | `submit-lead.ts`; integration test asserts non-empty preserved `name`, honeypot field absent, 0 rows |
| T089 | F2 FR-036 no contact link | Footer adds "Contato e remoção de dados" → `/privacidade#direitos` | `footer.tsx`; unit test asserts both `/privacidade` and `/privacidade#direitos` |
| T090 | F3 lifecycle card grid | Redesigned as a ruled **ledger strip** (one panel, divided rows, muted `n/8` markers), single numbered order kept | `repair-lifecycle.tsx`; screenshot; detector no longer flags card grid |
| T091 | F4 amber wallpaper | Amber reduced to CTA + one next-action pill + form active step + focus; lifecycle amber-free; concept done-dots neutral, amber only on the current step; multi-select checked state neutralized | grep: only `validation-badge` dot + single current timeline dot remain in marketing |
| T092 | F5 13-option priority wall | Grouped the 13 slugs into 5 workshop categories (`PRIORITY_FEATURE_GROUPS`); 1–5 unique rule + 13 slugs unchanged | `options.ts`, `fields.tsx`, `context-step.tsx`; form unit tests pass |
| T093 | F6 checkbox group not synced | `CheckboxGroupField` re-syncs checked state from server-echoed `values.priority_features` on invalid/error (only when the echo changes, never clobbering local toggles) | `fields.tsx` `useEffect` |
| T094 | F7 uppercase kickers | Concept labels are sentence-case badges ("Conceito"); no uppercase/tracking eyebrows remain | grep: 0 `uppercase`/`tracking-wide` in components |
| T095 | F8 standalone vs `pnpm start` | `output:"standalone"` gated on `BUILD_STANDALONE=1` (Dockerfile only); local `pnpm start`/Playwright/LHCI use normal `next start` — no warning; Docker rebuilt + verified 200 | `next.config.ts`, `Dockerfile`; start log has no standalone warning |
| T096 | F9 Atkinson classic vs "Next" | Recorded font decision + OFL evidence (Dec-4, §6); classic Atkinson used (Next unavailable in next/font/google); PD-006 owner confirmation still pending | §6 Dec-4 |
| T097 | F10 P1s after claimed close | Re-ran `impeccable detect` after fixes → 0 real defects (only the 2 skip-link OKLCH/`#fff` false-positives + concept-timestamp false-positive); design findings closed; before/after in §10 | detector output; landing screenshot reviewed |

### Convergence gate re-run (fresh)

| Gate | Result | Exit |
|---|---|---|
| lint | clean, **0 warnings** (screenshots.mjs console silenced) | 0 |
| typecheck | clean | 0 |
| unit | **64 passed** | 0 |
| integration | **25 passed** (incl. new honeypot value-preservation assertion) | 0 |
| build | success | 0 |
| audit high | 0 vulnerabilities | 0 |
| Trivy vuln/secret/misconfig | 0/0/0 | 0 |
| E2E | **50 passed** (390×844 + 1440×900) | 0 |
| Lighthouse | Perf 97 / A11y 100 / BP 96 / SEO 100 / LCP 1.0s / CLS 0 | 0 |
| Docker (`docker compose up`) | app 200, DB migrated, standalone rebuilt | — |

### Still BLOCKED / owner (unchanged — NOT passes)

CodeQL real CI run; Socket/Dependabot/Secret-Scanning/Push-Protection/branch-protection readbacks
(PD-005); real GTM/GA4/Ads (PD-004); privacy controller/contact/retention (PD-003); production DB +
canonical origin (PD-001/PD-004); LGPL/`sharp` policy (R-2); parent Impeccable hook file (D-1);
FR-019 "twelve"→thirteen spec wording (Codex/spec). Codex re-review required; no self-approval.

## 16. Campaign release gate matrix

Claude Code does **not** self-approve. Implementation gates PASS locally; production/campaign gates
remain BLOCKED pending owner inputs and external readbacks.

| Gate item | Status | Evidence / owner |
|---|---|---|
| Lint / typecheck / unit / integration / build | **PASS** | §11 (all exit 0) |
| pnpm audit (high) | **PASS** | 0 vulnerabilities after targeted overrides (§7.1) |
| Trivy vuln/secret/misconfig | **PASS** | 0/0/0 (§7.3) |
| Trivy license (LGPL/sharp) | **PASS w/ note** | policy review by owner (§7.4, R-2) |
| E2E (a11y/responsive/conversion/analytics) | **PASS** | 50 passed, 2 viewports (§11) |
| Idempotency (unique row under concurrency) | **PASS** | integration + E2E (§8) |
| PII-free analytics / logs / bundle | **PASS** | §9, §13 |
| Nonce CSP + security headers | **PASS** | §13 (curl-verified) |
| Target screenshots (synthetic) | **PASS** | `reports/screenshots/003-landing-assistencia-tecnica/` |
| Lighthouse ≥90 / LCP / CLS | **PASS** | Perf 100 / A11y 100 / BP 96 / SEO 100 / LCP 0.6s / CLS 0 (§11) |
| CodeQL SAST (real CI run) | **BLOCKED** | GitHub Actions run/readback (CIR-003, admin) |
| Dependabot / Socket / Secret Scanning / Push Protection / branch protection | **BLOCKED** | admin readbacks (PD-005) |
| Real GTM/GA4/Ads config + conversion preview | **BLOCKED** | PD-004 |
| Privacy controller/contact/retention | **BLOCKED** | PD-003 (privacy page fails closed) |
| Production `DATABASE_URL` + canonical origin | **BLOCKED** | PD-001/PD-004 |
| Independent Codex QA decision | **PENDING** | Codex (`checklists/release-review.md`) |

**No paid traffic** until every BLOCKED item is resolved and Codex issues `APPROVED` /
`APPROVED_WITH_NOTES`.
