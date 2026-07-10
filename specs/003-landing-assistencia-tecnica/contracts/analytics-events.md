# CTR-002: Privacy-Safe Analytics Contract

## Event Vocabulary

| Event | Trigger | Cardinality in one browser journey |
|---|---|---|
| `landing_view` | `/assistencia-tecnica` becomes the active landing view. | Once per page view. |
| `primary_cta_click` | Intentional activation of a primary CTA. | Per activation; includes `cta_location`. |
| `lead_form_start` | First meaningful form interaction. | Once per form session. |
| `lead_form_step_1_complete` | Valid transition from step 1 to step 2. | Once per form session, even after back navigation. |
| `lead_form_validation_error` | A step/submit attempt returns validation errors. | Once per failed attempt; no values. |
| `lead_submit_attempt` | One enabled submit activation begins. | Once per accepted attempt. |
| `lead_submit_success` | Public action result is success after inserted/existing persistence outcome. | Exactly once per successful attempt; only Google Ads conversion event. |
| `lead_submit_error` | Public action result is a retryable error. | Once per failed attempt. |
| `thank_you_view` | Allowed thank-you view is presented. | Once per page view; never substitutes for submit success. |

The canonical unique-lead metric is unique rows in PostgreSQL. Browser success may include a repeat
submission because duplicate status is deliberately not disclosed. Campaign reporting states this.

## Approved Properties

- `vertical`: fixed `assistencia-tecnica`.
- `landing_path`: fixed `/assistencia-tecnica`.
- `cta_location`: bounded `hero`, `mid_page`, `form`, or `footer`, where relevant.
- `form_step`: `1` or `2`, where relevant.
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`: bounded attribution.
- `gclid_present`: boolean only; never the `gclid` value.

Every event uses an explicit allowlist. Unknown event/property names are rejected in development and
tests, and safely dropped in production without exposing form data.

## Forbidden Analytics Data

Name, business name, phone, email, city, state, database/lead ID, raw `gclid`, free/open text,
selected pain/features/categories, consent detail, IP, fingerprint, error stack, SQL, and complete
form/action objects are forbidden in `dataLayer`, GTM variables, GA4, Google Ads, console logs,
screenshots, and snapshots.

## Failure and Ordering

- GTM absence, blocking, timeout, or exception cannot block form progress, persistence, or redirect.
- Success is pushed only after a public success result and before/at controlled redirect, without an
  indefinite user-visible delay.
- Direct thank-you navigation emits only `thank_you_view`.
- Double clicks are blocked while pending; rerender/hydration/development behavior must not duplicate
  one-time events.
- Google Ads conversion listens only to `lead_submit_success`, not a URL/pageview.

## Evidence

Unit tests prove allowlisting and PII rejection. E2E captures `dataLayer` for valid, invalid, error,
duplicate, direct-thank-you, blocked-GTM, and back-navigation scenarios. Final analytics docs record
GTM variables/triggers/tags and preview validation without credentials.
