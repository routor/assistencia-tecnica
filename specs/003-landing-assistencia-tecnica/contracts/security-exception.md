# CTR-005: Security Exception Record

Exceptions are explicit, time-bounded records. They never authorize scanner disabling, severity
reduction, retained secrets, force-fixing, or unaccepted Critical/High release risk.

## Required Fields

| Field | Requirement |
|---|---|
| `vulnerability_id` | Scanner/advisory/rule ID; stable internal ID only if no public ID exists. |
| `component` | Affected package, file, action, configuration, or service and version/commit. |
| `technical_justification` | Why immediate correction is not safely possible; convenience/deadline is invalid. |
| `estimated_impact` | Confidentiality, integrity, availability, privacy, and exploitability. |
| `existing_mitigation` | Concrete compensating control and evidence; “low risk” is insufficient. |
| `accepting_owner` | Named accountable human; Claude Code/Codex cannot self-accept. |
| `review_deadline` | ISO date before mitigation/control expiry. |

Also record severity, tool, discovery date, affected environments, remediation owner, planned fix,
non-secret evidence links, and closure readback.

## Lifecycle

`draft -> security_review -> accepted_temporarily | rejected -> remediated -> verified_closed`.
Delivery stays blocked while required fields/owner are absent or the record conflicts with the
severity policy. Codex cannot approve an exception merely because CI was made green.
