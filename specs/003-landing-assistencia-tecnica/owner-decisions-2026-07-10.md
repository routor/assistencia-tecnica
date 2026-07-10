# Owner Decisions — 2026-07-10

Accountable owner: **Rafael Outor** (`rafael.outor@gmail.com`).
Feature: `003-landing-assistencia-tecnica`.
Source: owner message recorded by Codex on 2026-07-10.

These decisions update PD-001–PD-006, R-2, and D-1. They do **not** authorize campaign
traffic or declare Production ready while canonical domain / GTM / GA4 / Ads remain unset.

---

## PD-001 — Database (RESOLVED)

| Field | Decision |
|---|---|
| Provider | **Neon PostgreSQL** |
| Environments | Isolated Neon **branches** for Production and Preview |
| Connection | `DATABASE_URL` only — server-side; distinct values per Vercel Production and Preview |
| Forbidden | `NEXT_PUBLIC_DATABASE_URL` must never exist |

Standard PostgreSQL compatibility and least-privilege remain mandatory.

## PD-002 — Brand and contact (RESOLVED — provisional)

| Field | Decision |
|---|---|
| Public name | **Assistência Técnica Pro** (temporary for validation) |
| Visual identity | Textual only — **no logo** invented or created |
| Authorized contact | **Rafael Outor** / `rafael.outor@gmail.com` |

## PD-003 — Privacy / LGPD (RESOLVED)

| Field | Decision |
|---|---|
| Controller | Rafael Outor, responsável pelo projeto Assistência Técnica Pro. |
| Rights / deletion channel | `rafael.outor@gmail.com` |
| Retention | `LEAD_RETENTION_DAYS=180` |
| After retention | Delete or anonymize per specification |

Env mapping:

```env
PRIVACY_CONTROLLER_NAME="Rafael Outor, responsável pelo projeto Assistência Técnica Pro."
PRIVACY_CONTACT="rafael.outor@gmail.com"
LEAD_RETENTION_DAYS=180
```

## PD-004 — Domain and analytics (PARTIAL)

| Field | Decision |
|---|---|
| Invented domain / IDs | **Forbidden** |
| Preview | Use real Vercel preview URL; keep Preview **out of indexing** |
| Campaign blockers (still open) | `NEXT_PUBLIC_SITE_URL=<canonical real>` and `NEXT_PUBLIC_GTM_ID=<real GTM>` before campaign |
| GA4 / Google Ads | Configured **inside GTM** when IDs exist |
| Consent | Analytics/ads must respect the project consent mechanism |

**Campaign and Production readiness remain BLOCKED** until real canonical origin + GTM (+ GA4/Ads in GTM) are supplied.

## PD-005 — Repository security (PARTIAL)

| Control | Status / decision |
|---|---|
| Repo | `routor/assistencia-tecnica` |
| Dependabot / Secret Scanning / Push Protection / CodeQL CI | Enabled with evidence (see QA/GitHub readbacks) |
| Socket | Install Socket GitHub App **only** on `routor/assistencia-tecnica`; record install + first-scan readback (**pending install evidence**) |
| Branch protection `main` | **RESOLVED** — ruleset `Protect main` (`18789276`): PR required, 0 human approvals, CI + CodeQL + E2E required, strict up-to-date, conversation resolution, no force-push/delete — https://github.com/routor/assistencia-tecnica/rules/18789276 |

Proceed with **Preview deploy** after applicable configs. Do **not** start campaign or declare Production ready without real domain/GTM/GA4/Ads.

## PD-006 — Fonts (RESOLVED)

| Role | Family |
|---|---|
| Body / UI / reading | **Atkinson Hyperlegible Classic** via `next/font` |
| Display / emphasis | **Geologica** via `next/font` |

Do **not** migrate to Atkinson Hyperlegible Next in this stage. Current implementation retained.

## R-2 — sharp / libvips (RESOLVED — exception accepted)

- Keep `sharp` / Next image optimization path.
- Accept CTR-005 exception for libvips LGPL — see
  `contracts/security-exception-r2-sharp-libvips.md`.
- Do not remove or replace the dependency in this stage.

## D-1 — Impeccable settings (RESOLVED — migrate)

1. Merge needed hooks from `/home/rafael/claude-code/.claude/settings.local.json` into
   `/home/rafael/claude-code/assistencia-tecnica/.claude/settings.local.json`.
2. Validate project-local file.
3. Remove parent file to avoid neighbor impact (CIR-002).

---

## Release posture after these decisions

| Gate | Posture |
|---|---|
| Implementation / Phase 8 | Unchanged: `APPROVED_WITH_NOTES` |
| Preview deploy | Allowed after Neon Preview branch + Vercel Preview env (PD-001/003) + branch protection + Socket install attempt |
| Campaign / paid traffic | **BLOCKED** on PD-004 real values + Socket readback if still missing |
| Production “ready” | **BLOCKED** until PD-004 complete and campaign gates pass Codex |
