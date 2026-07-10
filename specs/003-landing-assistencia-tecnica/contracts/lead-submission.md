# CTR-001: Lead Submission Contract

## Interface

One two-step browser form submits to one Server Action. This is not a public REST API. The browser
receives safe UI state only; never database IDs, duplicate status, SQL/provider errors, stack traces,
or stored PII.

## Step 1 Input

| Field | Required | Rule |
|---|---:|---|
| `name` | yes | Trimmed 2-100 characters. |
| `business_name` | yes | Trimmed 2-120 characters. |
| `whatsapp` | yes | Human-format input; normalize and accept only a valid 10-15 digit result. |
| `email` | no | Empty -> null; otherwise trimmed/lowercase, valid, <=254 characters. |
| `segment` | yes | One value from `repair_categories`; stored as a single-item answer array. |

Step 1 completes only when all required fields are valid. Client validation may accelerate feedback,
but the server contract is authoritative.

## Step 2 Input

| Field | Required | Rule |
|---|---:|---|
| `team_size` | yes | One defined enum value. |
| `monthly_intakes` | yes | One defined enum value. |
| `current_process` | yes | One defined enum value. |
| `main_bottleneck` | yes | One defined enum value. |
| `priority_features` | yes | 1-5 unique defined values. |
| `customer_status_frequency` | yes | One defined enum value. |
| `price_range` | yes | One defined enum value. |
| `interview_permission` | no | Boolean, false unless actively selected. |
| `privacy_consent` | yes | Must be actively true; no preselection. |
| honeypot | internal | Must remain empty; inaccessible to normal keyboard/AT flow and not a password-manager target. |

Allowed storage values and Portuguese labels are defined in `data-model.md`; the UI displays plain
labels, never storage slugs.

## Attribution Input

Only `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` (<=200 each) and `gclid`
(<=256) are accepted. They are trimmed and inert. Unknown properties are discarded. `vertical`,
`landing_path`, consent time, notice version, and creation time are never trusted from the browser.

## Public Result

| Result | Shape / user behavior | Analytics behavior |
|---|---|---|
| `invalid` | Approved field-error keys, optional safe form message, values preserved, focus guidance. | `lead_form_validation_error`; no success. |
| `error` | Generic retryable Portuguese message, values preserved, no internal detail. Also covers suspected automation without naming the mechanism. | `lead_submit_error`; no success. |
| `success` | Same response for inserted or existing lead; no lead/database ID; redirect to allowed thank-you URL. | Exactly one `lead_submit_success`, then `thank_you_view`. |

Pending starts before the call and disables repeated submission without hiding the button. Database
conflict maps to public `success`; other database errors map to `error`. Redirect is a server constant.

## Security and Privacy Invariants

- One shared schema supports the form and action, but the action revalidates every value.
- The server builds an explicit insert object; spreading raw form data into persistence is forbidden.
- ORM/database operations are parameterized.
- Error/log/report paths include no field values.
- The action cannot select arbitrary redirects, verticals, landing paths, or JSONB keys.
- No device password, pattern, credential, customer name, repair description, or customer equipment
  data is accepted.

## Contract Test Obligations

- Every boundary/enum/array rule and normalization case.
- Consent false/absent, honeypot populated, unknown fields, overlong attribution, HTML/script text,
  and manipulated vertical/path.
- First insert, sequential duplicate, concurrent duplicate, database failure, and migration replay.
- Public inserted/existing result equality and absence of IDs/PII/internal errors.
