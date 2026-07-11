# PD-005 security readback — 2026-07-10

Repo: https://github.com/routor/assistencia-tecnica
Owner decisions: `owner-decisions-2026-07-10.md`

| Control | Status | Evidence |
|---|---|---|
| Visibility | public | API `visibility=public` |
| Dependabot alerts | enabled | `PUT .../vulnerability-alerts` → 204 |
| Dependabot security updates | enabled | `security_and_analysis.dependabot_security_updates=enabled` |
| Secret Scanning | enabled | `secret_scanning.status=enabled` |
| Push Protection | enabled | `secret_scanning_push_protection.status=enabled` |
| CodeQL standalone | PASS | https://github.com/routor/assistencia-tecnica/actions/runs/29117932826 |
| CI (Trivy → CodeQL → E2E/LH) | PASS | https://github.com/routor/assistencia-tecnica/actions/runs/29117934967 |
| Branch protection (`main`) | PASS | Ruleset `Protect main` id `18789276` — https://github.com/routor/assistencia-tecnica/rules/18789276 |
| Socket GitHub App | **PENDING** | Install only on this repo: https://github.com/apps/socket-security — then capture install + first-scan screenshot/URL |

## Ruleset parameters recorded

- Pull request required
- Required approving review count: **0** (solo maintainer)
- Required review thread resolution: true
- Required status checks (strict / branch up to date):
  - `Lint / Types / Tests / Build / Audit / Trivy`
  - `CodeQL SAST / Analyze (javascript-typescript)`
  - `E2E (axe/responsive) + Lighthouse`
  - `Analyze (javascript-typescript)`
- `non_fast_forward` (blocks force-push)
- `deletion` blocked
