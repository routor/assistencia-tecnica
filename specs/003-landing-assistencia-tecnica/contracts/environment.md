# CTR-003: Environment and External Configuration Contract

No real value or secret may be committed, placed in examples, printed in reports, or exposed to the
client unless explicitly classified public below. Examples use descriptive placeholders only.

| Name / setting | Classification | Required when | Validation / behavior |
|---|---|---|---|
| `DATABASE_URL` | secret, server-only | integration, preview, production | Valid pooled PostgreSQL URL for least-privilege role; fail closed on missing/invalid. |
| `TEST_DATABASE_URL` | secret, server/test-only | database integration tests | Isolated disposable PostgreSQL database; never production. |
| `NEXT_PUBLIC_SITE_URL` | public | preview/production metadata | Absolute HTTPS origin; allowlisted; required for canonical/social URLs. |
| `NEXT_PUBLIC_GTM_ID` | public | analytics-enabled preview/production | Expected GTM ID format; absent disables local analytics but fails campaign gate. |
| `PRIVACY_CONTROLLER_NAME` | public content, server-read | production | Non-placeholder approved controller identity. |
| `PRIVACY_CONTACT` | public content, server-read | production | Approved public email/URL for rights/deletion. |
| `LEAD_RETENTION_DAYS` | public policy, server-read | production | Positive owner/legal-approved integer reflected in privacy process. |
| GitHub repository settings | external control | PR/production | Dependabot, CodeQL, secret/push/branch protection readbacks. |
| Socket integration | external control | dependency changes | Repository installation and PR analysis readback. |
| GTM/GA4/Ads settings | external control | campaign release | Previewed/published tags; conversion only on approved success event. |

Environment parsing uses an explicit schema and names only a missing variable, never its value.
Server-only modules must not be imported by client components. Public identifiers still require
bounds and do not authorize arbitrary script URLs.

## Environment Matrix

- **Local documentation/unit UI**: database/analytics may be disabled only for tests that do not
  claim persistence/conversion acceptance.
- **Integration**: isolated `TEST_DATABASE_URL`, migrations, clean teardown, synthetic data.
- **Preview**: real non-production database, preview origin, headers, GTM preview, scanners and E2E;
  no production contact data.
- **Production**: all owner inputs non-placeholder, least-privilege database, published privacy,
  external security controls, validated conversion, and Codex approval.

## Secret Incident Contract

If any secret is detected: stop delivery, revoke, rotate, inspect history/logs, document the
incident without reproducing the value, rerun secret scanners, and obtain Codex review. Deleting the
file alone is insufficient.
