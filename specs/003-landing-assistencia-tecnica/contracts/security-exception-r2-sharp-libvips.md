# CTR-005 Exception — R-2 sharp / libvips (LGPL)

**Status:** `accepted_temporarily`
**Recorded:** 2026-07-10
**Accepting owner:** Rafael Outor
**Feature:** `003-landing-assistencia-tecnica`
**Related:** owner decision R-2 in `owner-decisions-2026-07-10.md`

This exception does **not** authorize disabling scanners, lowering severity thresholds, retaining
secrets, force-fixing, or accepting unmitigated Critical/High vulnerability risk.

## Required fields (CTR-005)

| Field | Value |
|---|---|
| `vulnerability_id` | `TRIVY-LICENSE-LGPL-sharp-libvips` (Trivy license scanner HIGH / restricted: `LGPL-3.0-or-later` on `@img/sharp-libvips-*`) |
| `component` | `sharp@0.34.5` (transitive via Next.js image optimization); native `@img/sharp-libvips-linux-x64@1.2.4` and sibling platform packages `@img/sharp-libvips-*@1.2.4` |
| `technical_justification` | Next.js production image optimization relies on `sharp` + prebuilt libvips. Removing it degrades image pipeline / LCP path without a same-stack replacement already approved in the fixed stack. Immediate removal is deferred by owner for this validation stage. |
| `estimated_impact` | **Confidentiality:** none from license alone. **Integrity/availability:** none from license alone. **Privacy:** none. **Legal/compliance:** LGPL-3.0-or-later obligations for an unmodified, dynamically linked, server-side native library (relinking / source offer for libvips as applicable). **Exploitability:** N/A (license finding, not a CVE). |
| `existing_mitigation` | Unmodified upstream prebuilt binaries only; no custom libvips fork; server-side use; lockfile pinned (`pnpm-lock.yaml`); Trivy license scan remains enabled and recorded; dependency changes still require SEC-002 justification + Codex review; Socket/Dependabot/CodeQL remain in gate path. |
| `accepting_owner` | Rafael Outor (`rafael.outor@gmail.com`) |
| `review_deadline` | **2026-10-10** (or earlier on next major `sharp` / Next image-stack change) |

## Additional record

| Field | Value |
|---|---|
| Severity (tool) | HIGH (Trivy license / restricted) |
| Tool | Trivy `fs --scanners license` |
| Discovery | Claude execution report §7.4 / R-2; Codex QA |
| Environments | local, Preview, Production (when deployed) |
| Remediation owner | Rafael Outor (policy); Claude Code if owner later rejects LGPL |
| Planned fix | Keep `sharp` this stage; re-evaluate at review deadline or stack upgrade; alternative is drop `sharp` if policy changes |
| Evidence | `pnpm-lock.yaml` pins; `reports/claude-execution-003-landing-assistencia-tecnica.md` §7.4; this file |
| Closure readback | Pending future review on/before `review_deadline` |

## Explicit non-authorizations

- Do not disable Trivy license scanning.
- Do not treat this as approval of any CVE Critical/High.
- Do not substitute a different image stack without a new SEC-002 record and Codex review.
