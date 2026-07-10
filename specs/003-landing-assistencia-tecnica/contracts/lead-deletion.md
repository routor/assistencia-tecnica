# CTR-004: Lead Deletion Procedure Contract

## Preconditions

1. Controller identity, request channel, authorized operator, retention period, and escalation
   contact are approved before production.
2. The requester is verified through an approved out-of-band process proportionate to the contact
   data; no identity document is collected by the landing.
3. The operator uses a least-privilege database path outside the public application; no admin
   dashboard is added.

## Procedure

1. Record the request in the approved private operational system with a non-sensitive ticket ID and
   no unnecessary PII copy.
2. Normalize the supplied contact using the same reviewed rule as submission.
3. Query only minimal matching lead fields and vertical; do not export unrelated rows.
4. Confirm scope with the verified requester if more than one vertical record can exist.
5. Hard-delete the selected lead in a transaction; do not copy it into project logs/reports.
6. Read back only a non-sensitive deletion outcome/count and close within the published timeframe.
7. If deletion fails, retain the private request, escalate safely, and do not claim completion.

## Evidence and Safety

- Application/CI logs contain no queried values or deleted row content.
- Codex QA uses synthetic data and confirms target deletion without collateral records.
- Provider backup retention is reflected honestly; do not promise immediate backup erasure if the
  provider cannot supply it.
- An approved retention job or operational schedule is required before campaign release once the
  retention period is set; indefinite retention is forbidden.
