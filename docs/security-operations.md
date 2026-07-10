# Security Operations — Landing Assistência Técnica

Operational runbook for the mandatory supply-chain and secret controls
(`spec_seguranca_codigo_supply_chain.md`, SEC-001…SEC-024). Items marked **READBACK REQUIRED** need
a repository/organization administrator to enable the control and confirm; Claude Code cannot enable
them from code and must not represent an unavailable control as passed (CIR-003, PD-005).

## 1. Ordered CI gate (SEC-017)

Enforced by `.github/workflows/ci.yml` via `needs:` job ordering:

```
frozen install -> lint -> typecheck -> unit -> integration -> build
  -> pnpm audit --audit-level high
  -> Trivy (vuln,secret,misconfig HIGH,CRITICAL exit 1) + Trivy license
  -> CodeQL (needs: build-and-scan)          # SAST depends on the Trivy gate
  -> E2E + Lighthouse (needs: codeql)        # depends on successful SAST
  -> Claude execution report -> independent Codex review
```

A later job never reports success when an earlier gate failed. All third-party actions are pinned to
immutable commit SHAs with least permissions and explicit timeouts.

## 2. Trivy (SEC-006, SEC-007)

Normative filesystem command (also runnable locally, identical to CI):

```bash
trivy fs --scanners vuln,secret,misconfig --severity HIGH,CRITICAL --exit-code 1 .
trivy fs --scanners license .
```

HIGH/CRITICAL vulnerabilities, exposed secrets, or misconfigurations block delivery. Findings are
never suppressed to release. Any exception uses the CTR-005 record with all seven fields.

## 3. Dependabot (SEC-010)

`.github/dependabot.yml` enables weekly `npm` (pnpm) and `github-actions` updates. **No auto-merge.**
Every Dependabot PR must pass the full CI gate and receive Codex review before merge. Alerts and
Security Updates must be enabled in repository settings — **READBACK REQUIRED**.

## 4. Socket (SEC-011)

Install the Socket GitHub app on the repository/organization so every dependency-changing PR receives
automated analysis of: install scripts, obfuscation, unexpected network/shell/filesystem/environment
access, typosquatting, recent maintainer changes, and other supply-chain-compromise signals.
**READBACK REQUIRED.** Until installed, dependency additions are reviewed manually (see §8) and the
related campaign gate stays BLOCKED.

## 5. Secret scanning & push protection (SEC-012…SEC-014)

Enable **GitHub Secret Scanning** and **Push Protection** in repository settings — **READBACK
REQUIRED**. Trivy secret scanning runs regardless. Secrets are forbidden in source, versioned files,
docs, tests, examples, logs, screenshots, and reports (SEC-013); only environment/secret stores hold
them (CTR-003).

### Secret incident procedure (CTR-003 §Secret Incident, SEC-014)

1. Block delivery immediately.
2. Revoke the exposed credential.
3. Issue a new credential.
4. Review logs and git history for exposure/usage.
5. Document the incident **without reproducing the secret value**.
6. Re-run secret scanners and obtain Codex review.

Deleting the offending file alone is insufficient.

## 6. Branch protection (future/optional, PD-005)

Recommended for `main` once repository entitlement is confirmed — **READBACK REQUIRED**:
required status checks (the CI gate + CodeQL), required review, no force-push, and (optionally)
CODEOWNERS review. Not auto-configurable from code.

## 7. GitHub Actions pinning (SEC-017, R-007)

All actions are pinned to full commit SHAs with a trailing `# vX.Y.Z` comment. Tags/branches are
never used for third-party actions. Production secrets are never exposed to untrusted-PR runs.
Current pins:

| Action | Version | SHA |
|---|---|---|
| actions/checkout | v4.2.2 | `11bd71901bbe5b1630ceea73d27597364c9af683` |
| actions/setup-node | v4.4.0 | `49933ea5288caeca8642d1e84afbd3f7d6820020` |
| pnpm/action-setup | v4.1.0 | `7088e561eb65bb68695d245aa206f005ef30921d` |
| github/codeql-action (init, analyze) | v3.29.0 | `b1722c1245f90604c2c348f9d1624af97ea8fc6e` |
| aquasecurity/trivy-action | 0.35.0 | `57a97c7e7821a5776cebc9bb87c984fa69cba8f1` |

## 8. New-dependency procedure (SEC-002, SEC-003)

Before adding any package (including baseline):

1. Record the eight-field row (package, version, purpose, necessity, alternatives, license,
   prod/dev scope, security result) in the execution report.
2. Run local `pnpm audit`, Trivy, and review install scripts. pnpm blocks postinstall build scripts
   by default; each allowed build is recorded in `pnpm-workspace.yaml` `allowBuilds`.
3. Run/obtain Socket analysis on the change (once installed).
4. Codex reviews `package.json` + `pnpm-lock.yaml`; unexplained changes block approval.

Never add convenience libraries reproducible with the existing stack. Never use
`npm audit fix --force` or unpinned `npx` gate tools.

## 9. Severity policy (SEC-018)

| Severity | Action |
|---|---|
| Critical | Immediate block |
| High | Block |
| Medium | Mandatory analysis + record |
| Low | Risk-based planned correction |
| Exposed secret | Immediate block + rotation |

## 10. Administrator readback checklist (PD-005)

| Control | Status |
|---|---|
| Dependabot Alerts + Security Updates enabled | READBACK REQUIRED |
| Socket app installed on repo/org | READBACK REQUIRED |
| GitHub Secret Scanning enabled | READBACK REQUIRED |
| Push Protection enabled | READBACK REQUIRED |
| Branch protection on `main` | READBACK REQUIRED |
| CodeQL enabled (code scanning) | READBACK REQUIRED |

Until each is confirmed, the corresponding release/campaign gate is **BLOCKED**, never PASS.
