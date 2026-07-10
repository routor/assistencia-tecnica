# Dependency Policy (SEC-002, SEC-003)

External dependencies are minimized and justified. The existing web platform / Next / React / CSS is
always preferred over a new package.

## Before adding ANY package (including baseline)

Record the full eight-field row in `reports/claude-execution-003-landing-assistencia-tecnica.md`:

| Field | Required |
|---|---|
| Package | exact name |
| Version | exact locked version (no ranges) |
| Purpose | problem solved |
| Necessity | why the existing stack/platform is insufficient |
| Alternatives | alternatives evaluated |
| License | identified license |
| Scope | production or development |
| Security | Socket / `pnpm audit` / Trivy / maintainer / install-script result |

Then:

1. `pnpm add -E <pkg>` (exact pin). Never a floating range.
2. pnpm blocks postinstall build scripts by default; approve each in `pnpm-workspace.yaml`
   `allowBuilds` only after review (recorded).
3. Run `pnpm audit --audit-level high` and `trivy fs …`; obtain Socket analysis (once installed).
4. Codex reviews `package.json` + `pnpm-lock.yaml`; an unexplained change **blocks approval**.

## Forbidden

- Convenience libraries reproducible with the existing stack.
- `npm audit fix --force` or any broad/destructive auto-fix. Upgrades are targeted + fully
  regression-gated.
- Unpinned `npx` gate tools. Floating action tags (actions are pinned to commit SHAs).
- Silent additions or lockfile mutations in CI (`pnpm install --frozen-lockfile`).

## Remediation of transitive vulnerabilities

Use a minimal, in-range `overrides` entry in `pnpm-workspace.yaml` pinning the known-patched version
(e.g. the `tmp`/`postcss`/`uuid`/`esbuild` overrides applied at initialization). Record each in the
report. Never suppress a finding to release.
