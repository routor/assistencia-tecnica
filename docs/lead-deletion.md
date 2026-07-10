# Lead Deletion Procedure (CTR-004)

Authorized, least-privilege operational procedure for removing a lead on request. There is **no
admin dashboard** — deletion is performed out-of-band by an authorized operator. No lead PII is ever
copied into project logs, reports, or tickets.

## Preconditions (approved before production)

- Named controller, request channel, authorized operator, retention period, and escalation contact
  (PD-003). Until these exist, the campaign gate stays **BLOCKED**.
- The requester is verified through an approved out-of-band process proportionate to the contact
  data. The landing collects **no** identity document.
- The operator uses a **least-privilege database role** outside the public application.

## Procedure

1. Record the request in the approved private operational system with a non-sensitive ticket ID and
   **no unnecessary PII copy**.
2. Normalize the supplied contact using the same reviewed rule as submission (digits-only, 10–15).
3. Locate only the minimal matching row for the vertical:
   ```sql
   -- parameterized; never string-interpolated
   SELECT id FROM leads
   WHERE vertical = $1 AND whatsapp_normalized = $2;
   ```
4. Confirm scope with the verified requester if more than one vertical record can exist.
5. Hard-delete in a transaction (see `lib/operations/lead-deletion.ts`,
   `deleteLeadByContact(rawWhatsapp, vertical)`), which returns only a non-sensitive count:
   ```
   deleteLeadByContact("<contato>", "assistencia-tecnica") -> { deleted: 0 | 1 }
   ```
6. Read back only the non-sensitive outcome/count and close within the published timeframe.
7. If deletion fails, retain the private request, escalate safely, and **do not claim completion**.

## Evidence & safety

- Application/CI logs contain no queried values or deleted row content.
- QA uses synthetic data only and confirms target-only deletion without collateral rows
  (`tests/integration/lead-deletion.test.ts`).
- **Provider backups:** deletion removes the primary row immediately; managed-provider backup
  retention is honored honestly — do not promise immediate backup erasure the provider cannot
  deliver. Backups age out per the provider's retention window.
- Once a retention period is set, an approved retention job/operational schedule is required before
  campaign release. Indefinite retention is forbidden.
